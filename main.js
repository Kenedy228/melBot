const Bot = require("node-telegram-bot-api");
const db = require("./db");
const express = require("express");
const cors = require("cors");
const Nodemailer = require("nodemailer");

const token = "5946888409:AAEmPbBvsoBEf-IWALp3iBWaThjS33G7aJQ";
const url = "https://famous-sfogliatella-4b46e3.netlify.app";
const port = 8000;

const app = express();
app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log("Server started at port " + port);
});

const test = {
    reply_markup: {
        inline_keyboard:[
            [{text: "Заполните форму", web_app: {url}}]
        ]
    }
}

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
            bot.sendMessage(chatID, `Для дальнейшего пользования чат-ботом необходимо дать Ваше согласие на обработку персональных данных.`, createKeyboard([{text: "Согласен", callback_data: "approve"}]));
        }


    })

    bot.on('callback_query', (msg) => {
        chatID = msg.message.chat.id;

        if (msg.data === "approve") {
            bot.sendMessage(chatID, `Выберите категорию`, createKeyboard(
                [{text: "Оставить заявку на прием", callback_data: "appointment"}],
                [{text: "Наши врачи", callback_data: "doctors"}],
                [{text: "Цены", callback_data: "prices"}], 
                [{text: "Акции", callback_data: "discounts"}], 
                [{text: "Чат-бот", callback_data: "info"}])
            );
        }

        if (msg.data === "appointment") {
            bot.sendMessage(chatID, "Заполните форму по ссылке", test)
        }

    })
}

function createKeyboard(...args) {
    return ({
        reply_markup: {
            inline_keyboard: args
        }
    });
}

app.get("/web-data", async function(req, res) {
    const {name, phone, comment, queryId} = req.body;

    try {
        await bot.answerWebAppQuery(queryId, {
            type: "article",
            id: queryId,
            title: "Успешная запись",
            input_message_content: {message_text: `Поздравляем, вы записались!\nНаш менеджер перезвонит Вам в ближайшее время!`}
        })

        async function sendMail() {
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

        await sendMail();
    } catch(e) {
        await bot.answerWebAppQuery(queryId, {
            type: "article",
            id: queryId,
            title: "Ошибка записи",
            input_message_content: {message_text: `Не удалось оформить запись`}
        })
    }
})

start();


