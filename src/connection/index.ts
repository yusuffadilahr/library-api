import mysql from 'mysql2'
import { asciiConnect } from '../utils/ascii.connect';
import dotenv from 'dotenv'

dotenv.config()
const DB_PASS = process.env.DB_PASSWORD

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: DB_PASS, // pw db
    database: 'db_perpustakaan' // nama db
})

db.connect((err)=> {
    if(err) return console.log(err.message, 'ERROR');
    
    console.log(asciiConnect)
})

export default db