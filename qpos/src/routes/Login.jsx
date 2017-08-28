import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import {GetServerData} from '../services/services';

//css
const loginlogo={
    width: '100%',
    height: '168px',
    background: '#35BAB0',
    overflow: 'hidden',
    borderRadius: '3px 3px 0 0'
}
const loginlogobox={
    width:'210px',
    height: '83px',
    margin:'0 auto',
    marginTop: '43px'
}
const loginformbutton={
    width: '100%',
    marginTop: '12px'
}
const login_form={
    maxWidth: '400px',
    margin:'0 auto',
    marginTop:'30px'
}
const f13={
    fontSize:'13px'
}
const FormItem = Form.Item;

function Logo() {
    return (
        <div style={loginlogo}>
            <div style={loginlogobox}>
                <img src={require('../images/logo_head.png')} className='w100 h100'/>
            </div>
        </div>
  )
}

//登录form
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
                const result=GetServerData('qerp.pos.ur.user.login',values)
                result.then((res) => {
                  return res;
                }).then((json) => {
                    if(json.code=='0'){
                       this.context.router.push('/cashier')
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
            <Form onSubmit={this.handleSubmit} style={login_form}>
                <FormItem>
                    {getFieldDecorator('username', {})(
                        <Input prefix={<Icon type="user" style={f13} />} placeholder="输入手机号" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {})(
                        <Input prefix={<Icon type="lock" style={f13} />} type="password" placeholder="输入密码" />
                    )}
                </FormItem>
                <FormItem>
                    <div className={this.state.login?'login_form_forgot':'tc'} style={{fontSize:'12px',color: '#D7636B'}}>手机号或密码错误，请重新输入</div>
                    <Button type="primary" htmlType="submit" style={loginformbutton}>
                        立即登录
                    </Button>
                </FormItem>
            </Form>
        );
    }
}
NormalLoginForm.contextTypes= {
    router: React.PropTypes.object
}
const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

//index
class IndexPage extends React.Component {
    render() {
        return (
            <div className='loginindex'>
                <div className='login'>
                    <Logo/>
                    <div className='login-form'><WrappedNormalLoginForm/></div>
                </div>
            </div>
        )
    }
}

export default IndexPage;





