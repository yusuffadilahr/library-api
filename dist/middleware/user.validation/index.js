"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const userValidation = (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            throw { message: 'Harap diisi terlebih dahulu', status: 400 };
        next();
    }
    catch (error) {
        res.status(500).json({
            error: true,
            message: error,
            data: []
        });
    }
};
exports.userValidation = userValidation;
