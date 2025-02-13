"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = __importDefault(require("./auth.router"));
const member_router_1 = __importDefault(require("./member.router"));
const member_transaction_router_1 = __importDefault(require("./member.transaction.router"));
const books_router_1 = __importDefault(require("./books.router"));
const router = (0, express_1.Router)();
router.use('/auth', auth_router_1.default);
router.use('/member', member_router_1.default);
router.use('/transaction', member_transaction_router_1.default);
router.use('/books', books_router_1.default);
exports.default = router;
