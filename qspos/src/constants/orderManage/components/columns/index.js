import { Popover } from 'antd';

const renderCol = (record, text) => {
  const popverContent = <span>{record.activityName}</span>;
  let Mod;
  if (record.activityName&&record.activityName!='') {
    Mod = <Popover content={popverContent} placement="bottom">
            <span className="pover-text">
              {text}
            </span>
          </Popover >
  } else {
    Mod = <span> { text }</span>;
  }
  return Mod;
}

const OrderColumns = [
  {
    title: '商品条码',
    dataIndex: 'code',
    render:(text,record,index) => {
      return <div className="td-wrap">
        {renderCol(record, text)}
        {record.activityName&&record.activityName!=''&&<span className="activity-mark"></span>}
      </div>
    }
  },{
    title: '商品名称',
    dataIndex: 'name',
  },{
    title: '规格',
    dataIndex: 'displayName',
  },{
    title: '销售数量',
    dataIndex: 'qty',
  },{
    title: '零售价（元/个）',
    dataIndex: 'price',
  },{
    title: '折扣',
    dataIndex: 'discount',
  },{
    title: '折后总价（元）',
    dataIndex: 'payPrice',
  },{
    title: '实付总价（元）',
    dataIndex: 'realPrice',
    render:(text,record,index)=> {
      return<span>{record.payPrice}</span>
    }
  }]
const OrderAppColumns = [
  {
    title: '商品条码',
    dataIndex: 'code',
    render:(text,record,index) => {
      return <div className="td-wrap">
        {renderCol(record, text)}
        {record.activityName&&record.activityName!=''&&<span className="activity-mark"></span>}
      </div>
    }
  },{
    title: '商品名称',
    dataIndex: 'name',
  },{
    title: '规格',
    dataIndex: 'displayName',
  },{
    title: '标记',
    dataIndex: 'sign',
    render:(text,record,index)=> {
      console.log(!!record.sign)
      return<span>{record.sign==0&&record.sign!=null?'赠品':''}</span>
    }
  },{
    title: '销售数量',
    dataIndex: 'qty',
  },{
    title: '零售价（元/个）',
    dataIndex: 'price',
  },{
    title: '折扣',
    dataIndex: 'discount',
  },{
    title: '折后总价（元）',
    dataIndex: 'payPrice',
  },{
    title: '实付总价（元）',
    dataIndex: 'realPayPrice',
    render:(text,record,index)=> {
      return<span>{record.realPayPrice}</span>
    }
  }]

const ReturnOdColumns = [
  {
    title: '商品条码',
    dataIndex: 'code',
  },{
    title: '商品名称',
    dataIndex: 'name',
  },{
    title: '规格',
    dataIndex: 'displayName',
  },{
    title: '退货数量',
    dataIndex: 'qty',
  },{
    title: '可退价（元/个）',
    dataIndex: 'refundablePrice',
  },{
    title: '实退价（元/个）',
    dataIndex: 'realPrice',
  },{
    title: '退货总价（元）',
    dataIndex: 'refundAmount',
  }]
const RechargeColumns = [
  {
    title: '充值前余额',
    dataIndex: 'beforeAmount',
  },{
    title: '充值金额',
    dataIndex: 'amount',
  },{
    title: '充值后余额',
    dataIndex: 'afterAmount',
  }]

export default {OrderColumns,ReturnOdColumns,RechargeColumns,OrderAppColumns};
