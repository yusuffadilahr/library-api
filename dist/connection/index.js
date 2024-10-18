"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const ascii_connect_1 = require("../utils/ascii.connect");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DB_PASS = process.env.DB_PASSWORD;
const db = mysql2_1.default.createConnection({
    host: 'localhost',
    user: 'root',
    password: DB_PASS, // pw db
    database: 'db_perpustakaan' // nama db
});
db.connect((err) => {
    if (err)
        return console.log(err.message, 'ERROR');
    console.log(ascii_connect_1.asciiConnect);
});
exports.default = db;
