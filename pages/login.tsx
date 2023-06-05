import {GetServerSidePropsContext, NextPage} from "next";
import Head from "next/head";
import React, {useEffect, useState} from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {useSession, signIn, getCsrfToken} from "next-auth/react";
import Link from "next/link";
import {useRouter} from "next/router";
import {Toaster, toast} from "react-hot-toast";
import md5 from "md5";
import SquigglyLines from "../components/SquigglyLines";

const Login: NextPage = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const {data: session, status} = useSession();
    const router = useRouter();
    const [user, setUser] = useState({});

    useEffect(() => {
        if (router.query.error) {
            toast.error("用户名或密码错误，请重试");
        }
    }, [router.query.error]);

    function handleInputChange(event: any) {
        user[event.target.name] = event.target.value;
        setUser(user);
    }


    async function login() {
        console.log("user " + JSON.stringify(user));
        const params = {
            type: "login",
            tel: user.tel,
            password: md5(user.password),
            csrfToken: getCsrfToken()
        };

        const options = {
            redirect: true,
            callbackUrl: "/dashboard",
            ...params
        };

        signIn("credentials", options);

        // const res = await fetch("/api/user", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(params),
        // });
        // const result = await res.json();
        // console.log("result "+JSON.stringify(result));
        // if (result.code === 200) {
        //   toast.success("登录成功");
        //   router.push("/dashboard");
        // }
    }

    return (
        <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
            <Head>
                <title>RoomGPT</title>
            </Head>
            <Header
                photo={session?.user?.image || undefined}
                tel={session?.user?.tel || undefined}
                credits={user?.credits || undefined}
            />
            {session?.user ? (
                <main
                    className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
                    <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-gray-300 sm:text-7xl">
                      <span className="relative whitespace-nowrap text-blue-600">
                        <SquigglyLines/>
                        <span className="relative">使用 AI</span>
                      </span>{" "}
                        为每个人生成梦想的房间 {" "}
                    </h1>
                    <h2 className="mx-auto mt-12 max-w-xl text-lg sm:text-gray-400  text-gray-500 leading-7">
                        拍一张你的房间的照片，看看你的房间在不同的主题下是什么样子。今天重新装修你的房间。
                    </h2>
                    <Link
                        className="bg-blue-600 rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-blue-500 transition"
                        href="/dream"
                    >
                        生成你的梦想房间
                    </Link>
                </main>
            ) : (

                <main
                    className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
                    <div className="flex flex-row-reverse">
                        <div className="">
                            <div className="">
                                <span className="text-2xl font-bold">登录</span>
                            </div>
                            <div className="mt-14">
                                <input className="rounded-full text-black" value={user.tel} onChange={handleInputChange}
                                       name="tel" type="tel" placeholder="请输入登录手机号"></input>
                            </div>
                            <div className="mt-10">
                                <input className="rounded-full text-black" value={user.password}
                                       onChange={handleInputChange} name="password" type="password"
                                       placeholder="请输入登录密码"></input>
                            </div>
                            <div className="mt-10">
                                <button className="rounded-full bg-violet-600 w-32 h-10 inline-block"
                                        onClick={login}>登录
                                </button>
                                <Link href="/signup">
                                    <span className="inline-block text-red-500 ml-5">注册</span>
                                </Link>
                            </div>
                            <div className="mt-10">
                                <Link href="/forget">
                                    <span className="inline-block text-gray-300">忘记密码</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            )}
            <Toaster position="top-center" reverseOrder={false}/>
            <Footer/>
        </div>
    );
};

export default Login;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    }
}
