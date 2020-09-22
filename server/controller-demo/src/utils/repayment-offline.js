import * as Constant from '@constant/repayment-offline'
export const getNameByStatusCode = (category) => {
  const listHash = {
    'repayment-auto': Constant.REPAYMENT_STATUS_LIST_AUTO,
    'repayment-bank-statement-auto': Constant.REPAYMENT_STATUS_LIST_AUTO_BANK_STATEMENT,
    'repayment-manual': Constant.REPAYMENT_STATUS_LIST_MANUAL,
    'repayment-bank-statement-manual': Constant.REPAYMENT_STATUS_LIST_MANUAL_BANK_STATEMENT,
  };

  const statusList = listHash[category] || [];
  const reducer = (accumulator, currentValue) => {
    const { value, label } = currentValue;
    if (value) {
      accumulator[value] = label; 
    }
    return accumulator;
  };
  const statusMap = statusList.reduce(reducer, {});
  return (code = '') => statusMap[code];
}

export const getNameByMessageCode = (code = '') => {
  const hash = {
    'Y': '是',
    'N': '否',
  };
  return hash[code];
}
