import { Request, Response } from "express";
import util from 'util'
import db from "../../connection";
import { addDays, format, isAfter } from "date-fns";

const query = util.promisify(db.query).bind(db)

// -- start code
export const getDataTransaction = async (req: Request, res: Response) => {
    try {
        const dataTransaction: any = await query({
            sql: `select 
            member_transaction.id AS member_trc_id,
            member_transaction.created_at,
            member_transaction.due_date,
            member_transaction.return_date,
            member_transaction.penalty_charge,
            member_transaction.books_id,
            members.id AS member_id,
            members.first_name,
            members.last_name,
            members.email,
            members.phone_number,
            members.address,
            members.id_card_number,
            books.id AS book_id,
            books.title,
            books.description,
            books.author,
            books.publish_year
            from member_transaction
            join members on member_transaction.members_id = members.id
            join books on member_transaction.books_id = books.id`
        })

        console.log(dataTransaction)

        const response = dataTransaction.map((item: any) => {
            return {
                id: item.member_trc_id,
                firstname: item.first_name,
                lastname: item.last_name,
                dueDate: item.due_date,
                returnDate: item.return_date,
                booksId: item.books_id
            }
        })

        if (response.length == 0) throw { msg: 'Data belum ada', status: 404 }
        res.status(200).json({
            error: false,
            message: 'Berhasil mengambil data',
            data: dataTransaction
        })
    } catch (error: any) {
        res.status(error.status || 500).json({
            error: true,
            message: error.msg || 'Ada kesalahan server',
            data: []
        })
    }
}

export const searchAllMember = async (req: Request, res: Response) => {
    try {
        const { member } = req.query
        const memberLike = '%' + member + '%'
        const data: any = await query({
            sql: `select * from members where id like '${memberLike}'`,
        })
        if (data.length == 0) throw { msg: 'Data tidak tersedia', status: 404 }

        res.status(200).json({
            error: false,
            message: 'Berhasil menampilkan data',
            data: data
        })

    } catch (error: any) {
        res.status(error.status || 500).json({
            error: true,
            message: error.msg,
            data: []
        })
    }
}

export const searchMemberMaxPeminjaman = async (req: Request, res: Response) => {
    try {
        const { member } = req.query
        const memberLike = '%' + member + '%'
        const data: any = await query({
            sql: `select members_id, count(members_id) as total_peminjaman from member_transaction where members_id like '${memberLike}'
            group by members_id`
        })
        if (data.length == 0) throw { msg: 'Data tidak tersedia', status: 404 }

        res.status(200).json({
            error: false,
            message: 'Berhasil menambahkan data',
            data: data
        })

    } catch (error: any) {
        res.status(error.status || 500).json({
            error: true,
            message: error.msg,
            data: []
        })
    }
}

export const searchBooks = async (req: Request, res: Response) => {
    try {
        const { title } = req.query
        console.log(title)

        const searchTitle = '%' + title + '%'
        const dataSearch: any = await query({
            sql: `select * from books where title like '${searchTitle}' or author like '${searchTitle}'`
        })

        if (dataSearch.length == 0) throw { msg: 'Buku tidak tersedia', status: 404 }

        res.status(200).json({
            error: false,
            message: 'Berhasil menampilkan data books',
            data: dataSearch
        })

    } catch (error: any) {
        res.status(error.status || 500).json({
            error: true,
            message: error.msg,
            data: []
        })
    }
}

export const postDataLending = async (req: Request, res: Response) => {
    try {
        const { members_id, books_id, staff_id } = req.body

        const date = format(new Date(), 'yyyy-MM-dd')
        const dueDate = addDays(date, 3)
        const dueDateString = format(dueDate, 'yyyy-MM-dd')

        if (!members_id || !books_id || !staff_id) throw { msg: 'Harap diisi dan dilengkapi terlebih dahulu', status: 400 }

        const dataBook: any = await query({
            sql: `select * from books where id = ?`,
            values: [books_id]
        })
        if (dataBook.length == 0) throw { msg: 'Buku tidak tersedia', status: 404 }

        const dataMember: any = await query({
            sql: `select * from members where id = ?`,
            values: [members_id]
        })
        if (dataMember.length == 0) throw { msg: 'Member tidak ditemukan', status: 404 }

        const checkedMemberBooks: any = await query({
            sql: `select * from member_transaction where members_id = ? and due_date = ?`,
            values: [members_id, date]
        })
        if (checkedMemberBooks.length > 5) throw { msg: 'Batas peminjaman sudah maximal, silahkan lakukan transaksi pada esok hari', status: 400 }

        const checkedBooksData: any = await query({
            sql: `select * from member_transaction where members_id = ?
             and books_id = ? and due_date = ?`,
            values: [members_id, books_id, date]
        })
        if (checkedBooksData != 0) throw { msg: `Member ini sedang meminjam buku yang dipilih`, status: 409 }

        await query({
            sql: `insert into member_transaction(staff_id, members_id, due_date, return_date, books_id) values (?, ?, ?, ?, ?)`,
            values: [staff_id, members_id, date, dueDateString, books_id]
        })

        res.status(200).json({
            error: false,
            message: 'Berhasil menambah data',
            data: []
        })

    } catch (error: any) {
        console.log(error)
        res.status(error.status || 500).json({
            error: true,
            message: error.msg || 'Ada kesalahan server',
            data: []
        })
    }
}

export const detailsTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const getDataTransaction: any = await query({
            sql: `select * from member_transaction where id = ?`,
            values: [id]
        })

        console.log(getDataTransaction)

        const checkedDate = format(getDataTransaction[0].return_date, 'yyyy-MM-dd')

        const dataSplit = checkedDate.split('-')
        const dataEks = Number(dataSplit[0]) + Number(dataSplit[1]) + Number(dataSplit[2])

        const date: any = new Date()
        const dateYear = date.getFullYear()
        const dateMonth = date.getMonth()
        const dateDate = date.getDate()

        const dateNow = Number(dateYear + dateMonth + dateDate)

        const dataSelisih = dateNow - dataEks

        let charge = 0

        if (dataSelisih <= 0) {
            charge = 0
        } else {
            charge = 3000 * dataSelisih
        }

        await query({
            sql: `update member_transaction set penalty_charge = ? where id = ?`,
            values: [charge, id]
        })

        const data = await query({
            sql: `select * from member_transaction
            join members on member_transaction.members_id = members.id
            join books on member_transaction.books_id = books.id
            where member_transaction.id = ?`,
            values: [id]
        })

        res.status(200).json({
            error: false,
            message: 'berhasil',
            data: data
        })

    } catch (error: any) {
        console.log(error)
        res.status(error.status || 500).json({
            error: true,
            message: error.msg || 'Ada kesalahan server',
            data: []
        })
    }
}

export const deleteDataTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        // const data: any = await query({
        //     sql: `select * from member_transaction where id = ?`,
        //     values: [id]
        // })

        if (!id) throw { msg: 'Data tidak ada', status: 404 }
        await query({
            sql: 'delete from member_transaction where id = ?',
            values: [id]
        })

        res.status(200).json({
            error: false,
            message: 'Buku berhasil dikembalikan',
            data: []
        })

    } catch (error: any) {
        res.status(error.status || 500).json({
            error: true,
            message: error.msg || 'Ada kesalahan server',
            data: []
        })
    }
}