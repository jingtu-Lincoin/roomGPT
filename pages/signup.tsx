import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import {toast, Toaster} from "react-hot-toast";
import VerifyCode  from "../components/VerifyCode";
import md5 from "md5";


const Signup: NextPage = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: session, status } = useSession();
  const router = useRouter();

  const [user, setUser] = useState({
  });
  function handleInputChange(event: any) {
    user[event.target.name] = event.target.value;
    setUser(user);
  }

  async function sendSms() {
    console.log("enter sendSms ");

    if (user.tel === undefined || user.tel === "") {
      toast.error("手机号不能为空");
      return;
    }

    const params = {
      tel: user.tel,
    }

    const res = await fetch("/api/sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    const result = await  res.json();
    console.log("result "+JSON.stringify(result));
    if (result.code === 200) {
        toast.success("验证码已发送");
    }else {
        toast.error(result.msg);
    }

  }

  async function register() {
    console.log("user "+JSON.stringify(user));
    if(user.tel === undefined || user.tel === "") {
        toast.error("手机号不能为空");
        return;
    }
    if(user.password === undefined || user.password === "") {
        toast.error("密码不能为空");
        return;
    }
    if(user.validCode === undefined || user.validCode === "") {
        toast.error("验证码不能为空");
        return;
    }
    if(user.password !== user.confirmPassword) {
        toast.error("两次密码输入不一致");
        return;
    }
    const params = {
      type: "register",
      tel: user.tel,
      password: md5(user.password),
      validCode: user.validCode,
    };
    const res = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    console.log("result "+JSON.stringify(result));
    if (result.code === 200) {
      toast.success("注册成功");
      router.push("/login");
    }else {
      toast.error(result.msg);
    }
  }




  return (
      <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
        <Head>
          <title>RoomGPT</title>
        </Head>
        <Header
            photo={session?.user?.image || undefined}
            tel={session?.user?.tel || undefined}
        />
        <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
          <div className="flex flex-row-reverse">
            <div className="">
              <div className="">
                <span className="text-2xl font-bold">登录</span>
              </div>
              <div className="mt-14">
                <input className="rounded-full w-60 text-black" value={user.tel} name="tel" type="tel" onChange={handleInputChange} placeholder="请输入登录手机号"></input>
              </div>
              <div className="mt-10">
                <input className="rounded-full w-28 text-black" value={user.validCode} name="validCode" onChange={handleInputChange} type="text" placeholder="验证码" ></input>
                <VerifyCode onClick={sendSms} seconds={60} />
              </div>
              <div className="mt-10">
                <input className="rounded-full w-60 text-black" value={user.password} name="password" onChange={handleInputChange} type="password" placeholder="请输入登录密码"></input>
              </div>
              <div className="mt-10">
                <input className="rounded-full w-60 text-black" value={user.confirmPassword} name="confirmPassword" onChange={handleInputChange} type="password" placeholder="请输入确认密码"></input>
              </div>
              <div className="mt-10">
                <button className="rounded-full bg-violet-600 w-60 h-10 inline-block" onClick={register}>注册</button>
              </div>
            </div>
          </div>
          <Toaster position="top-center" reverseOrder={false} />
        </main>
        <Footer />
      </div>
  );
};

export default Signup;
