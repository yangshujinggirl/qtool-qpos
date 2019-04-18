import { Link } from 'dva/router';

const statusMap = {
  "0":"未开始",
  "1":"进行中",
  "2":"已结束",
  "3":"已失效"
}
const activityTypeMap = {
  "0":"全部",
  "1":"b端限时直降",
  "2":"b端活动进价",
  "3":"c端限时直降"
}
const columns = [{
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
      return activityTypeMap[record.activityType]
    }
  },{
    title: '活动状态',
    dataIndex: 'activityStatus',
    render:(text,record,index) => {
      let statusCls;
      switch(record.activityStatus) {
        case "0":
          statusCls = "will-status";
          break;
        case "1":
          statusCls = "ing-status";
          break;
        case "2":
        case "3":
          statusCls = "over-status";
          break;
      }
      return <span className={statusCls}>{statusMap[record.activityStatus]}</span>
    }
  },{
    title: '参与平台',
    dataIndex: 'activtyPlatform',

  }]

const columnsInfo = [{
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

export default { columns, columnsInfo, statusMap, activityTypeMap };
