const OrderColumns = [{
    title: '商品条码',
    dataIndex: 'code',
  },{
    title: '商品名称',
    dataIndex: 'name',
  },{
    title: '规格',
    dataIndex: 'gg',
  },{
    title: '销售数量',
    dataIndex: 'num',
  },{
    title: '零售价（元/个）',
    dataIndex: 'price',
  },{
    title: '折扣',
    dataIndex: 'dis',
  },{
    title: '折后总价（元）',
    dataIndex: 'total',
  }]
const RechargeColumns = [{
    title: '充值前余额',
    dataIndex: 'code',
  },{
    title: '充值金额',
    dataIndex: 'name',
  },{
    title: '充值后余额',
    dataIndex: 'gg',
  }]

export default {OrderColumns,RechargeColumns};
