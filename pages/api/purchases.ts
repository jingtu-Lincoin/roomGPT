import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prismadb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const purchases = await prisma.purchase.findMany({});
    console.log("purchases: " + JSON.stringify(purchases));
    return res.status(200).json(purchases);
}
