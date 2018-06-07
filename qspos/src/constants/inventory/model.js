import { Button, Modal, Form, Input } from 'antd';
import './model.css'
const FormItem = Form.Item;


const footleft={width:'224px',fontSize: '16px',height:'60px',lineHeight:'60px',cursor: 'pointer',}
const footright={width:'224px',fontSize: '16px',color:'#35BAB0',height:'60px',lineHeight:'60px',cursor: 'pointer'}
const footcen={width: '1px',height: '15px',background:'#d8d8d8',margin:'0 auto',marginTop: '20px'}

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form ,record} = this.props;
	  const { getFieldDecorator } = form;
	  console.log(record)
      return (
        <Modal
          visible={visible}
          title="修改盘数量"
          onCancel={onCancel}
          onOk={onCreate}
          className='inven_model'
          footer={[
            <div className='fl tc' style={footleft} key='back' onClick={onCancel}>取消</div>,
            <div className='fr tc' style={footright} key='submit' onClick={onCreate}>确定</div>,
            <div style={footcen} key='line'></div>
        ]}
        >
          <Form>
            <FormItem
                label="商品条码" 
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('barcode',{
				  initialValue: record.barcode,
			  })(

                <Input disabled/>
              )}
            </FormItem>
            <FormItem
                label="商品名称"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('name',{
				  initialValue: record.name,
			  })(<Input disabled />)}
            </FormItem>
            <FormItem 
                label="商品规格"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                >
              {getFieldDecorator('displayName',{
				  initialValue: record.displayName,
			  })(<Input disabled/>)}
            </FormItem>
			<FormItem 
                label="系统数量"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('inventory',{
				  initialValue: record.inventory,
			  })(<Input disabled/>)}
            </FormItem>
            <FormItem 
                label="盘点数量"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('checkQty',{
				  	initialValue: record.checkQty,
                    rules: [{ required: true, message: '请输入盘点数量' }],
              })(<Input/>)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

class Editmodel extends React.Component {
	state = {
		visible: false,
	};
	showModal = () => {
		this.setState({ visible: true });
	}
	handleCancel = () => {
		this.setState({ visible: false },function(){
			const form = this.formRef.props.form;
			form.resetFields();
		});
	}
	handleCreate = () => {
		const form = this.formRef.props.form;
		form.validateFields((err, values) => {
		if (err) {
			return;
		}

		console.log('Received values of form: ', values);
		//把新的盘点数派给table
		const checkQty=values.checkQty
		const index=this.props.index
		this.props.getNewcheckData(checkQty,index)

		form.resetFields();
		this.setState({ visible: false });
		});
	}
	saveFormRef = (formRef) => {
		this.formRef = formRef;
	}
  render() {
    return (
      <div>
        <span  onClick={this.showModal} className='themecolor point'>修改盘数量</span>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
		  onCreate={this.handleCreate}
		  record={this.props.recorddata}
        />
      </div>
    );
  }
}





export default Editmodel