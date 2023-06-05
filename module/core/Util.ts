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
}
