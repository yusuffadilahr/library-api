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
exports.loginAdmin = void 0;
const util_1 = __importDefault(require("util"));
const connection_1 = __importDefault(require("../../connection"));
const date_fns_1 = require("date-fns");
const query = util_1.default.promisify(connection_1.default.query).bind(connection_1.default);
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const data = yield query({
            sql: `SELECT * FROM staffs 
            join staff_schedule on staffs.staff_schedule_id = staff_schedule.id
            join locations on staffs.locations_id = locations.id
            where username = ? and password = ?`,
            values: [username, password]
        });
        const checkedSchedule = (0, date_fns_1.isAfter)((0, date_fns_1.format)(new Date(), 'yyyy-MM-dd kk:mm:ss'), `${(0, date_fns_1.format)(new Date(), 'yyyy-MM-dd')} ${data[0].start_schedule}:00`)
            && (0, date_fns_1.isBefore)((0, date_fns_1.format)(new Date(), 'yyyy-MM-dd kk:mm:ss'), `${(0, date_fns_1.format)(new Date(), 'yyyy-MM-dd')} ${data[0].end_schedule}:00`);
        if (!checkedSchedule)
            throw { msg: 'Anda membuka pada saat diluar jam kerja', status: 400 };
        if (data.length == 0)
            throw { msg: 'Username Password salah!', status: 400 };
        res.status(200).json({
            error: false,
            message: 'Berhasil masuk',
            data: [{
                    id: data[0].id,
                    username: data[0].username,
                    location: data[0].location,
                    firstname: data[0].first_name,
                    lastname: data[0].last_name
                }]
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
exports.loginAdmin = loginAdmin;
