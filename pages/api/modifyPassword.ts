import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "../../lib/prismadb";
import SmsHelper from "../../module/sms/SmsHelper";
import {getServerSession} from "next-auth/next";
import {authOptions} from "./auth/[...nextauth]";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    console.log("modifyPasword")
    const oldPassword = req.body.oldPassword;
    const password = req.body.password;

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
        console.log("User not logged in");
        return res.status(401).json("Login to upload.");
    }

    const user = await prisma.user.findFirst({
        where: {
            tel: session.user.tel,
        }
    });
    if (user) {
        console.log(" user.passwrod" + user.password + " oldPassword" + oldPassword);
        if (user.password != oldPassword) {
            return res.status(200).json({code: 401, msg: "原密码错误"});
        }
        await prisma.user.update({
            where: {
                tel: session.user.tel,
            },
            data: {
                password: password,
            }
        });
        return res.status(200).json({code: 200, msg: "修改成功"});
    } else {
        return res.status(200).json({code: 401, msg: "没有找到指定的用户"});
    }
    return res.status(200).json({code: 0});

}
