import { Button, Modal, Form, Input, Radio } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const AdjustTextForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="确定损益"
        okText="确定"
        onCancel={onCancel}
        onOk={onCreate}
        className="adjust-text-modal"
      >
        <Form layout="vertical">
		<FormItem label="损益备注">
				{getFieldDecorator('type',{
					rules: [{ required: true, message: '请选择商品损益类型' }]
				})(
					<RadioGroup>
						<Radio value={1}>店铺活动赠品</Radio>
						<Radio value={2}>仓储快递损坏</Radio>
						<Radio value={3}>商品丢失损坏</Radio>
						<Radio value={4}>盘点差异调整</Radio>
						<Radio value={5}>过期商品处理</Radio>
				  </RadioGroup>
				)}
				</FormItem>
			<FormItem label="损益备注">
				{getFieldDecorator('remark',{
					rules: [{ required: true, message: '请输入损益原因' }]
				})(<TextArea rows={4} placeholder="请输入损益原因或其他备注信息、必填、100字以下"/>)}
			</FormItem>
        </Form>
      </Modal>
    );
  }
);

const AdjustTextModal = Form.create()(AdjustTextForm);

export default AdjustTextModal;