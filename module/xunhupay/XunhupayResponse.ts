export default class XunhupayResponse {
  private oderid: string;
  /**
   * 二维码，用户扫码支付，pc端可用
   * @private
   */
  private url_qrcode: string;
  /**
   * 移动端跳转url
   * @private
   */
  private url: string;
  private errcode: string;
  private errmsg: string;
  private hash: string;
}
