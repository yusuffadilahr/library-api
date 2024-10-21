import {Router} from 'express'
import { getBooks, getBooksDetail } from '../controller/books.controller'

const booksRouter = Router()
booksRouter.get('/', getBooks)
booksRouter.get('/detail/:id', getBooksDetail)

export default booksRouter