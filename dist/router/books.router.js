"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const books_controller_1 = require("../controller/books.controller");
const booksRouter = (0, express_1.Router)();
booksRouter.get('/', books_controller_1.getBooks);
booksRouter.get('/detail/:id', books_controller_1.getBooksDetail);
exports.default = booksRouter;
