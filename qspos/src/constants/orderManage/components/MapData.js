const BusinessTypeMap={
  1:'门店POS订单',
  2:'门店APP订单',
  3:'仓库直邮订单',
  4:'保税订单',
}
const OrderStatusMap={
  1:"已接单",
  2:"进行中",
  3:"已完成",
  4:"已关闭",
  5:"已退货"
}
const DeliveryMap={
  1:"门店自提",
  2:"同城配送",
  3:"门店邮寄",
}

export default {
  BusinessTypeMap,
  OrderStatusMap,
  DeliveryMap
}
