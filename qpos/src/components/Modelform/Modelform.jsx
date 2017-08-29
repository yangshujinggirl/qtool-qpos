import React,{Component} from 'react';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message} from 'antd';
import {GetServerData} from '../../services/services';


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
  	marginTop:'20px'
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
const dividingline={
  	width: '2px',
  	height: '15px',
  	background:'#E7E8EC',
  	margin:'0 auto',
  	marginTop: '3px'
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
  	}
    handleCancel = () => {
    	this.setState({ visible: false });
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
                	payload: {code:'qerp.pos.ur.user.save',values,type:this.props.type}
            	})
 	  			this.setState({ visible: false });
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

  	render() {
  		const asd=(Number(this.props.width)-2)/2+'px'
    	const { getFieldDecorator } = this.props.form;
     	const { nickname, username, role,status } = this.props.record;
     	console.log(this)
    	const formItemLayout = {
      		labelCol: { span: 6 },
      		wrapperCol: { span: 14 },
    	};
    	return (
      		<div>
       			<div style={this.props.type?widthmeth:null} onClick={this.showModal.bind(this)}>
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
          			footer={[
              			<div className='fl tc' style={{width:asd,fontSize: '14px',height:'40px',lineHeight:'40px'}} key='back' onClick={this.handleCancel.bind(this)}>取消</div>,
              			<div className='fl tc' style={{width:asd,fontSize: '14px',color:'#35BAB0',height:'40px',lineHeight:'40px'}} key='submit' onClick={this.handleOk.bind(this)}>确定</div>,
              			<div style={dividingline} key='line'></div>
          			]}
        		>
          			<Form>
           				<FormItem label="帐号名称">
          					{getFieldDecorator('nickname', {
          						initialValue: nickname,
            					rules: [{ required: true, message: 'Please input your username!' }],
          					})(
           						<Input placeholder="请输入1-5位会员姓名" style={inputwidth} />
          					)}
        				</FormItem>
				        <FormItem label="帐号电话">
				          	{getFieldDecorator('username', {
				          		initialValue: username,
				            	rules: [{ required: true, message: 'Please input your Password!' }],
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