import { Button, Modal, Form, Input, Radio } from 'antd';
const FormItem = Form.Item;

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
      >
        <Form layout="vertical">
          <FormItem label="损益备注">
            {getFieldDecorator('remark',{
                 rules: [{ required: true, message: '请输入损益原因' }]
            })(<Input type="textarea" placeholder="请输入损益原因或其他备注信息、必填、100字以下"/>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

const AdjustTextModal = Form.create()(AdjustTextForm);

export default AdjustTextModal;