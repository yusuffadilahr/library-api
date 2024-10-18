"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controller/auth.controller");
const user_validation_1 = require("../middleware/user.validation");
const authRoute = (0, express_1.Router)();
authRoute.post('/login', user_validation_1.userValidation, auth_controller_1.loginAdmin);
exports.default = authRoute;
