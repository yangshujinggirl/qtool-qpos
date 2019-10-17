import { Link } from 'dva/router';
import  { activityStatusOption, activityTypeOption } from '../optionMap';

const columns = [
  {
    title: '活动名称',
    dataIndex: 'activityName',
    render:(text,record,index)=> {
      return <Link className="linkStyle" to={`/activityInfo/${record.activityId}`}>{record.activityName}</Link>
    }
  },{
    title: '活动时间',
    dataIndex: 'time',
    render:(text,record,index)=> {
      return <span>{record.activityStartT}~{record.activityEndT}</span>
    }
  },{
    title: '活动类型',
    dataIndex: 'activityType',
    render:(text,record,index) => {
      return <span>{
        activityTypeOption.map((el,index)=>(
          <span key={index}>{el.key==record.activityType&&el.value}</span>
        ))
      }</span>
    }
  },{
    title: '活动状态',
    dataIndex: 'activityStatus',
    render:(text,record,index) => {
      let statusCls;
      switch(record.activityStatus) {
        case "3":
          statusCls = "will-status";
          break;
        case "4":
          statusCls = "ing-status";
          break;
        case "5":
        case "6":
          statusCls = "over-status";
          break;
      }
      return <span>{
                activityStatusOption.map((el,index)=>(
                  <span key={index} className={statusCls}>{el.key==record.activityStatus&&el.value}</span>
                ))
              }
            </span>
    }
  },{
    title: '参与平台',
    dataIndex: 'activtyPlatform',

  }]
const columnsInfo = [
  {
    title: '商品条码',
    dataIndex: 'pdCode',
  },{
    title: '商品名称',
    dataIndex: 'pdName',
  },{
    title: '规格',
    dataIndex: 'displayName',
    render: (text, record, index) => {
      return <span>{record.pdType1Val}{`${record.pdType2Val&&`/${record.pdType2Val}`}`}</span>
    }
  },{
    title: '零售价',
    dataIndex: 'sailPrice',
  },{
    title: '活动价',
    dataIndex: 'activityPrice',
  }]
const columnsSingleInfo = [
  {
    title: '商品条码',
    dataIndex: 'pdCode',
  },{
    title: '商品名称',
    dataIndex: 'pdName',
  },{
    title: '规格',
    dataIndex: 'displayName',
    render: (text, record, index) => {
      return <span>{record.pdType1Val}{`${record.pdType2Val&&`/${record.pdType2Val}`}`}</span>
    }
  },{
    title: '零售价',
    dataIndex: 'sailPrice',
  },{
    title: '活动描述',
    dataIndex: 'activityMsg',
  }]
const columnsAreaSubtractInfo = [
  {
    title: '商品条码',
    dataIndex: 'pdCode',
  },{
    title: '商品名称',
    dataIndex: 'pdName',
  },{
    title: '规格',
    dataIndex: 'displayName',
    render: (text, record, index) => {
      return <span>{record.pdType1Val}{`${record.pdType2Val&&`/${record.pdType2Val}`}`}</span>
    }
  },{
    title: '零售价',
    dataIndex: 'sailPrice',
  }]
export {
  columns, columnsInfo, columnsSingleInfo, columnsAreaSubtractInfo
 };
