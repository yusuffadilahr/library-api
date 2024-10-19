import { Router } from "express";
import { deleteDataTransaction,  detailsTransaction, getDataTransaction, postDataLending, searchBooks, searchMemberMaxPeminjaman } from "../controller/member.transaction.controller";

const transactionRouter = Router()
// transactionRouter.post('/', createDataTransaction)
transactionRouter.get('/', getDataTransaction)
transactionRouter.get('/detail/:id', detailsTransaction)
transactionRouter.delete('/detail/:id', deleteDataTransaction)
transactionRouter.get('/search-member', searchMemberMaxPeminjaman)
transactionRouter.get('/search-books', searchBooks)
transactionRouter.post('/new-data-lending', postDataLending)

// ----------
// transactionRouter.get('/get-data', createNewLending)

export default transactionRouter