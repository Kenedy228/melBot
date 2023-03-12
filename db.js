const {Client} = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Kenedy228',
    database: 'test'
})

client.connect();

const createTable = () => {
    client.query('CREATE TABLE IF NOT EXISTS users (id BIGSERIAL PRIMARY KEY, chatid TEXT NOT NULL UNIQUE, role TEXT NOT NULL, firstname TEXT, lastname TEXT, phone TEXT)');
    client.query('CREATE TABLE IF NOT EXISTS prices (id BIGSERIAL PRIMARY KEY, doctor TEXT NOT NULL, title TEXT NOT NULL, price BIGINT NOT NULL)');
    client.query('CREATE TABLE IF NOT EXISTS doctors (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL)');
    client.query('CREATE TABLE IF NOT EXISTS discounts (id BIGSERIAL PRIMARY KEY, image TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL)');
}

const insertValues = () => {
    // client.query(`INSERT INTO doctors (name, description) VALUES ($1, $2)`, ['Ткаченко Виктор Викторович', 'стоматолог-терапевт'])
    // client.query(`INSERT INTO doctors (name, description) VALUES ($1, $2)`, ['Зуева Татьяна Владимировна', 'стоматолог-терапевт'])
    // client.query(`INSERT INTO doctors (name, description) VALUES ($1, $2)`, ['Миногин Владимир Владимирович', 'стоматолог-хирург'])
    // client.query(`INSERT INTO doctors (name, description) VALUES ($1, $2)`, ['Литвинский Антон Геннадьевич', 'стоматолог-ортопед'])
    // client.query(`INSERT INTO doctors (name, description) VALUES ($1, $2)`, ['Базанова Анна Вячеславовна', 'стоматолог-терапевт детский'])
    // client.query(`INSERT INTO doctors (name, description) VALUES ($1, $2)`, ['Финогеева Анна Валерьевна', 'гигиенист стоматологический'])
    // client.query(`INSERT INTO doctors (name, description) VALUES ($1, $2)`, ['Лисянская Марина Евгеньевна', 'стоматолог-ортодонт'])
    // client.query(`INSERT INTO doctors (name, description) VALUES ($1, $2)`, ['Орлова Ольга Анатольевна', 'стоматолог-хирург'])
}

const selectAll = () => {
    
}

createTable();
insertValues();
selectAll();

module.exports.client = client;



