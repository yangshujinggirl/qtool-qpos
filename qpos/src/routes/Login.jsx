import React from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import {GetServerData} from '../services/services';

//logo
class Logo extends React.Component {
  render() {
      return (
        <div className='login-logo'>
           <div className='login-logobox'><img src={require('../images/logo_head.png')}/></div>
        </div>
    )
  }
}

//登录form
const FormItem = Form.Item;
class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login:true
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
            const result=GetServerData('qerp.web.bs.login',values)
            result.then((res) => {
              return res;
            }).then((json) => {
                console.log(json)
                this.props.postpath('/cashier','')
                if(json.code=='0'){
                    this.props.postpath('/cashier','')
                }else{  
                  this.setState({
                    login:false
                  })
                }
        })
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className='login_form'>
        <FormItem>
          {getFieldDecorator('userName', {
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="输入手机号" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="输入密码" />
          )}
        </FormItem>
        <FormItem>
          <span className={this.state.login?'login_form_forgot':'login_form_forgots'}>账号或密码输入错误</span>
          <Button type="primary" htmlType="submit" className='login_form_button'>
            立即登录
          </Button>
        </FormItem>
      </Form>
    );
  }
}
const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

//index
class IndexPage extends React.Component {
  render() {
      return (
        <div className='login'>
          <Logo/>
          <div className='login-form'><WrappedNormalLoginForm postpath={this.props.history.push.bind(this)}/></div>
        </div>
    )
  }
}
export default connect()(IndexPage);





