"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const member_controller_1 = require("../controller/member.controller");
const memberRoute = (0, express_1.Router)();
memberRoute.post('/', member_controller_1.createMember);
memberRoute.get('/', member_controller_1.getMember);
exports.default = memberRoute;
