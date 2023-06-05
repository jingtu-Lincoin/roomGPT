import querystring from 'querystring';
import http from 'http';
import {fetch} from "next/dist/compiled/@edge-runtime/primitives/fetch";
import md5 from "md5";
import Util from "../core/Util";

export default class XunhupayService {
  private _url = 'https://api.dpweixin.com/payment/do.html';
  private _zfbAppId = '20211112835';
  private _zfbAppSecret = 'f25f158a718aed3be319a3aac628de36';
  private _wxAppId = '20211112688';
  private _wxAppSecret = 'f119b3338d3de6b92a96cafa680cf6a8';
  private _notifyUrl = 'http://serverdev.jingtu.info/api/xunhupayCallback';
  private _returnUrl = 'http://serverdev.jingtu.info/dashboard';

  public async pay(params:any): Promise<any> {
    const requestParams = this._createRequestParams(params);
    console.log("发起支付参数 requestParams",JSON.stringify(requestParams));
    const response = await fetch(this._url, {
      method: 'POST',
      body: JSON.stringify(requestParams),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    console.log("发起支付结果 response",response);
    const result = await response.json();
    console.log("发起支付结果 result",JSON.stringify(result));
    return result;
  }

  private _createRequestParams(params:any) {
    const appid = params.channel=="alipay"?this._zfbAppId:this._wxAppId;
    const requestParams = {
      appid: appid,
      version: '1.1',
      trade_order_id: params.outTradeNo,
      total_fee: params.money/100+"",
      title: '购买套餐',
      return_url: this._returnUrl,
      notify_url: this._notifyUrl,
      time: new Date().getTime(),
      nonce_str: Util.randomNumbers(10)
    };
    const hash = this._sign(requestParams,params.channel);
    requestParams['hash'] = hash;
    return requestParams;
  }

  private _sign(requestParams: {
    nonce_str: string;
    appid: string;
    total_fee: number;
    trade_order_id: any;
    return_url: string;
    time: number;
    title: string;
    notify_url: string;
    version: string
  },channel:string) {
    let signStr = '';
    signStr += 'appid=' + requestParams.appid;
    signStr += '&nonce_str=' + requestParams.nonce_str;
    signStr += '&notify_url=' + requestParams.notify_url;
    signStr += '&return_url=' + requestParams.return_url;
    signStr += '&time=' + requestParams.time;
    signStr += '&title=' + requestParams.title;
    signStr += '&total_fee=' + requestParams.total_fee;
    signStr += '&trade_order_id=' + requestParams.trade_order_id;
    signStr += '&version=' + requestParams.version;
    signStr += channel=="alipay"?this._zfbAppSecret:this._wxAppSecret;
    return md5(signStr);
  }
}
