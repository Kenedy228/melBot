const Bot = require("node-telegram-bot-api");
const db = require("./db");
const Nodemailer = require("nodemailer");
require("dotenv").config();

const bot = new Bot(process.env.TELEGRAMTOKEN, {polling: true});

function start() {
    bot.on('message', async (msg) => {
        const chatID = msg.chat.id;

        if (msg.text === "/start") {
            sendStartMessage(chatID, msg.chat.first_name, msg.chat.last_name);
        }

        if (msg.text === "Меню") {
            sendMenu(chatID);
        }

        if (msg.text === "/sendAll") {
            sendAllDiscounts(chatID);
        }

        if (msg?.web_app_data?.data) {
            const receivedData = JSON.parse(msg.web_app_data.data);
            if (receivedData.type === "Запись") {
                await bot.sendMessage(chatID, "Спасибо за заявку.\nНаш менеджер свяжется с Вами в ближайшее время!");
                await sendMail("Запись", receivedData.name, receivedData.phone, receivedData.comment);
            } else if (receivedData.type === "Отзыв") {
                await bot.sendMessage(chatID, "Спасибо за ваш отзыв.");
                await sendMail("Отзыв", receivedData.name, receivedData.review);
            }
        }
    })

    bot.on('callback_query', async (msg) => {
        chatID = msg.message.chat.id;

        if (msg.data === "approve") {
            await sendMenu(chatID);
            await bot.sendMessage(chatID, "Для офорлмения заявки на прием заполните форму, нажав на кнопку 'Оставить заявку' снизу.", createReplyKeyboard(
                [[{text: "Оставить заявку", web_app: {url: process.env.APPOINTMENTURL}}],
                    [{text: "Оставить отзыв", web_app: {url: process.env.REVIEWURL}}],
                    ["Меню"]]));
            addUser(msg);
        }

        if (msg.data === "doctors") {
            sendDoctors(chatID);
        }

        if (msg.data === "prices") {
            sendType(chatID);
        }

        if (msg.data.match(/type/)) {
            sendPrice(chatID, msg.data.slice(process.env.SLICEPARAM));
        }

        if (msg.data === "discounts") {
            sendDiscounts(chatID);
        }

        if (msg.data === "info") {
            sendInfo(chatID);
        }
    })
}

function createInlineKeyboard(...args) {
    return ({
        reply_markup: {
            inline_keyboard: args[0]
        },
    });
}

function createReplyKeyboard(...args) {
    return ({
        reply_markup: {
            keyboard: args[0],
            resize_keyboard: true,
        },
    });
}

async function sendStartMessage(chatID, firstname = "", lastname = "") {
    await bot.sendSticker(chatID, process.env.STICKER);
    await bot.sendMessage(chatID, `Здравствуйте, ${firstname} ${lastname}!\nМы рады приветствовать Вас в чат-боте авторской стоматологии МЕЛ🤗`, {parse_mode: "HTML"});
    await bot.sendMessage(chatID, "Для дальнейшего пользования чат-ботом необходимо дать Ваше согласие на обработку персональных данных.", createInlineKeyboard([[{text: "Согласен", callback_data: "approve"}]]));
}

async function sendMenu(chatID) {
    await bot.sendMessage(chatID, `Выберите категорию`, createInlineKeyboard([
        [{text: "Наши врачи", callback_data: "doctors"}],
        [{text: "Цены", callback_data: "prices"}],
        [{text: "Акции и скидки", callback_data: "discounts"}],
        [{text: "Справочная информация", callback_data: "info"}]])
    );
}

async function sendDoctors(chatID) {
    let doctorsArray = [];
    await bot.sendMessage(chatID, "В нашей клинике работают профессионалы, минимальный опыт работы которых 15 лет!")
    await db.client.query("SELECT * FROM doctors", (err, res) => {
        if (err) console.log(err);
        for (let value of res.rows) {
            doctorsArray.push(`${value.name} - ${value.description}`);
        }

        bot.sendMessage(chatID, doctorsArray.join("\n\n"));
    })
}

async function sendType(chatID) {
    let typesArray = [];
    await db.client.query("SELECT * FROM types", (err, res) => {
        if (err) console.log(err);
        for (let value of res.rows) {
            typesArray.push([{text: value.type, callback_data: `type${value.type}`}]);
        }

        bot.sendMessage(chatID, "Выберите раздел", createInlineKeyboard(typesArray))
    })
}

async function sendPrice(chatID, type) {
    let string = `🦷${type}\n`;
    await db.client.query("SELECT title, price FROM prices WHERE type = $1", [type], (err, res) => {
        if (err) console.log(err);
        for (let value of res.rows) {
            string += `${value.title} - ${value.price}₽\n`;
        }

        bot.sendMessage(chatID, string);
    })
}

async function sendDiscounts(chatID) {
    await db.client.query("SELECT title, description FROM discounts", (err, res) => {
        if (err) console.log(err);
        if (res.rows.length === 0) bot.sendMessage(chatID, "На данный момент никаких акций не проводится");
        for (let value of res.rows) {
            bot.sendMessage(chatID, `${value.title} - ${value.description}`);
        }
    })
}

async function sendInfo(chatID) {
    bot.sendMessage(chatID, "📞Контакты\n+7(4212)46-09-40\n+7(914)410-42-42\n\n🌐Веб-сайт\nhttp://melstom.ru/\n\n📩Адрес электронной почты\nmelclinic@hotmail.com\n\n📍Мы находимся по адресу\nг.Хабаровск, Восточное шоссе, 41, правая башня (правый вход) 2 этаж\nhttps://go.2gis.com/w62d6em\n\n🕛Время работы:\nбудни — с 9:00 до 19:00\nсуббота — с 9:00 до 16:00\nвоскресенье — выходной");
}

async function addUser(msg) {
    const chatid = msg.message.chat.id;
    const firstname = msg.from.first_name || "не указано";
    const lastname = msg.from.last_name || "не указано";

    await db.client.query("SELECT * FROM users WHERE chatid = $1", [chatid], (err, res) => {
        if (err) console.log(err);
        if (res.rows.length === 0) {
            db.client.query("INSERT INTO users (chatid, role, firstname, lastname) VALUES ($1, $2, $3, $4)", [chatid, "user", firstname, lastname], (err, res) => {
                if (err) console.log(err);
            })
        }
    })
}

async function sendAllDiscounts(chatID) {
    await db.client.query("SELECT role FROM users WHERE chatid = $1", [chatID], (err, res) => {
        if (err) console.log(err);
        if (res.rows[0].role === "admin") {
            bot.sendMessage(chatID, "Акции отправлены");
            db.client.query("SELECT chatid FROM users WHERE role = $1", ["user"], (err, res) => {
                if (err) console.log(err);
                for (let value of res.rows) {
                    sendDiscounts(value.chatid);
                }
            })
        }
    })
}

async function sendMail(type, ...args) {

    let transporter = Nodemailer.createTransport({
        pool: process.env.SECUREMAIL,
        host: process.env.HOSTMAIL,
        port: process.env.PORTMAIL,
        auth: {
            user: process.env.USERMAIL,
            pass: process.env.PASSWORDMAIL,
        }
    });

    if (type === "Запись") {
        let [name, phone, comment] = args;

        let info = await transporter.sendMail({
            from: process.env.USERMAIL,
            to: process.env.TOMAIL,
            subject: 'запись на прием',
            text: `ФИО пациента: ${name}\nНомер телефона пациента: ${phone}\nКомментарий: ${comment}`
        });
        console.log('message is sent', info.messageId);

    } else if (type === "Отзыв") {
        let [name, comment] = args;
        let info = await transporter.sendMail({
            from: process.env.USERMAIL,
            to: process.env.TOMAIL,
            subject: 'отзыв',
            text: `ФИО пациента: ${name}\nОтзыв: ${comment}`
        });
        console.log('message is sent', info.messageId);
    }
}


start();


