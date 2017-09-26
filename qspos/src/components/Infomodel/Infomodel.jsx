import React from 'react';
import { Modal, Button ,Icon} from 'antd';

class Infomodel extends React.Component {
    state = { 
        visible: false,
        text:'',
        account:'',
        password:''
    }
    showModal = (text,account,password) => {
        console.log(text)
        this.setState({
            visible: true,
            text:text,
            account:account,
            password:password
        });
    }
    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
  }
  render() {
    return (
        <div>
            <Modal
                className='infomodels'
                title=""
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width={272}
                closable={false}
                header={null}
                footer={[
                        <div className='tc f26'  key='submit' onClick={this.handleOk.bind(this)} style={{height:'60px',lineHeight:'60px',color:'#384162'}}>确定</div>
                    ]}

            >
                <p><Icon type="check-circle" className='iconsuccess f26'/><span className='ml20 f30' style={{color:'#384162'}}>{this.state.text}</span></p>
                <p className='f18 mt20 modeltext'>账号：{this.state.account}</p>
                <p className='f18 mb10 modeltext'>密码：{this.state.password}</p>
            </Modal>
        </div>
    );
  }
}


export default Infomodel;
