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
const getAge = (item: Data) => {
    const currentDate = moment();
    const birthDate = moment(item["תאריך לידה"]);
    const age = currentDate.diff(birthDate, "years"); //x
    return age;
};
const getSeniority = (item: Data) => {
    const currentDate = moment();
    const startDate = moment(item["תאריך תחילת עבודה "]);
    const seniority = currentDate.diff(startDate, "years"); //x
    return seniority;
};
data.forEach((item: Data) => {
    //@ts-ignore
    const index = item.__EMPTY;
    item.index = index;
    item["W"] = item.מין === "M" ? 67 : 64;
    item["אחוז סעיף 14"] &&= item["אחוז סעיף 14"] / 100;
    item.age = getAge(item);
    const date = moment(item["תאריך תחילת עבודה "]);
    item.seniority = getSeniority(item);
    item.salaryGrowRate = index % 2 === 0 ? 0.04 : 0.02;
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

// const getPX = (t: number, item: Data) => {
//     if (t <= 0) return 1;

//     return 1 - getQ1(t, item) - getQ2(t, item) - getQ3(t, item);
// };
const getPX = (t: number, item: Data) => {
    if (t <= 0) return 1;

    const _t = t + item.age;
    return 1 - getQ1(_t, item) - getQ2(_t, item) - getQ3(_t, item);
};
const getQ1 = (t: number, item?: Data) => {
    const index = getIndexOfProbability(t);
    const probabilityItem = leaveProbability[index];
    if (!probabilityItem)
        console.log("------------------------------", { t, index });
    return probabilityItem.פיטורין;
};
const getQ2 = (t: number, item?: Data) => {
    const index = getIndexOfProbability(t);
    const probabilityItem = leaveProbability[index];
    return probabilityItem.התפטרות;
};
const getQ3 = (t: number, item?: Data) => {
    if (!item) return 0;
    const x = item.age;
    const death = item.מין === "M" ? maleDeath : femaleDeath;
    const Lx = death.find((i) => i.age === x)?.["L(x)"];
    const Ly = death.find((i) => i.age === t)?.["L(x)"];
    if (!Lx || !Ly) return 0;
    return (Lx - Ly) / Lx;
};

const calc1 = (item: Data) => {
    const w = item.W;
    const x = item.age;
    const lastSalary = item["שכר "];
    const seniority = item.seniority;
    const section14Rate = item["אחוז סעיף 14"] || 0;
    const salaryGrowRate = item.salaryGrowRate;
    let sum = 0;
    for (let t = 0; t < w - x - 2; t++) {
        const _discountRate = discountRate[t];
        const power = t + 0.5;
        const part1 = lastSalary * seniority * (1 - section14Rate);
        const part2 =
            ((1 + salaryGrowRate) ** power *
                getPX(t + 1, item) *
                getQ1(t + 1 + x, item)) /
            (1 + _discountRate) ** power;
        sum += part1 * part2;
    }
    return sum;
};
const calc2 = (item: Data) => {
    const w = item.W;
    const x = item.age;
    const lastSalary = item["שכר "];
    const seniority = item.seniority;
    const section14Rate = item["אחוז סעיף 14"] || 0;
    const salaryGrowRate = item.salaryGrowRate;
    let sum = 0;
    for (let t = 0; t < w - x - 2; t++) {
        const power = t + 0.5;
        const _t = t + 1 + x;
        const part1 = lastSalary * seniority * (1 - section14Rate);
        const part2 =
            ((1 + salaryGrowRate) ** power *
                getPX(_t - x, item) *
                getQ3(_t, item)) /
            (1 + discountRate[t]) ** power;
        sum += part1 * part2;
    }
    return sum;
};
const calc3 = (item: Data) => {
    const w = item.W;
    const x = item.age;

    const assetsValue = item["שווי נכס"] || 0;
    let sum = 0;
    for (let t = 0; t < w - x - 2; t++) {
        const _t = t + 1 + x;
        sum += assetsValue * getPX(_t - x, item) * getQ2(_t, item);
    }
    return sum;
};

const calcRest = (item: Data) => {
    const w = item.W;
    const x = item.age;
    const power = w - x + 0.5;
    const power2 = power - 1;
    const lastSalary = item["שכר "];
    const t = w - x - 1;
    const seniority = item.seniority;
    const section14Rate = item["אחוז סעיף 14"] || 0;
    const salaryGrowRate = item.salaryGrowRate;
    const assetsValue = item["שווי נכס"] || 0;
    const commonPart = lastSalary * seniority * (1 - section14Rate) * 3;
    const discountRate1 = discountRate[w - x];
    const discountRate2 = discountRate[w - x - 1];
    const part1 =
        ((1 + salaryGrowRate) ** power * getPX(t, item) * getQ1(w - 1, item)) /
        (1 + discountRate1) ** power;
    // if (isNaN(part1)) console.log("---- part1 ---");
    const part2 =
        ((1 + salaryGrowRate) ** power2 *
            getPX(w - x - 1, item) *
            getQ3(w - 1, item)) /
        (1 + discountRate[w - x - 1]);
    // if (isNaN(part2)) console.log("---- part2 ---");
    const separatedPart = assetsValue * getPX(t, item) * getQ2(w - 1, item);
    const part3 =
        ((1 + salaryGrowRate) ** (w - x) *
            getPX(t, item) *
            (1 - getPX(w - 1 - x, item))) /
        (1 + discountRate1) ** (w - x);

    // if (isNaN(part3)) console.log("---- part3 ---", salaryGrowRate, power);
    const a = (1 + discountRate[w - x]) ** 1;
    const b = (1 + discountRate[w - x - 1]) ** 1;
    if (isNaN(a)) console.log("---- a ---", discountRate[w - x], w - x, x);
    if (isNaN(b)) console.log("---- b ---", b);

    const sum = commonPart * (part1 + part2 + part3) + separatedPart;
    // const sum = commonPart * (part1 + part2 + part3) + separatedPart;
    return sum;
};

const calcAll = (item: Data) => {
    // return calc1(item) + calc2(item) + calc3(item);
    const gaga = calc1(item) + calc2(item) + calc3(item) + calcRest(item);
    // const gaga = calc1(item) + calc2(item) + calc3(item) + calcRest(item);
    // if (Number.isNaN(gaga))
    //     console.log("-----------------------------", item, gaga);
    return gaga;
    // return calcRest(item);
};

data.forEach((item, index) =>
    // console.log(calcAll(item), { index: item.index, gaga: item["שווי נכס"] })
    calcAll(item)
);
