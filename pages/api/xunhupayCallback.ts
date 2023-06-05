import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prismadb";
import requestIp from "request-ip";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const payResult = req.body;
    console.log("payResult: " + JSON.stringify(payResult));
    if(payResult.status == 'OD'){
        const purchase = await prisma.purchase.findFirst({
            where: {
                outTradeNo: payResult.trade_order_id,
            }
        });
        console.log("purchase: " + JSON.stringify(purchase));
        if(purchase && purchase.payStatus == '1'){
            const user = await prisma.user.findUnique({
                where: {
                    id: purchase.userId,
                },
                select: {
                    credits: true,
                    location: true,
                },
            });
            console.log("user: " + JSON.stringify(user));
            const meetset = await prisma.mealSet.findUnique({
                where: {
                    id: purchase.bid,
                }
            });
            if(user && meetset){
                await prisma.user.update({
                    where: {
                        id: purchase.userId,
                    },
                    data: {
                        credits: user.credits + purchase.creditAmount,
                        vipLevel: meetset.level,
                    },
                });
            }
            await prisma.purchase.update({
                where: {
                    outTradeNo: payResult.trade_order_id,
                },
                data: {
                    payStatus: '2'
                }
            });
            return res.status(200).write("success");
        }
    }

    return res.status(200).write("success");
}
