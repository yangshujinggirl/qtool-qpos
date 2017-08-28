import React from 'react';
import { Modal, Form, Input } from 'antd';
const FormItem = Form.Item;

const widthmeth={
	width:'100px',
	height:'40px',
	background:'#FFF',
	border: '1px solid #E7E8EC',
	borderRadius: '3px',
	color: '#35BAB0',
	fontSize: '14px',
	textAlign:'center',
	lineHeight:'40px',
    cursor: 'pointer'

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
// class LocalizedModal extends React.Component {
//   state = { 
//     visible: false,
//     membervalue: 1,
//     accountvalue:1
//     }
//      }
//   showModal = () => {
//   	console.log(2)
//     this.setState({
//       visible: true
//     });
//   }
//   hideModal = () => {
//     this.setState({
//       visible: false,
//     });
//   }
//     handleCancel = () => {
//     this.setState({ visible: false });
//   }
//   handleOk = () => {
    
//    //  const dispatch=this.props.dispatch
//    //  const type='table/save'
//    //  const payload={code:'qerp.pos.ur.user.save',values:''}
//    //  dispatch({
//    //     type:type,
//    //     payload:payload
//    //  })
//    // this.setState({ visible: false });
//   }
//      MemberonChange = (e) => {
//         console.log('radio checked', e.target.value);
//         this.setState({
//             membervalue: e.target.value,
//         })
//     }
//     AccountonChange = (e) => {
//         console.log('radio checked', e.target.value);
//         this.setState({
//             accountvalue: e.target.value,
//         })
//     }



//    handleSubmit = (e) => {
//     e.preventDefault();
//     this.props.form.validateFields((err, values) => {
//       if (!err) {
//         console.log('Received values of form: ', values);
//       }
//     });
//   }


//   render() {
//      const { getFieldDecorator } = this.props.form;
//     const asd=(Number(this.props.width)-2)/2+'px'

//     return (
//       <div>
//       	<div onClick={this.showModal} style={popwidthmeth}><Buttonico text={this.props.text}/></div>
//         <Modal
//           title={this.props.text}
//           visible={this.state.visible}
//           onOk={this.hideModal}
//           onCancel={this.hideModal}
//           okText="确认"
//           cancelText="取消"
//           width={this.props.width+'px'}
//           closable={false}
//           footer={[
//               <div className='fl tc' style={{width:asd,fontSize: '14px',height:'40px',lineHeight:'40px'}} key='back' onClick={this.handleCancel.bind(this)}>取消</div>,
//               <div className='fl tc' style={{width:asd,fontSize: '14px',color:'#35BAB0',height:'40px',lineHeight:'40px'}} key='submit' onClick={this.handleOk.bind(this)}>确定</div>,
//               <div style={dividingline} key='line'></div>
//           ]}
//         >
//           <Form onSubmit={this.handleSubmit}>
//         <FormItem>
//           {getFieldDecorator('userName', {
//             rules: [{ required: true, message: 'Please input your username!' }],
//           })(
//             <div><span style={addaccountspan}>账号名称</span><Input placeholder="请输入1-5位会员姓名" style={inputwidth}/></div>
//           )}
//         </FormItem>
//         <FormItem>
//           {getFieldDecorator('password', {
//             rules: [{ required: true, message: 'Please input your Password!' }],
//           })(
//             <div><span style={addaccountspan}>账号电话</span><Input placeholder="请输入11位手机号" style={inputwidth}/></div>
//           )}
//         </FormItem>
//         <FormItem>
//           {getFieldDecorator('password2', {
//             rules: [{ required: true, message: 'Please input your Password!' }],
//           })(
//             <div><span style={addaccountspan}>会员权限</span><RadioGroup onChange={this.MemberonChange.bind(this)} value={this.state.membervalue}>
//                 <Radio value={1}>店主</Radio>
//                 <Radio value={2}>店员</Radio>
//             </RadioGroup>
//           </div>
//           )}
//         </FormItem>
//         <FormItem>
//           {getFieldDecorator('passwords', {
//             rules: [{ required: true, message: 'Please input your Password!' }],
//           })(
//             <div><span style={addaccountspan}>账号状态</span><RadioGroup onChange={this.AccountonChange.bind(this)} value={this.state.accountvalue}>
//                 <Radio value={1}>启用</Radio>
//                 <Radio value={2}>禁用</Radio>
//             </RadioGroup>
//             </div>
//           )}
//         </FormItem>
//       </Form>
//         </Modal>
//       </div>
//     );
//   }
// }



// export  Form.create()(LocalizedModal);







// class UserEditModal extends Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       visible: false,
//     };
//   }

//   showModelHandler = (e) => {
//     if (e) e.stopPropagation();
//     this.setState({
//       visible: true,
//     });
//   };

//   hideModelHandler = () => {
//     this.setState({
//       visible: false,
//     });
//   };

//   okHandler = () => {
//     const { onOk } = this.props;
//     this.props.form.validateFields((err, values) => {
//       if (!err) {
//         onOk(values);
//         this.hideModelHandler();
//       }
//     });
//   };

//   render() {
//     const { children } = this.props;
//     const { getFieldDecorator } = this.props.form;
//     const { name, email, website } = this.props.record;
//     const formItemLayout = {
//       labelCol: { span: 6 },
//       wrapperCol: { span: 14 },
//     };

//     return (
//       <span>
//         <span onClick={this.showModelHandler}>
//           { children }
//         </span>
//         <Modal
//           title="Edit User"
//           visible={this.state.visible}
//           onOk={this.okHandler}
//           onCancel={this.hideModelHandler}
//         >
//           <Form horizontal onSubmit={this.okHandler}>
//             <FormItem
//               {...formItemLayout}
//               label="Name"
//             >
//               {
//                 getFieldDecorator('name', {
//                   initialValue: name,
//                 })(<Input />)
//               }
//             </FormItem>
//             <FormItem
//               {...formItemLayout}
//               label="Email"
//             >
//               {
//                 getFieldDecorator('email', {
//                   initialValue: email,
//                 })(<Input />)
//               }
//             </FormItem>
//             <FormItem
//               {...formItemLayout}
//               label="Website"
//             >
//               {
//                 getFieldDecorator('website', {
//                   initialValue: website,
//                 })(<Input />)
//               }
//             </FormItem>
//           </Form>
//         </Modal>
//       </span>
//     );
//   }
// }

// export Form.create()(UserEditModal);



//button
export function Buttonico({text}) {
  return (
    <div style={widthmeth}>
      {text}
    </div>
  );
}

