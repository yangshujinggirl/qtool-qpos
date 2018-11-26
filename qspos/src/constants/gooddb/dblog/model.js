import { Button, Modal, Form, Input } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;

const AdjustTextForm =({loading,visible, onCancel, onCreate,form:{getFieldDecorator,validateFields}}) => {
    function handleOk(e){
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          onCreate(values)
        }
      })
    }

    return (
      <Modal
        visible={visible}
        title='撤销商品调拨'
        okText="确定"
        onCancel={onCancel}
        onOk={handleOk}
        className="adjust-text-modal"
        footer={<div>
          <Button onClick={onCancel} >取消</Button>
          <Button type="primary" onClick={handleOk} loading={loading}>确定</Button>
        </div>}>
        <Form layout="vertical">
          <FormItem label='撤销商品调拨的原因'>
            {getFieldDecorator('cancelRemark',{
              rules: [{ required: true, message: '请输入撤销本次商品调拨原因或其它备注信息、必填、100字以下' }]
            })(<TextArea rows={4} placeholder="请输入撤销本次商品调拨原因或其它备注信息、必填、100字以下"/>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }


const DbTextModal = Form.create()(AdjustTextForm);
export default DbTextModal;
