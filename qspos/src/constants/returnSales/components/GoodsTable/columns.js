import { Input, Form, Select, Button, DatePicker, Popover, Checkbox } from 'antd';

const FormItem = Form.Item;

const columnsIndx =(onChangeRowKey, onChangeField, onBlurField)=> {

  return  [
    {
      title: '选择',
      dataIndex: 'key',
      width:'8%',
			render:(text, record, index)=>{
					return (
							<Checkbox
								disabled={record.canReturnQty<=0?true:false}
								onChange={(e)=>onChangeRowKey(e,record,index)}></Checkbox>
					)
			}
    }, {
      title: '商品条码',
      width:'10%',
      dataIndex: 'code',
    }, {
      title: '商品名称',
      width:'15%',
      dataIndex: 'name',
    },{
      title: '规格',
      width:'10%',
      dataIndex: 'displayName',
    },{
      title: '零售价',
      width:'10%',
      dataIndex: 'price',
    },{
				title: '可退价',
				width:'10%',
				dataIndex: 'canReturnPrice'
		},{
				title: '可退数量',
				width:'8%',
				dataIndex: 'canReturnQty'
		},{
      title: '退货数量',
      width:'10%',
      dataIndex: 'qty',
      render: (text, record, index) => {
        return (
					<Input
						disabled={record.canReturnQty<=0?true:false}
						value={record.qty}
						onChange={(e)=>onChangeField(e,index,'qty')}
						onBlur={(e)=>onBlurField(e,index,'qty')}
						maxLength='15'
						autoComplete="off"/>
        )
      }
    },{
      title: '退货总价',
      width:'10%',
      dataIndex: 'canReturnPayPrice',
      render: (text, record, index) => {
        return (
					<Input
						disabled={record.canReturnQty<=0?true:false}
						value={record.canReturnPayPrice}
						onChange={(e)=>onChangeField(e,index,'canReturnPayPrice')}
						onBlur={(e)=>onBlurField(e,index,'canReturnPayPrice')}
						maxLength='15'
						autoComplete="off"/>
        )
      }
  }];
}
export { columnsIndx };
