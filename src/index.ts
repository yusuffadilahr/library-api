import express from 'express'
import dotenv from 'dotenv'
import { asciiText } from './utils/ascii.text'
import db from './connection'
import router from './router'
import cors from 'cors'

dotenv.config()
const port = process.env.PORT

const app = express()

const corsOptions = {
    origin: '*',
    credentials: true
}

app.use(cors(corsOptions))

app.use(express.json())
app.use(router)
db.connect()

app.listen(port, ()=> {
    console.log(asciiText)
})