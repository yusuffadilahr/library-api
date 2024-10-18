"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const ascii_text_1 = require("./utils/ascii.text");
const connection_1 = __importDefault(require("./connection"));
const router_1 = __importDefault(require("./router"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
const corsOptions = {
    origin: '*',
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(router_1.default);
connection_1.default.connect();
app.listen(port, () => {
    console.log(ascii_text_1.asciiText);
});
