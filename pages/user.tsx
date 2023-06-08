import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import {toast, Toaster} from "react-hot-toast";
import useSWR from "swr";
import md5 from "md5";
import Util from "../module/core/Util";


const User: NextPage = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: session, status } = useSession();
  const router = useRouter();

  const {data:user} = useSWR("/api/userdetail", fetcher);
  const [showUserInfo, setShowUserInfo] = useState(true);
  const [showPurchase, setShowPurchase] = useState(false);
  const [showModifyPassword, setShowModifyPassword] = useState(false);
  const [userData, setUserData] = useState({
      oldPassword: "",
      password: "",
      confirmPassword: "",
  });
  const {data:purchases} = useSWR("/api/purchases", fetcher);
  const [purchaseTrs, setPurchaseTrs] = useState([]);

    function updatePurchaseTrs() {
        if(purchases === undefined) {
            return;
        }
        if (purchaseTrs.length > 0) {
            return;
        }
        const trs = purchases.map((purchase: any, index: number) => {
            return (
                <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.outTradeNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.creditAmount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.totalAmount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.channel}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.payStatus==="2"?"已支付":"未支付"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Util.formatDateByString(purchase.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.payTime}
                </td>
                </tr>
            )
        });
        setPurchaseTrs(trs);
    }

    function showContext(type: string) {
    return () => {
      if(type === "user") {
        setShowUserInfo(true);
        setShowPurchase(false);
        setShowModifyPassword(false);
      }else if (type === "purchase") {
        setShowUserInfo(false);
        setShowPurchase(true);
        setShowModifyPassword(false);
        updatePurchaseTrs();
      }else if (type === "modifyPassword") {
        setShowUserInfo(false);
        setShowPurchase(false);
        setShowModifyPassword(true);
      }
    }
    return undefined;
  }

  function handleInputChange(event: any) {
    userData[event.target.name] = event.target.value;
    setUserData(userData);
  }

    async function updatePassword() {
      if(userData.oldPassword === undefined || userData.oldPassword === "") {
        toast.error("原密码不能为空");
        return;
      }
        if(userData.password === undefined || userData.password === "") {
          toast.error("新密码不能为空");
          return;
        }
        if(userData.confirmPassword === undefined || userData.confirmPassword === "") {
          toast.error("确认密码不能为空");
          return;
        }
        if(userData.password !== userData.confirmPassword) {
          toast.error("两次密码不一致");
          return;
        }
        const params = {
            oldPassword: md5(userData.oldPassword),
            password: md5(userData.password),
        }
        const res = await fetch("/api/modifyPassword", {});
        const result = await res.json();
        if(result.code === 200) {
            toast.success("修改密码成功");
        }else {
            toast.error(result.msg);
        }
    }


    function loginOut() {
        signIn("auth0", { callbackUrl: "/" });
    }

    return (
      <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
        <Head>
          <title>用户信息</title>
        </Head>
        <Header
            photo={session?.user?.image || undefined}
            tel={session?.user?.tel || undefined}
            credits={user?.credits || undefined}
        />
        <main className="flex flex-1 w-full flex-col  text-center px-4 mt-4 sm:mb-0 mb-8">
            <div className="flex w-full h-10 flex-row text-center leading-10">
                <div className="w-24 h-10 rounded-md bg-violet-600 cursor-pointer " onClick={showContext("user")}>用户信息</div>
                <div className="w-24 h-10 rounded-md bg-violet-600 ml-5 cursor-pointer" onClick={showContext("purchase")}>支付订单</div>
              <div className="w-24 h-10 rounded-md bg-violet-600 ml-5 cursor-pointer" onClick={showContext("modifyPassword")}>修改密码</div>
            </div>
            <div className="flex w-full flex-col mt-14 text-left">
                <div className={showUserInfo?'':'hidden'}>
                    <div className="">手机号：{user?.tel}</div>
                    <div className="mt-5">套餐余量：{user?.credits}</div>
                    <button className="rounded-full bg-violet-600 w-60 h-10 inline-block" onClick={loginOut}>退出登录</button>
                </div>
                <div className={showPurchase?'':'hidden'}>
                    <table className="border-collapse table-auto w-full text-sm">
                        <thead>
                        <tr className="leading-10 h-10">
                            <th className="border-b dark:border-slate-600">单号</th>
                            <th className="border-b dark:border-slate-600">购买点数</th>
                            <th className="border-b dark:border-slate-600">金额</th>
                            <th className="border-b dark:border-slate-600">支付渠道</th>
                            <th className="border-b dark:border-slate-600">支付状态</th>
                            <th className="border-b dark:border-slate-600">创建时间</th>
                            <th className="border-b dark:border-slate-600">支付时间</th>
                        </tr>
                        </thead>
                        <tbody>
                            {purchaseTrs}
                        </tbody>
                    </table>
                </div>
                <div className={showModifyPassword?'':'hidden'}>
                  <div className="mt-10">
                    <input className="rounded-full w-60 text-black" value={userData.oldPassword} name="oldPassword" onChange={handleInputChange} type="password" placeholder="请输入原密码"></input>
                  </div>
                  <div className="mt-10">
                    <input className="rounded-full w-60 text-black" value={userData.password} name="password" onChange={handleInputChange} type="password" placeholder="请输入新密码"></input>
                  </div>
                  <div className="mt-10">
                    <input className="rounded-full w-60 text-black" value={userData.confirmPassword} name="confirmPassword" onChange={handleInputChange} type="password" placeholder="请输入确认密码"></input>
                  </div>
                  <div className="mt-10">
                    <button className="rounded-full bg-violet-600 w-60 h-10 inline-block" onClick={updatePassword}>更新密码</button>
                  </div>
                </div>
            </div>

        </main>
        <Toaster position="top-center" reverseOrder={false} />
        <Footer />
      </div>
  );
};

export default User;
