import Image from "next/image";
import Link from "next/link";

export default function Header({
  photo,
  tel,
  credits,
}: {
  photo?: string;
  tel?: string;
  credits?: number;
}) {
  return (
    <header className="flex flex-col xs:flex-row justify-between items-center w-full mt-3 border-b pb-7 sm:px-4 px-2 border-gray-500 gap-2">
      <Link href="/" className="flex space-x-2">
        <Image
          alt="header text"
          src="/bed.svg"
          className="sm:w-10 sm:h-10 w-9 h-9"
          width={24}
          height={24}
        />
        <h1 className="sm:text-3xl text-xl font-bold ml-2 tracking-tight">
          roomGPT.io
        </h1>
      </Link>
      {tel ? (
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="border-r border-gray-300 pr-4 flex space-x-2 hover:text-blue-400 transition"
          >
            <div>仪表盘</div>
          </Link>
          <Link
            href="/buy-vip"
            className="border-r border-gray-300 pr-4 flex space-x-2 hover:text-blue-400 transition"
          >
            <div>购买套餐</div>
            <div className="text-blue-500 bg-blue-200 rounded-full px-2 text-xs flex justify-center items-center font-bold">
              套餐余量: {credits?credits:0}
            </div>
          </Link>
          {photo ? (
            <Image
              alt="Profile picture"
              src={photo}
              className="w-10 rounded-full"
              width={32}
              height={28}
            />
          ) : (
              <Link href="/user" >
                <div>{tel}</div>
              </Link>
          )
          }
        </div>
      ) : (
        <Link
          className="flex max-w-fit items-center justify-center space-x-2 rounded-lg border border-blue-600 text-white px-5 py-2 text-sm shadow-md hover:bg-blue-400 bg-blue-600 font-medium transition"
          href="/login"
        >
          <p>登录 </p>
        </Link>
      )}
    </header>
  );
}
