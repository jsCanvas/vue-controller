export const REPAYMENT_STATUS_LIST_AUTO = [
  { value: 'P', label: '待打款', id: '1'},
  { value: 'I', label: '入账处理中', id: '2'},
  { value: 'S', label: '入账成功', id: '3'},
  { value: 'F', label: '入账失败', id: '4'},
  { value: 'C', label: '超时关闭', id: '5'},
];
export const REPAYMENT_STATUS_LIST_MANUAL = [
  { value: 'I', label: '待匹配', id: '1'},
  { value: 'M', label: '待更正', id: '2'},
  { value: 'A', label: '入账处理中', id: '3'},
  { value: 'C', label: '无法匹配', id: '4'},
  { value: 'B', label: '已完成', id: '5'},
];
export const REPAYMENT_STATUS_LIST_AUTO_BANK_STATEMENT = [
  { value: 'A', label: '入账处理中', id: '1'},
  { value: 'B', label: '入账成功', id: '2'},
  { value: 'Z', label: '转配账', id: '3'},
  { value: 'ZT', label: '意向校验失败转配账', id: '4'},
];
export const REPAYMENT_STATUS_LIST_MANUAL_BANK_STATEMENT = [
  { value: 'P', label: '待审核', id: '1'},
  { value: 'I', label: '待匹配 ', id: '2'},
  { value: 'A', label: '已入账', id: '3'},
  { value: 'C', label: '已作废', id: '4'},
  { value: 'B', label: '已完成', id: '5'},
];

export const REPAYMENT_SYS_CODE_LIST = [
  { value: 'GCOLO', label: '催收系统', id: '1' },
  { value: 'crmapi', label: '客服系统', id: '2' },
  { value: 'CashierApi', label: '支付系统', id: '3' },
  { value: 'SCM', label: 'SCM', id: '4' },
]
