import { NextFunction, Request, Response } from "express"

export const userValidation = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body
        if (!username || !password) throw { msg: 'Harap diisi terlebih dahulu', status: 400 }

        next()
    } catch (error: any) {
        res.status(error.status || 500).json({
            error: true,
            message: error.msg || 'Something went wrong!',
            data: []
        })
    }
}