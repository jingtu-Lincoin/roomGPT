import http from 'http';
import crypto from 'crypto';
import querystring from 'querystring';
const md5 = crypto.createHash('md5');

export default class SmsbaoSender {
  private _username = 'William2023';
  private _password = 'Williamlin12';
  private _url = 'api.smsbao.com';
  private _content = '【签名】您的验证码是%s。如非本人操作，请忽略本短信';

  public send_sms(phone: string,code: string) {
    const pass = md5.update(this._password).digest('hex');
    const content = this._content.replace('%s',code);
    const data = {
      u: this._username,
      p: pass,
      m: phone,
      c: content,

    };
    const params = querystring.stringify(data);
    const options = {
      hostname: this._url,
      path: '/sms?' + params,
      method: 'GET',
    };

    const req = http.request(options, function (res) {
      res.setEncoding('utf-8');
      res.on('data',  (result: string)=>{
          this.statusStr(result);
      });
      res.on('end',  () =>{
        console.log('over');
      });
    });
    req.on('error',  (err) =>{
      console.error(err);
    });
    req.end();
  }

  private statusStr(result: string) {
    switch (result) {
      case '0':
        console.log('短信发送成功');
        break;
      case '-1':
        console.log('参数不全');
        break;
      case '-2':
        console.log(
          '服务器空间不支持,请确认支持curl或者fsocket，联系您的空间商解决或者更换空间！',
        );
        break;
      case '30':
        console.log('密码错误');
        break;
      case '40':
        console.log('账户不存在');
        break;
      case '41':
        console.log('余额不足');
        break;
      case '42':
        console.log('账户已过期');
        break;
      case '43':
        console.log('IP地址限制');
        break;
      case '50':
        console.log('内容含有敏感字');
        break;
    }
  }
}
