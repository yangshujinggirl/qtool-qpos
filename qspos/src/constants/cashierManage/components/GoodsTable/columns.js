import { Input, Form, Select, Button, DatePicker, Popover } from 'antd';
const FormItem = Form.Item;

const columnsIndx =(form)=> {
  //列渲染
	const renderCol = (record, text) => {
	  const popverContent = <span>{record.activityName}</span>;
	  let Mod;
	  if (record.isShowActivity=="1"&&record.activityId!='0') {
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
  return  [
    {
      title: '序号',
      dataIndex: 'key',
      width:'8%',
      render: (text, record, index) => {
         ++index
        return <div className="td-wrap">
                {renderCol(record,index)}
                {record.isShowActivity=="1"&&record.activityId!='0'&&<span className="activity-mark"></span>}
              </div>
      }
    }, {
      title: '商品条码',
      width:'10%',
      dataIndex: 'barcode',
      render: (text, record, index) => {
        return <div className="td-wrap">
              {renderCol(record,text)}
              </div>
      }
    }, {
      title: '商品名称',
      width:'15%',
      dataIndex: 'name',
      render: (text, record, index) => {
        return <div className="td-wrap">{renderCol(record,text)}</div>
      }
    },{
      title: '规格',
      width:'10%',
      dataIndex: 'displayName',
      render: (text, record, index) => {
        return <div className="td-wrap">{renderCol(record,text)}</div>
      }
    },{
      title: '零售价',
      width:'10%',
      dataIndex: 'toCPrice',
      render: (text, record, index) => {
        return <div className="td-wrap">{renderCol(record,text)}</div>
      }
    },{
      title: '数量',
      width:'10%',
      dataIndex: 'qty',
      render: (text, record, index) => {
        const { getFieldDecorator } =form;
        return (
          <FormItem>
            {getFieldDecorator(`orderDetails[${index}].qty`,{
              initialValue:record.qty,
              rules:[{pattern:/^\d+(\.\d{1,2})?$/,message:'请输入数字'}]
            })(
              <Input
                maxLength='15'
                autoComplete="off"/>
            )}
          </FormItem>
        )
      }
    },{
      title: '折扣',
      width:'10%',
      dataIndex: 'discount',
      render: (text, record, index) => {
        const { getFieldDecorator } =form;
				let disabled = false;
				if(record.isShowActivity=='1'&&record.activityId!='0') {
					disabled=true;
				}
        return (
          <FormItem>
            {getFieldDecorator(`orderDetails[${index}].discount`,{
              initialValue:record.discount,
              rules:[{pattern:/^\d+(\.\d{1,2})?$/,message:'请输入数字'}]
            })(
              <Input
                disabled={disabled}
                maxLength='15'
                autoComplete="off"/>
            )}
          </FormItem>
        )
      }
    },{
      title: '折后总价',
      width:'10%',
      dataIndex: 'payPrice',
      render: (text, record, index) => {
        const { getFieldDecorator } =form;
				let disabled = false;
				if(record.isShowActivity=='1'&&record.activityId!='0') {
					disabled=true;
				}
        return (
          <FormItem>
            {getFieldDecorator(`orderDetails[${index}].payPrice`,{
              initialValue:record.payPrice,
              rules:[{pattern:/^\d+(\.\d{1,2})?$/,message:'请输入数字'}]
            })(
              <Input
                disabled={disabled}
                maxLength='15'
                autoComplete="off"/>
            )}
          </FormItem>
        )
      }
  }];
}
export { columnsIndx };
