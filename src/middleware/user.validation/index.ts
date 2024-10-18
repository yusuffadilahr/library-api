import { NextFunction, Request, Response } from "express"

export const userValidation = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body
        if (!username || !password) throw { message: 'Harap diisi terlebih dahulu', status: 400 }

        next()
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error,
            data: []
        })
    }
}