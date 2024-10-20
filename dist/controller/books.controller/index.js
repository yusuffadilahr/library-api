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
exports.getBooksDetail = exports.getBooks = void 0;
const util_1 = __importDefault(require("util"));
const connection_1 = __importDefault(require("../../connection"));
const query = util_1.default.promisify(connection_1.default.query).bind(connection_1.default);
// interface IBooks {
//     id: number,
//     title: string,
//     description: string,
//     author: string,
//     publish_year: string
// }
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataBooks = yield query({
            sql: 'select * from books'
        });
        if (dataBooks.length == 0)
            throw { msg: 'Data tidak ada' };
        console.log(dataBooks);
        res.status(200).json({
            error: false,
            message: 'Berhasil menampilkan data buku',
            data: dataBooks
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
exports.getBooks = getBooks;
const getBooksDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const dataBooksDetail = yield query({
            sql: 'select * from books where id = ?',
            values: [id]
        });
        if (dataBooksDetail.length == 0)
            throw { msg: 'Data buku tidak ada' };
        res.status(200).json({
            error: false,
            message: 'Berhasil menampilkan data buku',
            data: dataBooksDetail
        });
        console.log(dataBooksDetail);
    }
    catch (error) {
        res.status(error.status || 500).json({
            error: true,
            message: error.msg || 'Ada kesalahan server',
            data: []
        });
    }
});
exports.getBooksDetail = getBooksDetail;
