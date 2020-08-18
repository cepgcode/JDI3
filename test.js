"use strict";

import {
    type
} from "os";

//接口
/* interface Iperson {
    name: string;
    age?: number;
}

let person: Iperson = { name: "chen", age: 12 };
function test1(person: Iperson): string {
    return person.name + (person.age || '');
}
console.log(test1(person));
 */
// function test(first: string, second?: string, last?: number): string {
//     return first + (second|| '') + (last || '');
// }
// console.log(test("chen","zhan",13));
// 函数...items
// function test(...items: any[]) {
//     let arrs: any[] = [];
//     items.forEach(item => {
//         arrs.push(item);
//     })
//     console.log(arrs);
// }
//重载
// function test(param: number): number;
// function test(param: string): string;
// function test(param: number | string): number | string {
//     if (typeof param === 'number') {
//         return param.toString().split('').reverse().join('');
//     } else if (typeof param === 'string') {
//         return param.split('').reverse().join('');
//     } else
//         return "";
// }
// let result = test(12345);
// console.log(typeof result, result);
//元组
// let eleArr: [string, number] = ["chen",12];
// console.log(eleArr,typeof eleArr);
// eleArr[0] = "zhan";
// eleArr[1] = 23;
// eleArr.push(33);
// eleArr.push("qwe1");
// console.log(eleArr,typeof eleArr);
//枚举
// enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};
// console.log(Days["Sun"] === 0); // true
// console.log(Days["Mon"] === 1); // true
// console.log(Days["Tue"] === 2); // true
// console.log(Days["Sat"] === 6); // true
// console.log(Days[0] === "Sun"); // true
// console.log(Days[1] === "Mon"); // true
// console.log(Days[2] === "Tue"); // true
// console.log(Days[6] === "Sat"); // true
// 类，抽象类abstract，类内：public,private,protected
// 抽象类的继承类必须实现抽象方法
// class Animal {
//     protected name: string;
//     public constructor(name: string) {
//         this.name = name;
//     }
// }
// class Cat extends Animal {
//     constructor(name:string) {
//         super(name);
//         console.log(name);
//     }
// }
// let cat = new Cat("zhang");
// 类和接口，接口可以继承，类可以实现多个接口，接口可以继承类
// interface Alarm {
//     alert(): void;
// }
// interface Light extends Alarm {
//     lightOn(): void;
//     lightOff(): void;
// }
// class Car implements Light {
//     alert() {
//         console.log('Car alert');
//     }
//     lightOn() {
//         console.log('Car light on');
//     }
//     lightOff() {
//         console.log('Car light off');
//     }
// }
// let car = new Car();
// car.alert();
// car.lightOn();
// car.lightOff();
// 泛型
// function createArray<T>(length: number, value: T): Array<T> {
//     let result: T[] = [];
//     for (let i = 0; i < length; i++) {
//         result[i] = value;
//     }
//     return result;
// }
// let defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
// let search = { food: "rich", ...defaults };
// console.log(search);
// search = { ...defaults, food: "rich" };
// console.log(search);
/* function testData() {
    let data: any = {
        "x:0,y:0": {
            "table": "x:0,y:0", "pathText": "手动阀", "imgName": "是否.jpg", "imgSrc": ""
        },
        "x:0,y:1": {
            "table": "x:0,y:1", "pathText": "手动阀", "imgName": "是否.jpg", "imgSrc": ""
        },
        "x:1,y:2": {
            "table": "x:1,y:2", "pathText": "手动阀", "imgName": "是否.jpg", "imgSrc": ""
        }
    };
    let tranObj = {};
    for (let key in data) {
        let keySplits = key.split(",");
        let dataX = parseInt(keySplits[0].split(":")[1]);
        let dataY = keySplits[1].split(":")[1];
        //@ts-ignore
        if (!tranObj.hasOwnProperty(dataY)) {
            //@ts-ignore
            tranObj[dataY] = [];
        }
        //@ts-ignore
        let arrs = tranObj[dataY];
        if (arrs.length > 0) {
            if (arrs.length <= dataX) {
                let oInd = dataX - arrs.length;
                for (let i = 0; i < oInd; i++)
                arrs.push("");
                arrs.push(data[key].table);
            } else {
                arrs.splice(dataX, 1, data[key].table)
            }
        } else {
            for (let i = 0; i < dataX; i++)
                arrs.push("");
            arrs.push(data[key].table);
        }
        //@ts-ignore
        tranObj[dataY] = arrs;
    }
    let keys = Object.keys(tranObj).sort();
    let writeObj = {};
    //@ts-ignore
    keys.map(key => writeObj[key] = tranObj[key]);
    console.log(writeObj);
} */
// testData();
/* let arrs = [1,3,5,7];
for(let i = 0; i < arrs[arrs.length - 1]; i++){
    if(i != arrs[i])
        arrs.splice(i,0,i);
}
console.log(arrs); */
// 查看本机信息
/* let sInfo = require("systeminformation");

sInfo.diskLayout().then((o:any)=>console.log(o)).catch((err:any)=>console.log("err",err)) */
