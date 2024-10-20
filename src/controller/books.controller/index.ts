import { Request, Response } from "express";
import util from 'util'
import db from "../../connection";

const query = util.promisify(db.query).bind(db)
// interface IBooks {
//     id: number,
//     title: string,
//     description: string,
//     author: string,
//     publish_year: string
// }

export const getBooks = async (req: Request, res: Response) => {
    try {
        const dataBooks: any = await query({
            sql: 'select * from books'
        })

        if (dataBooks.length == 0) throw { msg: 'Data tidak ada' }
        console.log(dataBooks);

        res.status(200).json({
            error: false,
            message: 'Berhasil menampilkan data buku',
            data: dataBooks
        })
    } catch (error: any) {
        res.status(error.status || 500).json({
            error: true,
            message: error.msg || 'Ada kesalahan server',
            data: []
        })
    }
}

export const getBooksDetail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const dataBooksDetail: any = await query({
            sql: 'select * from books where id = ?',
            values: [id]
        })

        if (dataBooksDetail.length == 0) throw { msg: 'Data buku tidak ada' }
        res.status(200).json({
            error: false,
            message: 'Berhasil menampilkan data buku',
            data: dataBooksDetail
        })
        console.log(dataBooksDetail)
    } catch (error: any) {
        res.status(error.status || 500).json({
            error: true,
            message: error.msg || 'Ada kesalahan server',
            data: []
        })
    }
}