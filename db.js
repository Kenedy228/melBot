const {Client} = require('pg');
require("dotenv").config();

const client = new Client({
    host: process.env.HOSTDATABASE,
    port: process.env.PORTDATABASE,
    user: process.env.USERDATABASE,
    password: process.env.PASSWORDDATABASE,
    database: process.env.DBDATABASE,
})

client.connect();

const createTable = () => {
    client.query('CREATE TABLE IF NOT EXISTS users (id BIGSERIAL PRIMARY KEY, chatid TEXT NOT NULL UNIQUE, role TEXT NOT NULL, firstname TEXT NOT NULL, lastname TEXT NOT NULL)');
    client.query('CREATE TABLE IF NOT EXISTS prices (id BIGSERIAL PRIMARY KEY, type TEXT NOT NULL, title TEXT NOT NULL, price BIGINT NOT NULL)');
    client.query('CREATE TABLE IF NOT EXISTS types (id BIGSERIAL PRIMARY KEY, type TEXT NOT NULL)');
    client.query('CREATE TABLE IF NOT EXISTS doctors (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL)');
    client.query('CREATE TABLE IF NOT EXISTS discounts (id BIGSERIAL PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL)');
}

// const insertValues = () => {
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Терапия", "Кариес от", 4500])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Терапия", "Пульпит от", 9000])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Терапия", "Периодонтит от", 10000])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Терапия", "Профессиональная гигиена от", 4000])
//     //
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Ортопедия", "Коронка на основе диоксида циркония", 20000])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Ортопедия", "Винир или коронка е.мах от", 25000])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Ортопедия", "Коронка на основе из металлокерамики от", 14000])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Ортопедия", "Коронка на импланте из диоксида циркония", 31000])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Ортопедия", "Коронка на импланте из металлокерамики", 27000])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Ортопедия", "Съемное протезирование от", 20000])
//     //
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Хирургическая стоматология", "Удаление зубов от", 3500])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Хирургическая стоматология", "Синус лифтинг от", 25000])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Хирургическая стоматология", "Установка импланта п-во Ю.Корея", 35000])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Хирургическая стоматология", "Установка импланта п-во Германия", 38500])
//     //
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Ортодонтическое лечение", "Лечение пластиночными аппаратами от", 15000])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Ортодонтическое лечение", "Лечение ортодонтическим трейнером от", 11500])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Ортодонтическое лечение", "Лечение брекет-системами от", 35000])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Ортодонтическое лечение", "Лечение нёбным расширителем (БНР) от", 30000])
//
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Детская стоматология", "Консультация, осмотр", 400])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Детская стоматология", "Лечение кариеса молочного зуба от", 3000])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Детская стоматология", "Лечение кариеса постоянного зуба от", 4500])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Детская стоматология", "Лечение пульпита молочного зуба от", 6000])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Детская стоматология", "Лечение пульпита постоянного зуба от", 7000])
//     // client.query("INSERT INTO prices (type, title, price) VALUES ($1, $2, $3)", ["Детская стоматология", "Удаление молочного зуба от", 1000])
//     //
//     // client.query("INSERT INTO types (type) VALUES ($1)", ["Терапия"])
//     // client.query("INSERT INTO types (type) VALUES ($1)", ["Ортопедия"])
//     // client.query("INSERT INTO types (type) VALUES ($1)", ["Хирургическая стоматология"])
//     // client.query("INSERT INTO types (type) VALUES ($1)", ["Ортодонтическое лечение"])
//     // client.query("INSERT INTO types (type) VALUES ($1)", ["Детская стоматология"])
//     //
//     // client.query("INSERT INTO doctors (name, description) VALUES ($1, $2)", ["Ткаченко Виктор Викторович", "стоматолог-терапевт"])
//     // client.query("INSERT INTO doctors (name, description) VALUES ($1, $2)", ["Зуева Татьяна Владимировна", "стоматолог-терапевт"])
//     // client.query("INSERT INTO doctors (name, description) VALUES ($1, $2)", ["Миногин Владимир Владимирович", "стоматолог-хирург"])
//     // client.query("INSERT INTO doctors (name, description) VALUES ($1, $2)", ["Литвинский Антон Геннадьевич", "стоматолог-ортопед"])
//     // client.query("INSERT INTO doctors (name, description) VALUES ($1, $2)", ["Базанова Анна Вячеславовна", "стоматолог-терапевт"])
//     // client.query("INSERT INTO doctors (name, description) VALUES ($1, $2)", ["Финогеева Анна Валерьевна", "гигиенист стоматологический"])
//     // client.query("INSERT INTO doctors (name, description) VALUES ($1, $2)", ["Лисянская Марина Евгеньевна", "стоматолог-ортодонт"])
//     // client.query("INSERT INTO doctors (name, description) VALUES ($1, $2)", ["Орлова Ольга Анатольевна", " стоматолог-хирург"])
//
// }

const selectAll = () => {

}

createTable();
insertValues();
selectAll();

module.exports.client = client;



