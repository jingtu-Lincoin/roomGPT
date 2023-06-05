import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prismadb";
import {randomBytes} from "crypto";
import XunhupayService from "../../module/xunhupay/XunhupayService";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Check if user is logged in
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
        console.log("User not logged in");
        return res.status(401).json("Login to upload.");
    }
    console.log("session",JSON.stringify(session));

    const meetsetId = req.body.mealsetId;
    const channel = req.body.channel;
    const outTradeNo = randomBytes(16).toString('hex');

    const mealset = await prisma.mealSet.findUnique({
        where: {
            id: meetsetId+"",
        }
    });
    if(mealset){
        const purchase = await prisma.purchase.create({
            data: {
                userId: session.user.id,
                creditAmount: mealset?.amount,
                payStatus: '1',
                channel: channel,
                outTradeNo: outTradeNo,
                bid: meetsetId,
            }
        });
        const params ={
            money: mealset?.price,
            outTradeNo: outTradeNo,
            channel: channel,
        }
        const result = await new XunhupayService().pay(params);
        return res.status(200).json({code: 200,data: result});
    }

    return res.status(200).json({ code: 200 });
}
