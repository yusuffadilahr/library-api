"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const member_transaction_controller_1 = require("../controller/member.transaction.controller");
const transactionRouter = (0, express_1.Router)();
// transactionRouter.post('/', createDataTransaction)
transactionRouter.get('/', member_transaction_controller_1.getDataTransaction);
transactionRouter.get('/detail/:id', member_transaction_controller_1.detailsTransaction);
transactionRouter.delete('/detail/:id', member_transaction_controller_1.deleteDataTransaction);
transactionRouter.get('/search-member', member_transaction_controller_1.searchAllMember);
transactionRouter.get('/search-transaction', member_transaction_controller_1.searchMemberMaxPeminjaman);
transactionRouter.get('/search-books', member_transaction_controller_1.searchBooks);
transactionRouter.post('/new-data-lending', member_transaction_controller_1.postDataLending);
// ----------
// transactionRouter.get('/get-data', createNewLending)
exports.default = transactionRouter;
