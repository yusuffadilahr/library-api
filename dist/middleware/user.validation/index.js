"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const userValidation = (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            throw { msg: 'Harap diisi terlebih dahulu', status: 400 };
        next();
    }
    catch (error) {
        res.status(error.status || 500).json({
            error: true,
            message: error.msg || 'Something went wrong!',
            data: []
        });
    }
};
exports.userValidation = userValidation;
