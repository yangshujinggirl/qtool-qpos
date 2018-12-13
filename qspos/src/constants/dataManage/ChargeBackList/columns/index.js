const ReceiveDetailColumns = [{
          title: '商品条码',
          dataIndex: 'pdBarcode',
      },{
          title: '商品名称',
          dataIndex: 'pdSpuName',
      },{
          title: '商品规格',
          dataIndex: 'pdSkuType',
      },{
          title: '成本价',
          dataIndex: 'price',
      },{
          title: '预收数量',
          dataIndex: 'qty',
      },{
          title: '已收数量',
          dataIndex: 'receiveQty',
      },{
          title: '差异',
          dataIndex: 'differenceQty',
      },{
          title: '最后收货人',
          dataIndex: 'consignee',
      },{
          title: '最后操作时间',
          dataIndex: 'operateTime'
      }];
const ReturnDetailColumns = [{
          title: '商品条码',
          dataIndex: 'pdBarcode',
      },{
          title: '商品名称',
          dataIndex: 'pdSpuName',
      },{
          title: '商品规格',
          dataIndex: 'pdSkuType',
      },{
          title: '退货数量',
          dataIndex: 'price',
      }];
const ReceiveColumns = [{
      title: '订单号',
      dataIndex: 'orderNo',
      render:(text,record) => {
        return <span style={{color: "rgb(53, 186, 176)",cursor: "pointer"}} onClick={record.onOperateClick}>{record.orderNo}</span>
      }
  },{
      title: '商品总数',
      dataIndex: 'qtySum',
  },{
      title: '已收商品数量',
      dataIndex: 'receiveQty',
  },{
      title: '订单状态',
      dataIndex: 'statusStr',
  },{
      title: '收货人',
      dataIndex: 'consignee',
  },{
      title: '最后操作时间',
      dataIndex: 'operateTime',
  }];
const ReturnColumns = [{
      title: '订单号',
      dataIndex: 'orderNo',
  },{
      title: '业务类型',
      dataIndex: 'amount',
  },{
      title: '订单分类',
      dataIndex: 'saleAmount',
  },{
      title: '分成金额',
      dataIndex: 'wechatAmount',
  },{
      title: '订单完成时间',
      dataIndex: 'scanWechatAmount',
  }];

export default {
  ReceiveDetailColumns,
  ReturnDetailColumns,
  ReceiveColumns,
  ReturnColumns
}
