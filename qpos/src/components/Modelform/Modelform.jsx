import React,{Component} from 'react';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message} from 'antd';
import {GetServerData} from '../../services/services';
import {Messagesuccess} from '../Method/Method';



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

const textcoloe={
    color: '#35BAB0'
}
const addaccountspan={
  	marginRight:'10px',
  	fontSize:'14px',
  	color: '#74777F'
}
const btn={
  	position:'absolute',
  	right:'0',
 	top:'0'
}
const inputwidth={
  	width:'340px',
 	  height:'40px'
}
const modelfooters={
  	height:'20px',
  	lineHeight:'20px',
  	marginTop:'40px'
}
const hrefshift_box={
  	width:'224px',
  	fontSize: '14px'
}
const hrefshift_boxs={
  	width:'224px',
  	fontSize: '14px',
   	color:'#35BAB0'
}
const footleft={
    width:'224px',
    fontSize: '14px',
    height:'60px',
    lineHeight:'60px'
}
const footlefts={
    width:'175px',
    fontSize: '14px',
    height:'60px',
    lineHeight:'60px'
}
const footright={
    width:'224px',
    fontSize: '14px',
    color:'#35BAB0',
    height:'60px',
    lineHeight:'60px'
}
const footrights={
    width:'175px',
    fontSize: '14px',
    color:'#35BAB0',
    height:'60px',
    lineHeight:'60px'
}


const footcen={
    width: '2px',
    height: '15px',
    background:'#E7E8EC',
    margin:'0 auto',
    marginTop: '20px'
}
const footcens={
    width:'100px',
    fontSize: '14px',
    height:'60px',
    lineHeight:'60px',
    margin:'0 auto',
    textAlign:'center'
}


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
class Modelform extends Component {
  	constructor(props) {
    	super(props);
    	this.state = {
      		visible: false,
       		membervalue: 1,
       		accountvalue:1
    	}
  	}
    MemberonChange = (e) => {
        console.log('radio checked', e.target.value);
       	this.props.form.setFieldsValue({
      		role: e.target.value,
    	});
    }
    AccountonChange = (e) => {
        console.log('radio checked', e.target.value);
        this.props.form.setFieldsValue({
      		status: e.target.value,
    	});
    }
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
        this.props.form.resetFields()
  	}
    handleCancel = () => {
    	this.setState({ visible: false });
        this.props.form.resetFields()
  	}
  	handleOk = () => {
  	  	this.props.form.validateFields((err, values) => {
      		if (!err) {
        		console.log(values)
        		if(this.props.type==false){
        			values.urUserId=this.props.record.urUserId
        		}
        		this.props.dispatch({
                	type:'account/save',
                	payload: {code:'qerp.pos.ur.user.save',values,type:this.props.type,meth:this.hideModal}
            	})
 	  			
			}
    	});
	}

	NicknameHindchange=(e)=>{
		this.setState({
			nickname:e.target.value
		})
	}
	UsernameHindchange=(e)=>{
		this.setState({
			username:e.target.value
		})
	}
    revisepassword=()=>{
        if(this.props.type==false){
            let urUserId = sessionStorage.getItem("urUserId");
            let values={urUserId:urUserId}
            console.log(urUserId)
            console.log(sessionStorage)
            const result=GetServerData('qerp.pos.ur.user.passwordreset',values)
                result.then((res) => {
                  return res;
                }).then((json) => {
                    console.log(json)
                    if(json.code=='0'){
                        Messagesuccess(json.newPassword)
                    }else{  
                       
                    }
                })
        }
    }

  	render() {
        const type=this.props.type
    	const { getFieldDecorator } = this.props.form;
     	const { nickname, username, role,status } = this.props.record;
    	return (
      		<div>
       			<div style={this.props.type?widthmeth:textcoloe} onClick={this.showModal.bind(this)}>
      				{this.props.text}
    			</div>
        		<Modal
           			title={this.props.text}
          			visible={this.state.visible}
          			onOk={this.hideModal}
          			onCancel={this.hideModal}
          			okText="确认"
          			cancelText="取消"
          			width={this.props.width+'px'}
          			closable={false}
                    width={450}
          			footer={[
              			<div className='fl tc' style={type?footleft:footlefts} key='back' onClick={this.handleCancel.bind(this)}>取消</div>,
              			<div className='fr tc' style={type?footright:footrights} key='submit' onClick={this.handleOk.bind(this)}>确定</div>,
              			<div style={type?footcen:footcens} key='line' onClick={this.revisepassword.bind(this)}>{type?null:'重置密码'}</div>


                       
          			]}
        		>
          			<Form className='formdis'>
           				<FormItem 
                            label="帐号名称"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 8 }}
                            >
          					{getFieldDecorator('nickname', {
          						initialValue: nickname,
            					rules: [{ required: true, message: '请输入账号名称' }],
          					})(
           						<Input placeholder="请输入1-5位会员姓名" style={inputwidth} />
          					)}
        				</FormItem>
				        <FormItem 
                            label="帐号电话"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 8 }}
                            >
				          	{getFieldDecorator('username', {
				          		initialValue: username,
				            	rules: [{ required: true, message: '请输入帐号电话' }],
				          	})(
				            	<Input placeholder="请输入11位手机号" style={inputwidth} />
				          	)}
				        </FormItem>
				        <FormItem  label="会员权限">
				          	{getFieldDecorator('role', {
				          		initialValue: Number(role)
				          	})(
					            <RadioGroup onChange={this.MemberonChange.bind(this)}>
					                <Radio value={1}>店主</Radio>
					                <Radio value={2}>店长</Radio>
					                <Radio value={3}>店员</Radio>
					            </RadioGroup>
				          	)}
				        </FormItem>
				        <FormItem label="帐号状态">
				          	{getFieldDecorator('status', {
				          		initialValue: Number(status)
				          	})(
					          	<RadioGroup onChange={this.AccountonChange.bind(this)}>
					                <Radio value={1}>启用</Radio>
					                <Radio value={0}>禁用</Radio>
					            </RadioGroup>
				          	)}
				        </FormItem>
          			</Form>
        		</Modal>
      		</div>
    	);
  	}
}

export default Form.create()(Modelform);