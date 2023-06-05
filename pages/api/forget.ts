import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "../../lib/prismadb";
import SmsHelper from "../../module/sms/SmsHelper";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    console.log("forget")
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
            await prisma.user.update({
                where: {
                    tel: tel,
                },
                data: {
                    password: password,
                }
            });
            return res.status(200).json({code: 200, msg: "修改成功"});
        } else {
            return res.status(200).json({code: 401, msg: "没有找到指定的用户"});
        }
    }
    return res.status(200).json({code: 200, msg: "修改成功"});

}
