import { Button, Modal, Form, Input } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;

const AdjustTextForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form ,type} = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title={type=='1'?'确定商品调拨':(type=='2'?'撤销商品调拨':null)}
        okText="确定"
        onCancel={onCancel}
        onOk={onCreate}
        className="adjust-text-modal"
      >
        <Form layout="vertical">
			<FormItem label={type=='1'?'商品调拨备注':(type=='2'?'撤销商品调拨':null)}>
				{getFieldDecorator('remark',{
					rules: [{ required: true, message: '请输入商品调拨原因或其他备注信息、必填、100字以下' }]
				})(<TextArea rows={4} placeholder="请输入商品调拨原因或其他备注信息、必填、100字以下"/>)}
			</FormItem>
        </Form>
      </Modal>
    );
  }
);

const DbTextModal = Form.create()(AdjustTextForm);

export default DbTextModal;