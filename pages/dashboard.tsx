import Head from "next/head";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Footer from "../components/Footer";
import prisma from "../lib/prismadb";
import { Room } from "@prisma/client";
import { RoomGeneration } from "../components/RoomGenerator";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import useSWR from "swr";

export default function Dashboard({ rooms }: { rooms: Room[] }) {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: session } = useSession();
  const {data:user} = useSWR("/api/userdetail", fetcher);

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>RoomGPT 仪表板</title>
      </Head>
      <Header
        photo={session?.user?.image || undefined}
        tel={session?.user?.tel || undefined}
        credits={user?.credits || undefined}
      />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mb-0 mb-8">
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-100 sm:text-6xl mb-5">
          查看你的 <span className="text-blue-600">房间</span> 生成
        </h1>
        {rooms.length === 0 ? (
          <p className="text-gray-300">
              你还没有生成过房间{" "}
            <Link
              href="/dream"
              className="text-blue-600 underline underline-offset-2"
            >
                立即生成
            </Link>
          </p>
        ) : (
          <p className="text-gray-300">
              浏览你之前生成的房间，如果有任何问题请联系
                邮件: hassan@roomgpt.io
          </p>
        )}
        {rooms.map((room) => (
          <RoomGeneration
            original={room.inputImage}
            generated={room.outputImage}
          />
        ))}
      </main>
      <Footer />
    </div>
  );
}

export async function getServerSideProps(ctx: any) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session || !session.user) {
    return { props: { rooms: [] } };
  }

  let rooms = await prisma.room.findMany({
    where: {
      user: {
          tel: session.user.tel,
      },
    },
    select: {
      inputImage: true,
      outputImage: true,
    },
  });

  return {
    props: {
      rooms,
    },
  };
}
