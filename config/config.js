require('dotenv').config()
module.exports = {
    "development": {
        "username": DB_USERNAME,
        "password": DB_PASSWORD,
        "database": DB_NAME,
        "host": DB_HOST,
        "dialect": "mysql"
    },
    "test": {
        "username": "FloreaCT",
        "password": "qwer",
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "username": "Floreact",
        "password": "qwer",
        "database": "database_production",
        "host": "127.0.0.1",
        "dialect": "mysql"
    }
}