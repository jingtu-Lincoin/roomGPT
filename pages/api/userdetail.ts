import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "../../lib/prismadb";
import {getServerSession} from "next-auth/next";
import {authOptions} from "./auth/[...nextauth]";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    console.log("detail")
    const session = await getServerSession(req, res, authOptions);
    if(session){
        const userId = session.user.id;
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        });
        return res.status(200).json(user);
    }
    return res.status(200).json({code: 401, msg: "没有登录"});

}
