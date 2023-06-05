import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "../../lib/prismadb";
import SmsHelper from "../../module/sms/SmsHelper";
import {getServerSession, getServersession} from "next-auth/next";
import {authOptions} from "./auth/[...nextauth]";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const type = req.body.type;
    if (type === 'login') {
        const tel = req.body.tel;
        const password = req.body.password;
        const userList = await prisma.user.findMany({
            where: {
                tel: tel,
                password: password,
            }
        });
        if (userList == null || userList.length === 0) {
            return res.status(200).json({code: 401, msg: "手机号或密码错误"});
        } else {
            const user = userList[0];
            return res.status(200).json({code: 200, msg: "登录成功", user: user});
        }
    } else if (type === 'register') {
        const tel = req.body.tel;
        const password = req.body.password;
        const validCode = req.body.validCode;
        if (!await new SmsHelper().checkCode(tel, validCode)) {
            return res.status(200).json({code: 401, msg: "验证码错误"});
        } else {
            const user = await prisma.user.findFirst({
                where: {
                    tel: tel,
                }
            });
            if (user) {
                return res.status(200).json({code: 401, msg: "手机号已注册"});
            } else {
                const user = await prisma.user.create({
                    data: {
                        tel: tel,
                        password: password,
                        credits: 3,
                        vipLevel: 0,
                    }
                });

                return res.status(200).json({code: 200, msg: "注册成功", user: user});
            }
        }
        return res.status(200);
    }
    return res.status(200);
}
