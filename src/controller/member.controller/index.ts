import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import util from 'util'
import db from '../../connection'

const query = util.promisify(db.query).bind(db)
const uid = uuid()

export const createMember = async (req: Request, res: Response) => {
    try {
        const { first_name, last_name, email, phone_number, address, id_card_number } = req.body
        if (!first_name || !last_name || !email || !phone_number || !address || !id_card_number) throw { msg: 'Harap diisi terlebih dahulu', status: 400 }
        if (id_card_number.length < 15) throw { msg: 'Harap masukan nomor ID CARD dengan benar', status: 400 }

        const id = uid
        console.log(id)
        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()

        // a0415957-cd6b-4cee-b491-505c603022f4


        const members_id = `MMBR-${id}-${year}${month}${day}`

        await query({
            sql: 'insert into members (id, first_name, last_name, email, phone_number, address, id_card_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
            values: [members_id, first_name, last_name, email, phone_number, address, id_card_number]
        })

        res.status(201).json({
            error: false,
            message: 'Berhasil sekarang anda sudah menjadi member',
            data: []
        })

    } catch (error: any) {
        res.status(error.status || 500).json({
            error: false,
            message: error.msg || error,
            data: []
        })
    }
}

export const getMember = async (req: Request, res: Response) => {
    try {
        const dataMember: any = await query({ sql: 'select * from members' })
        if (dataMember.length == 0) throw { msg: 'Data kosong', status: 400 }

        res.status(200).json({
            error: false,
            message: 'Berhasil menampilkan data',
            data: dataMember
        })
        
    } catch (error: any) {
        res.status(error.status || 500).json({
            error: false,
            message: error.msg || 'Ada kesalahan di server',
            data: []
        })
    }
}