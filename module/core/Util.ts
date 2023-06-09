export default class Util {
  /**
   * Remove an item from an array
   * @param arr the array
   * @param item  the item to be removed
   * @param field   the field of the item to be compared
   */
  static arrRemove(arr: any[], item: any, field: string) {
    arr.map((i: any) => {
      if (i[field] === item[field]) {
        arr.splice(arr.indexOf(i), 1);
      }
    });
  }

  static randomNumbers(len: number) {
    let numbers = '';
    for (let i = 0; i < len; i++) {
      numbers += Math.floor(Math.random() * 10);
    }
    return numbers;
  }

  static getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day  = date.getDate();
    return `${year}-${month}-${day}`;
  }

  static formatDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day  = date.getDate();
    return `${year}-${month}-${day}`;
  }

  /**
   * 对时间进行格式化
   * @param date 时间字符串 2023-06-05T07:37:41.446Z
   */
  static formatDateByString(date: string) {
    if(!date) return '';
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day  = dateObj.getDate();
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    const second = dateObj.getSeconds();
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
}
