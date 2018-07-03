import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import {GetServerData} from '../services/services';

//css
const f13={
    fontSize:'13px'
}
const FormItem = Form.Item;

function Logo() {
    return (
        <div className='loginlogos'>

            <img src={require('../images/login_banner.png')} className='w100 h100'/>
        </div>
  )
}

//登录form
class NormalLoginForm extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      login:true,
      passwordtype:true,
      password1:'',
      password2:''

    }
  }
    hindkeyup=(e)=>{
        if(e.keyCode=='13'){
            this.handleSubmit(e)
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const result=GetServerData('qerp.pos.ur.user.login',values)
                console.log(result)
                result.then((res) => {
                  return res;
                }).then((json) => {
                    if(json.code=='0'){
                        sessionStorage.setItem('openWechat',json.urUser.shop.openWechat);
                        sessionStorage.setItem('openAlipay',json.urUser.shop.openAlipay);
                        this.context.router.push('/cashier')
                    }else{
                        this.setState({
                            login:false,
                      })
                    }
                })
            }
        })
    }
    focus=()=>{
        this.setState({
            passwordtype:false
        })
    }
    render() {
        const { getFieldDecorator,getFieldProps } = this.props.form;
        return (
            <Form  className='login_forms'>
                <FormItem>
                    {getFieldDecorator('username', {})(
                        <Input prefix={<Icon type="user" className='f13' />} placeholder="输入手机号" size="large" style={{"width":"100%"}}/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {})(
                        <Input prefix={<Icon type="lock"  className='f13'/>}  placeholder="输入密码" type='password' style={{"width":"100%"}} onKeyUp={this.hindkeyup.bind(this)} size="large"/>
                    )}
                </FormItem>
                <FormItem>
                    <div className={this.state.login?'login_form_forgot':'login_form_forgots'}>手机号或密码错误，请重新输入</div>
                    <Button type="primary" className='loginformbuttons' onClick={this.handleSubmit.bind(this)} size='large'>
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
