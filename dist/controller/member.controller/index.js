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
exports.getMember = exports.createMember = void 0;
const uuid_1 = require("uuid");
const util_1 = __importDefault(require("util"));
const connection_1 = __importDefault(require("../../connection"));
const query = util_1.default.promisify(connection_1.default.query).bind(connection_1.default);
const uid = (0, uuid_1.v4)();
const createMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { first_name, last_name, email, phone_number, address, id_card_number } = req.body;
        if (!first_name || !last_name || !email || !phone_number || !address || !id_card_number)
            throw { msg: 'Harap diisi terlebih dahulu', status: 400 };
        if (id_card_number.length < 15)
            throw { msg: 'Harap masukan nomor ID CARD dengan benar', status: 400 };
        const id = uid;
        console.log(id);
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        // a0415957-cd6b-4cee-b491-505c603022f4
        const members_id = `MMBR-${id}-${year}${month}${day}`;
        yield query({
            sql: 'insert into members (id, first_name, last_name, email, phone_number, address, id_card_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
            values: [members_id, first_name, last_name, email, phone_number, address, id_card_number]
        });
        res.status(201).json({
            error: false,
            message: 'Berhasil sekarang anda sudah menjadi member',
            data: []
        });
    }
    catch (error) {
        res.status(error.status || 500).json({
            error: false,
            message: error.msg || error,
            data: []
        });
    }
});
exports.createMember = createMember;
const getMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataMember = yield query({ sql: 'select * from members' });
        if (dataMember.length == 0)
            throw { msg: 'Data kosong', status: 400 };
        res.status(200).json({
            error: false,
            message: 'Berhasil menampilkan data',
            data: dataMember
        });
    }
    catch (error) {
        res.status(error.status || 500).json({
            error: false,
            message: error.msg || 'Ada kesalahan di server',
            data: []
        });
    }
});
exports.getMember = getMember;
