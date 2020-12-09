import {getBanknotesList, getSum, getTriangleType, isSquareGreater} from "./task";


test("getTriangleType", () => {
    expect(getTriangleType(3,3,3)).toBe("10")
    expect(getTriangleType(1,3,3)).toBe("01")
    expect(getTriangleType(5,4,3)).toBe("11")
    expect(getTriangleType(9,3,3)).toBe("00")
})
test("isSquareGreater", () => {
    const ariaCr = 3
    const ariaSq = 4
    expect(isSquareGreater(ariaCr,ariaSq)).toBe(true)
})

test("getSum", () => {

    expect(getSum(1000)).toBe(1)
    expect(getSum(1256)).toBe(14)
    expect(getSum(1080)).toBe(9)
})
test("getBanknotesList", () => {
    const result1500 = getBanknotesList(1500)
    const result123 = getBanknotesList(123)
    expect(result1500[0]).toBe(1000)
    expect(result1500[1]).toBe(500)
    expect(result123[0]).toBe(100)
    expect(result123[1]).toBe(20)
    expect(result123[2]).toBe(2)
    expect(result123[3]).toBe(1)
})
