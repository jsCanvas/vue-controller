import BigNumber from 'bignumber.js'

// 加法
export const plus = (num1, num2) => {
  return (new BigNumber(num1)).plus(num2).toNumber();
}

// 减法
export const minus = (num1, num2) => {
  return (new BigNumber(num1)).minus(num2).toNumber();
}

// 乘法
export const times = (num1, num2) => {
  return (new BigNumber(num1)).times(num2).toNumber();
}

// 除法
export const divide = (num1, num2) => {
  return (new BigNumber(num1)).div(num2).toNumber();
}

