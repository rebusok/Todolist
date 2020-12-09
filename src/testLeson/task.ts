export const getTriangleType =  (a:number, b:number, c:number): string => {
    let result:string

    if(a+b>c && a+c>b && c+b>a) {
        if(a === b &&  b=== c){
            result = '10'
        } else if (a === b || b === c || c === a){
            result = '01'
        } else {
            result = '11'
        }
    }else {
        result = '00'
    }

    return result
}


export const isSquareGreater = (areaCr:number, areaK:number):boolean => {
    const diametr:number = 2 * Math.sqrt(areaCr/Math.PI),
         sideSq:number = Math.sqrt(areaK);
    const result:boolean = sideSq >= diametr
   return result
}
const addd = [1, 4, 6, 9];

const isEvenSumGreater = (array:Array<number>) => {


    const sumEven = array.filter(b => b % 2 === 0).reduce((ac,cur) => ac + cur)

    const sumOdd = array.filter(b => b % 2 !== 0).reduce((ac, cur) => ac + cur)
    return sumEven > sumOdd
}

isEvenSumGreater(addd);


export const getSum = (num:number) => num.toString(10)
    .split('').reduce((ac, cur) => ac + Number(cur),0)


// Функция-банкомат принимает параметром целое натуральное число (сумму).
// Возвращает массив с наименьшим количеством купюр, которыми можно выдать эту
// сумму. Доступны банкноты следующих номиналов:
// const banknotes = [1000, 500, 100, 50, 20, 10, 5, 2, 1]


export const getBanknotesList = (num:number) => {
    const result = [];
    const banknotes = [1000, 500, 100, 50, 20, 10, 5, 2, 1];
    while (num){
        let minBankt = banknotes.find(c => c <= num)
        result.push(minBankt)
        if (minBankt){
            num -= minBankt
        }
    }
    return result

}