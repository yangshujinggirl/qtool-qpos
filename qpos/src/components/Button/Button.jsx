import React from 'react';
import { Modal, Button } from 'antd';

const widthmeth={
	width:'100px',
	height:'40px',
	background:'#FFF',
	border: '1px solid #E7E8EC',
	borderRadius: '3px',
	color: '#35BAB0',
	fontSize: '14px',
	textAlign:'center',
	lineHeight:'40px'
}
const popwidthmeth={
	width:'100px',
	height:'40px'
}

const dividingline={
  width: '2px',
  height: '15px',
  background:'#E7E8EC',
  margin:'0 auto',
  marginTop:'12px'
}

const cz={
  width: '100px',
  height: '40px',
  margin:'0 auto',
  lineHeight:'40px'
}




//按钮弹窗
export class LocalizedModal extends React.Component {
  state = { visible: false }
  showModal = () => {
  	console.log(2)
    this.setState({
      visible: true
    });
  }
  hideModal = () => {
    this.setState({
      visible: false,
    });
  }
    handleCancel = () => {
    this.setState({ visible: false });
  }
  handleOk = () => {
   this.setState({ visible: false });
  }

  render() {

    const asd=(Number(this.props.width)-2)/2+'px'

    return (
      <div>
      	<div onClick={this.showModal} style={popwidthmeth}><Buttonico text={this.props.text}/></div>
        <Modal
          title={this.props.text}
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
          width={this.props.width+'px'}
          closable={false}
          footer={[
              <div className='fl tc' style={{width:asd,fontSize: '14px',height:'40px',lineHeight:'40px'}} key='back' onClick={this.handleCancel.bind(this)}>取消</div>,
              <div className='fl tc' style={{width:asd,fontSize: '14px',color:'#35BAB0',height:'40px',lineHeight:'40px'}} key='submit' onClick={this.handleOk.bind(this)}>确定</div>,
              <div style={dividingline} key='line'></div>
          ]}
        >
         {this.props.content}
        </Modal>
      </div>
    );
  }
}


//button
export function Buttonico({text}) {
  return (
    <div style={widthmeth}>
      {text}
    </div>
  );
}

