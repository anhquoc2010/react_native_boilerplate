import _ from 'lodash';

class CHelper {
  private static _instance: CHelper;

  private constructor() {
    // ...
  }

  public static get Instance(): CHelper {
    /* istanbul ignore else */
    if (!this._instance) {
      this._instance = new this();
    }
    return CHelper._instance;
  }

  // enum PostStatus {  ACTIVE = 'ACTIVE', DRAFT = 'DRAFT' } => ['ACTIVE', 'DRAFT']
  getKeys(enumme: any) {
    return Object.keys(enumme).map((key: string) => key);
  }

  // { premiumOption1: 'premium1M', premiumOption2: 'premium1Y' } => ['premium1M', 'premium1Y']
  getValues(data: any) {
    const result = [];
    for (const [, value] of Object.entries(data)) {
      result.push(value);
    }
    return result;
  }

  getSubvalues(theObject: any, field: string, arrayResult: any = []): any {
    let result = null;
    if (theObject instanceof Array) {
      for (let i = 0; i < theObject.length; i++) {
        result = this.getSubvalues(theObject[i], field, arrayResult);
        if (result) {
          break;
        }
      }
    } else {
      for (const prop in theObject) {
        if (prop === field) {
          arrayResult.push(theObject[prop]);
        }
        if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
          result = this.getSubvalues(theObject[prop], field, arrayResult);
          if (result) {
            break;
          }
        }
      }
    }
    return result;
  }

  // collections = [{ a: 1, b: 10 }, { a: { a: 2 }, b: 11 }, { a: { b: 20 }, b: 12 }]
  // fields="a" => [1, { a: 2 }, { b: 20 }]
  // fields=["a"] => [{"a": 1}, {"a": {"a": 2}}, {"a": {"b": 20}}]
  selectFields(collections: Array<any>, fields: Array<string> | string): Array<any> {
    if (typeof fields === 'string') {
      const result: any = [];
      collections.forEach((e: any) => {
        result.push(e[fields]);
      });
      return result;
    }
    return _.map(collections, _.partialRight(_.pick, fields));
  }

  // collections = [{ a: 1 }, { b: { a: 2 } }, { c: { a: 3 } }]
  // field="a" => [1, 2, 3]
  selectDeepField(collections: any, field: string): Array<any> {
    const result: any = [];
    this.getSubvalues(collections, field, result);
    return result;
  }

  // objectSample = { a: { b: 1 } }
  // field = "a.b" => 1
  selectObjectField(theObject: any, field: string): any {
    field = field.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    field = field.replace(/^\./, ''); // strip a leading dot
    var a = field.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in theObject) {
        theObject = theObject[k];
      } else {
        return;
      }
    }
    return theObject;
  }

  // collections = [{ a: { b: 1 } }, { a: { b: 2 } }, { a: { b: 3 } }]
  // field = "a.b" => [1, 2, 3]
  selectCollectionField(collections: any, field: string): Array<any> {
    const result: any = [];
    collections.forEach((e: any) => {
      result.push(this.selectObjectField(e, field));
    });
    return result;
  }

  // objectSample = [{ a: { b: 1 } }, { a: { b: 2, c: 10 } }, { a: { b: 3 } }]
  // field = 'b'
  // value = 2
  // => { b: 2, c: 10 }
  findItemFromDeepField(theObject: any, field: string, value: any): any {
    let result = null;
    if (theObject instanceof Array) {
      for (let i = 0; i < theObject.length; i++) {
        result = this.findItemFromDeepField(theObject[i], field, value);
        if (result) {
          break;
        }
      }
    } else {
      for (const prop in theObject) {
        if (prop === field) {
          if (theObject[prop] === value) {
            return theObject;
          }
        }
        if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
          result = this.findItemFromDeepField(theObject[prop], field, value);
          if (result) {
            break;
          }
        }
      }
    }
    return result;
  }

  // objectSample = [1,2,3]
  // assignedKey = 'value'
  // => [{ value: 1 }, { value: 2 }, { value: 3 }]
  assignKeyToPlainArray(array: Array<string | number>, assignedKey: string) {
    return array.map(e => ({ [assignedKey]: e }));
  }

  // => '#FFFFFF' = rgb(255,255,255)
  convertToRgb(hex: any) {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      // eslint-disable-next-line no-bitwise
      return 'rgb(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ')';
    }
    return hex;
  }

  // => 'rgb(255,255,255)' = [255, 255, 255]
  getRgbArray(rgb: any) {
    let rgbArray: string[] = [];
    const rgbValueArray: number[] = [];
    const rgbValue = rgb.replace('rgb(', '').replace(')', '');
    rgbArray = _.split(rgbValue, ',');
    rgbArray.forEach((e, index) => {
      rgbValueArray[index] = parseInt(e, 10);
    });
    return rgbValueArray;
  }

  sleep(ms: number) {
    return new Promise((resolve: any) => setTimeout(resolve, ms));
  }

  round = (value: number, decimals: number = 2) =>
    Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);

  removeUselessCharacters = function (txt: string, uselessWordsArray: string[]) {
    const expStr = uselessWordsArray.join('|');
    return txt.replace(new RegExp(expStr, 'gi'), '');
  };

  currencyFormat = (value: number) => {
    let result = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',

      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    }).format(value);
    if (!result.includes('$')) {
      result = `$${result}`;
    }
    if (!result.includes('$-')) {
      result = result.replace('$-', '-$');
    }
    return result;
  };

  numberWithCommas = (x: number) => {
    var parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  // Ex: currencyString = $12.34
  inputCurrencyFormat = (currencyString: string) => {
    const numberText = Helper.removeUselessCharacters(currencyString, ['-', ',', '\\$']);
    if (!numberText) return '$';

    let parts = numberText.split('.');

    if (!parts[0] || parts[0].length === 0) {
      parts[0] = '0';
    }
    parts[0] = Number.parseInt(parts[0], 10).toString();

    if (parts[1] && parts[1].length > 2) {
      const newCurrency = this.round(Number.parseFloat(numberText)).toFixed(2);
      parts[0] = newCurrency.split('.')[0] || '0';
      // eslint-disable-next-line prefer-destructuring
      parts[1] = newCurrency.split('.')[1];
    }

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    parts = parts.slice(0, 2);
    return '$' + parts.join('.');
  };

  inputNumberFormat = (numberString: string, decimals: number = 2) => {
    if (!numberString) {
      return numberString;
    }

    const numberText = this.removeUselessCharacters(numberString, ['-', ',', '\\$']);

    let parts = numberText.split('.');

    if (!parts[0] || parts[0].length === 0) {
      parts[0] = '0';
    }
    parts[0] = Number.parseInt(parts[0], 10).toString();

    if (parts[1] && parts[1].length > 2) {
      const newNumber = this.round(Number.parseFloat(numberText), decimals).toFixed(decimals);
      parts[0] = newNumber.split('.')[0] || '0';
      // eslint-disable-next-line prefer-destructuring
      parts[1] = newNumber.split('.')[1];
    }

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    parts = parts.slice(0, 2);
    return parts.join('.');
  };

  shallowEqual(object1: any, object2: any) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }

  changeObjectKey = (obj: any, oldKey: string, newKey: string) => {
    if (oldKey !== newKey) {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    }
    return obj;
  };
}

const Helper = CHelper.Instance;
export default Helper;
