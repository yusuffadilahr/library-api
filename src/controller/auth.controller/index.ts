import util from 'util'
import db from '../../connection'
import { Request, Response } from 'express'
import { format, isAfter, isBefore } from 'date-fns'
import { IStaff } from './types'

const query = util.promisify(db.query).bind(db)

export const loginAdmin = async (req: Request, res: Response) => {
    interface IStaffNew extends IStaff {
        staff_schedule_id: number,
        start_schedule: string,
        end_schedule: string,
        location: string,
        city: string,
        province: string,
        address: string,
        phone_number: string
    }
    try {
        const { username, password } = req.body
        const data: any = await query({
            sql: `SELECT * FROM staffs 
            join staff_schedule on staffs.staff_schedule_id = staff_schedule.id
            join locations on staffs.locations_id = locations.id
            where username = ? and password = ?`,
            values: [username, password]
        }) as IStaffNew

        const checkedSchedule = isAfter(format(new Date(), 'yyyy-MM-dd kk:mm:ss'), `${format(new Date(), 'yyyy-MM-dd')} ${data[0].start_schedule}:00`)
            && isBefore(format(new Date(), 'yyyy-MM-dd kk:mm:ss'), `${format(new Date(), 'yyyy-MM-dd')} ${data[0].end_schedule}:00`)

        if (!checkedSchedule) throw { msg: 'Anda membuka pada saat diluar jam kerja', status: 400 }
        if (data.length == 0) throw { msg: 'Username Password salah!', status: 400 }
        
        res.status(200).json({
            error: false,
            message: 'Berhasil masuk',
            data: [{
                id: data[0].id,
                username: data[0].username,
                location: data[0].location,
                firstname: data[0].first_name,
                lastname: data[0].last_name
            }]
        })

    } catch (error: any) {
        res.status(error.status || 500).json({
            error: true,
            message: error.msg,
            data: []
        })
    }
}