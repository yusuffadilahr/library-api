"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDataTransaction = exports.detailsTransaction = exports.postDataLending = exports.searchBooks = exports.searchMemberMaxPeminjaman = exports.searchAllMember = exports.getDataTransaction = void 0;
const util_1 = __importDefault(require("util"));
const connection_1 = __importDefault(require("../../connection"));
const date_fns_1 = require("date-fns");
const query = util_1.default.promisify(connection_1.default.query).bind(connection_1.default);
// -- start code
const getDataTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataTransaction = yield query({
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
        });
        console.log(dataTransaction);
        const response = dataTransaction.map((item) => {
            return {
                id: item.member_trc_id,
                firstname: item.first_name,
                lastname: item.last_name,
                dueDate: item.due_date,
                returnDate: item.return_date,
                booksId: item.books_id
            };
        });
        if (response.length == 0)
            throw { msg: 'Data belum ada', status: 404 };
        res.status(200).json({
            error: false,
            message: 'Berhasil mengambil data',
            data: dataTransaction
        });
    }
    catch (error) {
        res.status(error.status || 500).json({
            error: true,
            message: error.msg || 'Ada kesalahan server',
            data: []
        });
    }
});
exports.getDataTransaction = getDataTransaction;
const searchAllMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { member } = req.query;
        const memberLike = '%' + member + '%';
        const data = yield query({
            sql: `select * from members where id like '${memberLike}'`,
        });
        if (data.length == 0)
            throw { msg: 'Data tidak tersedia', status: 404 };
        res.status(200).json({
            error: false,
            message: 'Berhasil menampilkan data',
            data: data
        });
    }
    catch (error) {
        res.status(error.status || 500).json({
            error: true,
            message: error.msg,
            data: []
        });
    }
});
exports.searchAllMember = searchAllMember;
const searchMemberMaxPeminjaman = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { member } = req.query;
        const memberLike = '%' + member + '%';
        const data = yield query({
            sql: `select members_id, count(members_id) as total_peminjaman from member_transaction where members_id like '${memberLike}'
            group by members_id`
        });
        if (data.length == 0)
            throw { msg: 'Data tidak tersedia', status: 404 };
        res.status(200).json({
            error: false,
            message: 'Berhasil menambahkan data',
            data: data
        });
    }
    catch (error) {
        res.status(error.status || 500).json({
            error: true,
            message: error.msg,
            data: []
        });
    }
});
exports.searchMemberMaxPeminjaman = searchMemberMaxPeminjaman;
const searchBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.query;
        console.log(title);
        const searchTitle = '%' + title + '%';
        const dataSearch = yield query({
            sql: `select * from books where title like '${searchTitle}' or author like '${searchTitle}'`
        });
        if (dataSearch.length == 0)
            throw { msg: 'Buku tidak tersedia', status: 404 };
        res.status(200).json({
            error: false,
            message: 'Berhasil menampilkan data books',
            data: dataSearch
        });
    }
    catch (error) {
        res.status(error.status || 500).json({
            error: true,
            message: error.msg,
            data: []
        });
    }
});
exports.searchBooks = searchBooks;
const postDataLending = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { members_id, books_id, staff_id } = req.body;
        const date = (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd');
        const dueDate = (0, date_fns_1.addDays)(date, 3);
        const dueDateString = (0, date_fns_1.format)(dueDate, 'yyyy-MM-dd');
        if (!members_id || !books_id || !staff_id)
            throw { msg: 'Harap diisi dan dilengkapi terlebih dahulu', status: 400 };
        const dataBook = yield query({
            sql: `select * from books where id = ?`,
            values: [books_id]
        });
        if (dataBook.length == 0)
            throw { msg: 'Buku tidak tersedia', status: 404 };
        const dataMember = yield query({
            sql: `select * from members where id = ?`,
            values: [members_id]
        });
        if (dataMember.length == 0)
            throw { msg: 'Member tidak ditemukan', status: 404 };
        const checkedMemberBooks = yield query({
            sql: `select * from member_transaction where members_id = ? and due_date = ?`,
            values: [members_id, date]
        });
        if (checkedMemberBooks.length > 5)
            throw { msg: 'Batas peminjaman sudah maximal, silahkan lakukan transaksi pada esok hari', status: 400 };
        const checkedBooksData = yield query({
            sql: `select * from member_transaction where members_id = ?
             and books_id = ? and due_date = ?`,
            values: [members_id, books_id, date]
        });
        if (checkedBooksData != 0)
            throw { msg: `Member ini sedang meminjam buku yang dipilih`, status: 409 };
        yield query({
            sql: `insert into member_transaction(staff_id, members_id, due_date, return_date, books_id) values (?, ?, ?, ?, ?)`,
            values: [staff_id, members_id, date, dueDateString, books_id]
        });
        res.status(200).json({
            error: false,
            message: 'Berhasil menambah data',
            data: []
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.status || 500).json({
            error: true,
            message: error.msg || 'Ada kesalahan server',
            data: []
        });
    }
});
exports.postDataLending = postDataLending;
const detailsTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getDataTransaction = yield query({
            sql: `select * from member_transaction where id = ?`,
            values: [id]
        });
        console.log(getDataTransaction);
        const checkedDate = (0, date_fns_1.format)(getDataTransaction[0].return_date, 'yyyy-MM-dd');
        const dataSplit = checkedDate.split('-');
        const dataEks = Number(dataSplit[0]) + Number(dataSplit[1]) + Number(dataSplit[2]);
        const date = new Date();
        const dateYear = date.getFullYear();
        const dateMonth = date.getMonth();
        const dateDate = date.getDate();
        const dateNow = Number(dateYear + dateMonth + dateDate);
        const dataSelisih = dateNow - dataEks;
        let charge = 0;
        if (dataSelisih <= 0) {
            charge = 0;
        }
        else {
            charge = 3000 * dataSelisih;
        }
        yield query({
            sql: `update member_transaction set penalty_charge = ? where id = ?`,
            values: [charge, id]
        });
        const data = yield query({
            sql: `select * from member_transaction
            join members on member_transaction.members_id = members.id
            join books on member_transaction.books_id = books.id
            where member_transaction.id = ?`,
            values: [id]
        });
        res.status(200).json({
            error: false,
            message: 'berhasil',
            data: data
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.status || 500).json({
            error: true,
            message: error.msg || error.message,
            data: []
        });
    }
});
exports.detailsTransaction = detailsTransaction;
const deleteDataTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = yield query({
            sql: `select * from member_transaction where id = ?`,
            values: [id]
        });
        if (data[0].id == id) {
            console.log('GAS HAPUS');
        }
        console.log(data);
    }
    catch (error) {
        res.status(error.status || 500).json({
            error: true,
            message: error.msg || 'Ada kesalahan server',
            data: []
        });
    }
});
exports.deleteDataTransaction = deleteDataTransaction;
