import {useSession} from "next-auth/react";
import Script from "next/script";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Head from "next/head";
import useSWR from "swr";
import React, {useState} from "react";
import {toast, Toaster} from "react-hot-toast";

export default function BuyVip() {
    const {data: session} = useSession();

    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const {data} = useSWR("/api/mealset", fetcher);
    const {data:user} = useSWR("/api/userdetail", fetcher);
    let [alipayChecked,setAlipayChecked] = useState();
    let [weixinChecked,setWeixinChecked] = useState();
    let [mealsetId,setMealsetId] = useState();
    let [curIndex,setCurIndex] = useState();
    const divClassName ="flex flex-col p-10 ";
    const [qrcode,setQrcode] = useState();
    const showQrcode = qrcode ? true : false;

    console.log("data",JSON.stringify(data));
    let mealsetDiv = [];

    if(data){
        mealsetDiv = data.map((mealset: any) => {
            let index = mealset.id;
            return <div
                key={mealset.id}
                onClick={()=>{setMealsetId(mealset.id);setCurIndex(index)}}
                className={curIndex===index?divClassName+"bg-violet-700":divClassName}>
                <p className="text-3xl">{mealset.name}</p>
                <p className="text-gray-300 mt-5">
                    仅售 <span className="text-red-500">¥{mealset.price / 100}</span> 元
                </p>
                <p className="text-gray-300 mt-5">
                    {mealset.description}
                </p>
            </div>
        });
    }


    async function purchase() {
        if(!mealsetId){
            toast.error("请选择套餐");
            return;
        }
        if(!alipayChecked && !weixinChecked){
            toast.error("请选择支付方式");
            return;
        }
        const params = {
            mealsetId: mealsetId,
            channel: alipayChecked ? "alipay" : "wx",
        }
        console.log("params",JSON.stringify(params));
        const res = await fetch("/api/xunhupay", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });
        const result = await  res.json();
        console.log("result "+JSON.stringify(result));
        if (result.code === 200) {
            //支付二维码
            setQrcode(result.data.url_qrcode);
        }else {
            toast.error("支付失败");
        }
    }

    function queryPurchaseStatus() {
        setQrcode(undefined);
    }

    return (
        <div className="flex mx-auto max-w-7xl overflow-visible flex-col items-center justify-center py-2 min-h-screen">
            <Head>
                <title>购买套餐</title>
            </Head>
            <Header
                photo={session?.user?.image || undefined}
                tel={session?.user?.tel || undefined}
                credits={user?.credits || undefined}
            />
            <main
                className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mb-0 mb-8">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            购买套餐
                        </p>
                    </div>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-500 mb-10">
                    你可以购买套餐来解锁更多功能
                </p>
            </main>
            <div className="mt-10 text-center mb-20">
                <div className="flex flex-row">
                    {mealsetDiv}
                </div>
            </div>
            <div className="mt-10 text-center mb-20">
                <div className="flex flex-row">
                    <div
                        onClick={() => {setAlipayChecked(true);setWeixinChecked(false)}}
                        className="flex  flex-col justify-center items-center text-center ">
                        <img src="/alipay.webp" className="w-32 h-32"></img>
                        <input className="mt-5" type="radio" checked={alipayChecked}/>
                    </div>
                    <div
                        onClick={() => {setAlipayChecked(false);setWeixinChecked(true)}}
                        className="flex flex-col justify-center items-center text-center  ml-20">
                        <img src="/weixinpay.jpeg" className="w-32 h-32"></img>
                        <input className="mt-5" type="radio" checked={weixinChecked}/>
                    </div>
                </div>
            </div>
            <div className="flex flex-row mt-5 justify-center">
                <button className="rounded-full bg-violet-600 w-32 h-10" onClick={purchase}>立即购买</button>
            </div>

            <div className={showQrcode?'w-80 h-80 bg-gray-200  fixed z-10 ':'w-80 h-80 bg-gray-200  fixed z-10 hidden'}>
                <div className="flex flex-col items-center align-middle">
                    <img src={qrcode} className="w-40 h-40 mt-10"/>
                    <button className="rounded bg-violet-600 w-16 h-10 mt-10" onClick={queryPurchaseStatus}>已支付</button>
                </div>
            </div>
            <Toaster position="top-center" reverseOrder={false} />
            <Footer/>
        </div>
    );
}
