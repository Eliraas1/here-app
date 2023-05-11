import * as XLSX from "xlsx";
// import * as fs from "fs";
import moment from "moment";
import { Console } from "console";
//TODO: salary grow date 30/06/23
interface Data {
    index: number;
    "שם ": string | undefined;
    "שם משפחה": string | undefined;
    מין: "F" | "M" | undefined;
    "תאריך לידה": string | undefined;
    "תאריך תחילת עבודה ": Date | undefined;
    "שכר ": number;
    "תאריך  קבלת סעיף 14": Date | undefined;
    "אחוז סעיף 14": number | undefined;
    "שווי נכס": number | undefined;
    הפקדות: number | undefined;
    "תאריך עזיבה ": Date | undefined;
    "תשלום מהנכס": number | undefined;
    "השלמה בצ'ק": number | undefined;
    "סיבת עזיבה": "פיטורין" | "התפטרות" | undefined;
    age: number;
    seniority: number;
    W: 67 | 64;
    salaryGrowRate: number;
    totalSalary: number;
}
interface Assuming {
    "עקום  שיעורי היוון": number;
    "הסתברויות עזיבה": string;
    __EMPTY_3: number;
    __EMPTY_4: number;
}
interface LeaveProbability {
    min: number;
    max: number;
    התפטרות: number;
    פיטורין: number;
}
interface Death {
    age: number;
    "L(x)": number;
    "d(x)": number;
    "P(x)": number;
    "q(x)": number;
}
const read = (path: string) =>
    XLSX.readFile(path, {
        cellDates: true,
    });
const data8 = read("./data8.xlsx");
const dateXL = data8.Sheets["data"];
const assumingXL = data8.Sheets["הנחות"];
const deathXL = read("./death.xlsx");
const maleDeathXL = deathXL.Sheets["גברים"];
const femaleDeathXL = deathXL.Sheets["נשים"];
const unFilterData: Data[] = XLSX.utils.sheet_to_json(dateXL, {
    range: 1,
});
const assuming: Assuming[] = XLSX.utils.sheet_to_json(assumingXL);
const maleDeath: Death[] = XLSX.utils.sheet_to_json(maleDeathXL);
const femaleDeath: Death[] = XLSX.utils.sheet_to_json(femaleDeathXL);
const data = unFilterData.filter((item) => !item["תאריך עזיבה "]);
const dateStr = "31/12/2022";
const currentDate = moment(dateStr, "DD/MM/YYYY");
const getAge = (item: Data) => {
    // const currentDate = moment("12-31-22");
    const birthDate = moment(item["תאריך לידה"]);
    const age = currentDate.diff(birthDate, "years"); //x
    return age;
};
const getSeniority = (item: Data) => {
    // const currentDate = moment("12-31-22");
    const startDate = moment(item["תאריך תחילת עבודה "]);
    const seniority = currentDate.diff(startDate, "years"); //x
    return seniority;
};
const getSectionSeniority = (item: Data) => {
    // const currentDate = moment();
    const startDate = moment(item["תאריך  קבלת סעיף 14"]);
    const sectionSeniority = currentDate.diff(startDate, "years"); //x
    return sectionSeniority;
};
data.forEach((item: Data) => {
    //@ts-ignore
    const index = item.__EMPTY;
    item.index = index;
    item["W"] = item.מין === "M" ? 67 : 64;
    item["אחוז סעיף 14"] &&= item["אחוז סעיף 14"] / 100;

    item.age = getAge(item);
    // const date = moment(item["תאריך תחילת עבודה "]);
    item.seniority = getSeniority(item);
    item.salaryGrowRate = index % 2 === 0 ? 0.04 : 0.02;
    // check when did user get section14 and calc
    // const dada = item.seniority - getSectionSeniority(item);
    const dada = item.seniority - getSectionSeniority(item);
    const sal1 = dada * item["שכר "];
    const sal2 = !item["אחוז סעיף 14"]
        ? 0
        : getSectionSeniority(item) * item["שכר "] * (1 - item["אחוז סעיף 14"]);

    item.totalSalary = sal1 + sal2;
    // item.index === 1 &&
    //     console.log(dada, sal1, sal2, getSectionSeniority(item), item);
    // console.log(item["אחוז סעיף 14"]);
});

const leaveProbability: LeaveProbability[] = [];
assuming.slice(1, 6).forEach((item) => {
    const [min, max] = item["הסתברויות עזיבה"].split("-");
    leaveProbability.push({
        min: +min,
        max: +max,
        פיטורין: item.__EMPTY_3,
        התפטרות: item.__EMPTY_4,
    });
});
const getIndexOfProbability = (age: number) => {
    return leaveProbability.findIndex(
        (item) => item.min <= age && item.max >= age
    );
};

delete assuming[0];
const fixedDiscountRate = () => {
    const arr: number[] = [];
    arr.push(0);
    assuming.forEach((item) => {
        arr.push(item["עקום  שיעורי היוון"]);
    });
    return arr;
};

const discountRate = fixedDiscountRate();

const getPX = (t: number, item: Data) => {
    if (t <= 0) return 1;
    const _t = t + item.age;
    return 1 - getQ1(_t) - getQ2(_t) - getQ3(_t, item);
};
const getQ1 = (t: number) => {
    const index = getIndexOfProbability(t);
    const probabilityItem = leaveProbability[index];
    // if (!probabilityItem)
    // console.log("------------------------------", { t, index });
    return probabilityItem.פיטורין;
};
const getQ2 = (t: number) => {
    const index = getIndexOfProbability(t);
    const probabilityItem = leaveProbability[index];
    return probabilityItem.התפטרות;
};
const getQ3 = (t: number, item?: Data) => {
    if (!item) return 0;
    const death = item.מין === "M" ? maleDeath : femaleDeath;
    const Qx = death.find((i) => i.age === t)?.["q(x)"];
    // item.index === 1 && console.log(t, item.age, Qx);
    return Qx || 0;
};

const sigma1 = (item: Data) => {
    const w = item.W;
    const x = item.age;
    let sum = 0;
    for (let t = 0; t <= w - x - 2; t++) {
        const lastSalary = item.totalSalary;
        let growRate = 0;
        if (t > 0 && t % 2 == 0) {
            growRate = item.salaryGrowRate;
        }
        const numer =
            (1 + growRate) ** (t + 0.5) *
            (getPX(t + 1, item) * getQ1(x + t + 1));
        const denom = (1 + discountRate[t]) ** (t + 0.5);
        sum += (lastSalary * numer) / denom;
    }
    return sum;
};
const sigma2 = (item: Data) => {
    const w = item.W;
    const x = item.age;
    let sum = 0;
    for (let t = 0; t <= w - x - 2; t++) {
        const lastSalary = item.totalSalary;
        let growRate = 0;
        if (t > 0 && t % 2 == 0) {
            growRate = item.salaryGrowRate;
        }
        const numer =
            (1 + growRate) ** (t + 0.5) *
            (getPX(t + 1, item) * getQ3(x + t + 1, item));
        const denom = (1 + discountRate[t]) ** (t + 0.5);
        sum += (lastSalary * numer) / denom;
    }
    return sum;
};
const sigma3 = (item: Data) => {
    const w = item.W;
    const x = item.age;
    const assetsValue = item["שווי נכס"] || 0;
    let sum = 0;
    for (let t = 0; t <= w - x - 2; t++) {
        sum += assetsValue * getPX(t + 1, item) * getQ2(x + t + 1);
    }
    return sum;
};

const calcRest = (item: Data) => {
    const firstLine = calcRestFirstLine(item);
    const secondLine = calcRestSecondLine(item);
    const thirdLine = calcRestThirdLine(item);
    return firstLine + secondLine + thirdLine;
};

const calcRestFirstLine = (item: Data) => {
    const numer =
        item.totalSalary *
        (1 + item.salaryGrowRate) ** (item.W - item.age + 0.5) *
        getPX(item.W - item.age - 1, item) *
        getQ1(item.W - 1);
    const denom =
        (1 + discountRate[item.W - item.age]) ** (item.W - item.age + 0.5);
    return numer / denom;
};
const calcRestSecondLine = (item: Data) => {
    const numer =
        item.totalSalary *
        (1 + item.salaryGrowRate) ** (item.W - item.age - 1 + 0.5) *
        getPX(item.W - item.age - 1, item) *
        getQ3(item.W - 1);
    const denom =
        (1 + discountRate[item.W - item.age]) ** (item.W - item.age - 1 + 0.5);
    const assetsCalculation =
        item["שווי נכס"]! *
        getPX(item.W - item.age - 1, item) *
        getQ2(item.W - 1);
    return numer / denom + assetsCalculation;
};
const calcRestThirdLine = (item: Data) => {
    const numer =
        item.totalSalary *
        (1 + item.salaryGrowRate) ** (item.W - item.age) *
        getPX(item.W - item.age - 1, item) *
        (1 - getQ1(item.W - 1) - getQ2(item.W - 1) - getQ3(item.W - 1));
    const denom = (1 + discountRate[item.W - item.age]) ** (item.W - item.age);
    return numer / denom;
};
const calcAll = (item: Data) => {
    let sum = 0;
    if (item.age >= item.W) {
        console.log(item.index);
        sum = item["שכר "] * item.seniority * (1 - (item["אחוז סעיף 14"] || 0));
        return sum;
    }

    sum = sigma1(item) + sigma2(item) + sigma3(item) + calcRest(item);
    return sum;
};

const table: any = [];
data.forEach((item, index) => {
    table.push({
        index: item.index,
        salary: calcAll(item).toLocaleString(),
    });
});
// var filename = "write.xlsx";
// var ws_name = "results";
// var wb = XLSX.utils.book_new();
// var ws = XLSX.utils.json_to_sheet(table);
// XLSX.utils.book_append_sheet(wb, ws, ws_name);
// XLSX.writeFile(wb, filename);
// console.table(table);
console.table(assuming);
console.log(discountRate[discountRate.length - 1]);
