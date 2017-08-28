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
 'top':'0'
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
  'width':'224px',
  'fontSize': '14px'
}

const hrefshift_boxs={
  'width':'224px',
  'fontSize': '14px',
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
    };
  }


     MemberonChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            membervalue: e.target.value,
        })
    }
    AccountonChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            accountvalue: e.target.value,
        })
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
       values.role=this.state.membervalue
       values.status=this.state.accountvalue
        console.log(values)
        //进行数据请求
        	this.props.dispatch({
                type:'account/save',
                payload: {code:'qerp.pos.ur.user.save',values}
            })
 	  this.setState({ visible: false });
      }
    });

  }







  render() {
  	const asd=(Number(this.props.width)-2)/2+'px'
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
     const { name, email, website } = this.props.record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <div>
       <div style={widthmeth} onClick={this.showModal.bind(this)}>
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
          <Form horizontal onSubmit={this.okHandler}>
           	<FormItem>
          {getFieldDecorator('nickname', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <div><span style={addaccountspan}>账号名称</span><Input placeholder="请输入1-5位会员姓名" style={inputwidth}/></div>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <div><span style={addaccountspan}>账号电话</span><Input placeholder="请输入11位手机号" style={inputwidth}/></div>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('role', {
          })(
            <div><span style={addaccountspan}>会员权限</span><RadioGroup onChange={this.MemberonChange.bind(this)} value={this.state.membervalue}>
                <Radio value={1}>店主</Radio>
                <Radio value={2}>店长</Radio>
                <Radio value={3}>店员</Radio>
            </RadioGroup>
          </div>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('status', {
           
          })(
            <div><span style={addaccountspan}>账号状态</span><RadioGroup onChange={this.AccountonChange.bind(this)} value={this.state.accountvalue}>
                <Radio value={1}>启用</Radio>
                <Radio value={0}>禁用</Radio>
            </RadioGroup>
            </div>
          )}
        </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}




export default Form.create()(Modelform);