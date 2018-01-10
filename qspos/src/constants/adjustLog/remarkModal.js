import { Button, Modal, Form, Input, Radio } from 'antd';
const FormItem = Form.Item;

class RemarkText extends React.Component{

    hideModal = () =>{
       this.props.changeVisible();
   }

    render(){
        return (
            <Modal
                title="损益备注"
                visible={this.props.visible}
                onCancel={this.hideModal}
                closable={false}
                footer={null}
                maskClosable={true}
            >
            <p>{this.props.remarkText}</p>
          </Modal>
        );
    }

}

export default RemarkText;