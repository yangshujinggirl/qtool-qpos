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
          dataIndex: 'pdName',
      },{
          title: '商品规格',
          dataIndex: 'pdSkuType',
      },{
          title: '退货数量',
          dataIndex: 'qty',
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
      title: '订单类型',
      dataIndex: 'typeStr',
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
      title: '退货单号',
      dataIndex: 'asnNo',
      render:(text,record) => {
        return <span style={{color: "rgb(53, 186, 176)",cursor: "pointer"}} onClick={record.onOperateClick}>{record.asnNo}</span>
      }
  },{
      title: '关联门店订单',
      dataIndex: 'spOrderNo',
  },{
      title: '退货商品总数',
      dataIndex: 'qtySum',
  },{
      title: '订单状态',
      dataIndex: 'statusStr',
  },{
      title: '退货时间',
      dataIndex: 'createTime',
  },{
      title: '退货完成时间',
      dataIndex: 'updateTime',
  }];

export default {
  ReceiveDetailColumns,
  ReturnDetailColumns,
  ReceiveColumns,
  ReturnColumns
}
