const Bot = require("node-telegram-bot-api");
const db = require("./db");

const token = "5946888409:AAEmPbBvsoBEf-IWALp3iBWaThjS33G7aJQ";

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
            bot.sendMessage(chatID, "Заполните форму по ссылке", createKeyboard([{text: "Заполните форму", web_app: {url: "https://127.0.0.1:5500/index.html"}}]))
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

start();

