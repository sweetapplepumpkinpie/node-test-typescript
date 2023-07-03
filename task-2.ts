export function counter(value: number = 0): [() => void, () => number] {
  let init = value
  const get = () => {
    console.log(init)
  }
  const next = () => {
    return ++init
  }
  return [get, next]
}
const [getA, nextA] = counter(1)
getA() //
nextA()
getA() // 2
const [getB, nextB] = counter(10)
nextB()
getA() // 2
getB() // 11
nextA()
getA() // 3
getB() // 11
