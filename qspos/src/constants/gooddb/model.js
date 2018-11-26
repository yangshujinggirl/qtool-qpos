import { Button, Modal, Form, Input } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;

const AdjustTextForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form ,type, loading} = props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        visible={visible}
        title='确定商品调拨'
        okText="确定"
        onCancel={onCancel}
        footer={<div>
          <Button onClick={onCancel} >取消</Button>
          <Button type="primary" onClick={onCreate} loading={loading}>确定</Button>
        </div>}
        className="adjust-text-modal">
          <Form layout="vertical">
            <FormItem label='商品调拨备注'>
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
