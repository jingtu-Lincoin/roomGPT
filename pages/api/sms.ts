import type { NextApiRequest, NextApiResponse } from "next";
import SmsbaoSender from '../../module/sms/SmsbaoSender';
import Util from '../../module/core/Util';
import SmsHelper from "../../module/sms/SmsHelper";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const  tel = req.body.tel;
    if (!tel) {
        return res.status(200).json({code: 401, msg: "手机号不能为空"});
    }
    const checkStat = await new SmsHelper().checkStat(tel);
    if (!checkStat) {
        return res.status(200).json({code: 401, msg: "今日短信发送次数已达上限"});
    }
    const code = Util.randomNumbers(4);
    console.log("sms code: " + code+ " tel: " + tel);
    new SmsbaoSender().send_sms(tel,code);
    new SmsHelper().addCode(tel,code);
    return res.status(200).json({code: 200, msg: "验证码已发送"});
}
