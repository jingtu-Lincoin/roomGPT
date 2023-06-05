import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prismadb";
import requestIp from "request-ip";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const mealset = await prisma.mealSet.findMany({});
    console.log("mealset: " + JSON.stringify(mealset));
    return res.status(200).json(mealset);
}
