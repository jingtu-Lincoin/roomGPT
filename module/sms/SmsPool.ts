/**
 * 在nodejs里不起作用，后面再研究如何在nodejs里实现单例
 */
export default class SmsPool {
  private static codeMap: Map<string, string> = new Map<string, string>();

  public  addCode(phone: string, code: string) {
    SmsPool.codeMap.set(phone, code);
    console.log("addCode: " + this.getCode(phone));
  }

  public  getCode(phone: string) {
    return SmsPool.codeMap.get(phone);
  }

  public  removeCode(phone: string) {
    SmsPool.codeMap.delete(phone);
  }

  public  checkCode(phone: string, code: string) {
    console.log("checkCode: " + JSON.stringify(SmsPool.codeMap));
    const savedCode = this.getCode(phone);
    console.log("savedCode: " + savedCode + " code: " + code+ " phone: " + phone);
    if (savedCode) {
      return savedCode === code;
    }
    return false;
  }
}
