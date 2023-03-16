const Bot = require("node-telegram-bot-api");
const db = require("./db");
const Nodemailer = require("nodemailer");

const token = "5946888409:AAEmPbBvsoBEf-IWALp3iBWaThjS33G7aJQ";
const url = "https://famous-sfogliatella-4b46e3.netlify.app/";


const bot = new Bot(token, {polling: true});

bot.setMyCommands([
    {command: "/appointment", description: "appointment"},
    {command: "/doctors", description: "doctors"},
    {command: "/prices", description: "prices"},
    {command: "/discounts", description: "discounts"},
    {command: "/info", description: "info"}
])

function start() {
    bot.on('message', (msg) => {
        const chatID = msg.chat.id;

        if (msg.text === "/start") {
            bot.sendMessage(chatID, `Для дальнейшего пользования чат-ботом необходимо дать Ваше согласие на обработку персональных данных.`, createKeyboard(inline_keyboard, [{text: "Согласен", callback_data: "approve"}]));
        }

        if (msg.web_app_data.data) {
            try{
                const newData = JSON.parse(msg.web_app_data.data);
                bot.sendMessage(chatID, "Спасибо за заявку.\nНаш менеджер свяжется с Вами в ближайшее время!");
                sendMail(newData.name, newData.phone, newData.comment);

            } catch(e) {
                console.log(e);
            }
        }
    })

    bot.on('callback_query', (msg) => {
        chatID = msg.message.chat.id;

        if (msg.data === "approve") {
            bot.sendMessage(chatID, `Выберите категорию`, createKeyboard(inline_keyboard,
                [{text: "Оставить заявку на прием", callback_data: "appointment"}],
                [{text: "Наши врачи", callback_data: "doctors"}],
                [{text: "Цены", callback_data: "prices"}], 
                [{text: "Акции", callback_data: "discounts"}], 
                [{text: "Чат-бот", callback_data: "info"}])
            );
        }

        if (msg.data === "appointment") {
            bot.sendMessage(chatID, "Заполните форму по ссылке", createKeyboard(keyboard, [{text: "Заполните форму", web_app: {url}}]))
        }

    })
}

function createKeyboard(type, ...args) {
    return ({
        reply_markup: {
            type: args
        }
    });
}

async function sendMail(name, phone, comment) {
    let transporter = Nodemailer.createTransport({
        host: "smtp.gmail.com",
        post: 465,
        secure: true,
        auth: {
            user: "zhuravleffdanilka2303@gmail.com",
            pass: "jmecgiapwyxilrwz"
        }
    });

    let info = await transporter.sendMail({
        from: "TELEGRAM BOT <zhuravleffdanilka2303@gmail.com>",
        to: "zhuravleffdanilka2004@mail.ru",
        subject: 'запись на прием',
        text: `ФИО пациента: ${name}\nНомер телефона пациента: ${phone}\nКомментарий: ${comment}`
    });

    console.log('message is sent', info.messageId);

}

start();


