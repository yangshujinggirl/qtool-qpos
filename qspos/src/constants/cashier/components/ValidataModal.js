import { Modal, Button ,Input,message,Checkbox } from 'antd';
import ReactDOM from 'react-dom';
import {GetServerData} from '../../../services/services';
import NP from 'number-precision'
import './ValidataModal.less';
//引入打印
let timer;
class ValidataModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone:'',
      phoneCode:'',
      btnText:'获取验证码',
      count:60,
      isSend:true,
      loading:false,
      disabled:false,
    }
  }
  //倒计时
  handleClick() {
    timer = setInterval(() => {
      let count = this.state.count;
      this.setState({ isSend:false })
      count-=1;
      if(count<1) {
        clearInterval(timer);
        this.setState({
          isSend:true,
          count:60,
          btnText:'重新获取',
        });
      } else {
        this.setState({
          count,
          btnText:`${count}秒后重发`,
        })
      }
    },1000)
  }
  //获取code
  getPhoneCode() {
    this.setState({ loading: true });
    let params = {
          phoneNo:this.props.memberinfo.mobile,
          mbCardId:this.props.memberinfo.mbCardId
        }
    GetServerData('qerp.web.qpos.od.pay.code',params)
    .then((res) => {
      if(res.code == '0') {
        this.handleClick()
      } else {
        message.error(res.message)
      }
      this.setState({ loading: false })
    })
  }
  onChange(e) {
    const target = e.nativeEvent.target;
    const value = target.value;
    let disabled;
    this.props.changePhoneCode(value);
    this.setState({
      phoneCode:value,
      disabled:!!value
    })
  }
  //提交
  onOk() {
    if(this.validateCode()) {
      const { memberinfo } =this.props;
      //校验验证码是否有效
      GetServerData('qerp.web.qpos.od.pay.codevalid',{
        phoneNo:memberinfo.mobile,
        messagecode:this.state.phoneCode,
        mbCardId:memberinfo.mbCardId
      })
      .then((res) => {
        if(res.code == '0') {
          this.resetForm()
          this.props.onSubmit()
        } else {
          message.error(res.message)
        }
      })
    }
  }
  validateCode(value) {
    let regCode = /^\d{4}$/;
    const { phoneCode } =this.state;
    if(!regCode.test(phoneCode)) {
      message.error('请输入正确的验证码')
      return false
    } else {
      return true
    }
  }
  //tab键聚焦验证码表单
  onKeyUp=(e)=>{
		if(e.keyCode==9){
      const Valuemember=ReactDOM.findDOMNode(this.refs.phoneCode);
  		Valuemember.focus()
		}
	}
  //阻止默认事件
	onKeydown=(e)=>{
		if(e.keyCode==9){
			e.preventDefault()
		}
	}
  resetForm() {
    const phoneCode = ReactDOM.findDOMNode(this.refs.phoneCode);
    phoneCode.value = '';
    clearInterval(timer);
    this.setState({
      phoneCode:'',
      isSend:true,
      count:60,
      btnText:'获取验证码',
    })
  }
  onCancel() {
    this.resetForm();
    this.props.onCancel()
  }
  render() {
    const { phone, btnText, disabled, isSend, loading } = this.state;
    const { memberinfo } =this.props;
    return(
      <Modal
        title="会员使用会员卡/积分支付需进行手机验证"
        // visible={true}
        visible={this.props.visible}
        onCancel={()=>this.onCancel()}
        width={400}
        closable={false}
        className="validate-modal-wrap"
        footer={null}>
          <div className='validate-modal-components'>
            <div className="row">
              <Input
                ref="phone"
                type="text"
                autoComplete="off"
                disabled={true}
                maxLength={11}
                value={memberinfo&&memberinfo.mobile}
                onKeyUp={this.onKeyUp.bind(this)}
                onKeyDown={this.onKeydown.bind(this)}
                placeholder="请输入手机号"/>
                <div className="get-code-btn">
                  <Button
                    loading={loading}
                    disabled={!isSend}
                    onClick={this.getPhoneCode.bind(this)}>{btnText}</Button>
                </div>
            </div>
            <div className="row">
              <Input
                type="text"
                ref='phoneCode'
                autoComplete="off"
                maxLength={4}
                onChange={this.onChange.bind(this)}
                placeholder="请输入4位数字验证码"/>
            </div>
            <div className="row btn-list">
              <Button className="cancel-btn" onClick={()=>this.onCancel()}>取消</Button>
              <Button
                loading={this.props.loading}
                disabled={!disabled}
                type="primary"
                className="sure-btn"
                onClick={this.onOk.bind(this)}>提交</Button>
            </div>
          </div>
      </Modal>
    )
  }
}

export default ValidataModal;
