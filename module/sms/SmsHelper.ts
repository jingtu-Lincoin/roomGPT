import prisma from "../../lib/prismadb";
import Util from "../core/Util";
import {processEnv} from "@next/env";
export default class SmsHelper {
    private smsLimit = process.env.sms_limit;

  public async checkCode(phone: string, code: string) {
    const sms = await prisma.smsCode.findFirst({
        where: {
          tel: phone,
        }
    });
    if (sms) {
      return sms.code === code;
    }
    return false;
  }

    public async addCode(phone: string, code: string) {
        const sms = await prisma.smsCode.findFirst({
            where: {
                tel: phone,
            }
        });
        if (sms) {
            await prisma.smsCode.update({
            where: {
                tel: phone,
            },
            data: {
                code: code,
            }
            });
        }else{
            await prisma.smsCode.create({
            data: {
                tel: phone,
                code: code,
            }
            });
        }
    }

    public async checkStat(phone: string) {
      console.log("smsLimit", this.smsLimit);
      const smsStat = await prisma.smsStat.findFirst({
          where: {
                tel: phone,
          }
      });
        if (smsStat) {
            const day =Util.getCurrentDate();
            if (smsStat.day === day) {
                if(smsStat.count >= this.smsLimit){
                    return false;
                }else {
                    await prisma.smsStat.update({
                        where: {
                            tel: phone,
                        },
                        data: {
                            count: smsStat.count + 1,
                        }
                    });
                    return true;
                }
            }else {
                await prisma.smsStat.update({
                    where: {
                        tel: phone,
                    },
                    data: {
                        day: day,
                        count: 1,
                    }
                });
                return true;
            }
        }else {
            await prisma.smsStat.create({
                data: {
                    tel: phone,
                    sense: 1,
                    day: Util.getCurrentDate(),
                    count: 1,
                }
            });
            return true;
        }
    }
}
