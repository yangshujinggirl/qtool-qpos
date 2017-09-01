import React from 'react';
import { connect } from 'dva';
import { Menu, Dropdown, Icon, Modal, Form, Input, Button,message} from 'antd';
import { Messagesuccess } from '../Method/Method';

//css
const shift_box={width:'550px'}
const shift_count={width:'508px'}
const shift_counts={width:'530px'}
const shift_top={height: '168px'}
const shift_top_title={borderBottom: '1px solid rgba(255,255,255,0.5)',height:'60px',lineHeight:'60px'}
const shift_top_list={width: '130px',marginTop:'24px'}
const shift_top_list_line1={width:'2px',height:'30px',background:'rgba(255,255,255,0.5)',position:'absolute',left:'150px',top:'35px'}
const shift_top_list_line2={width:'2px',height:'30px',background:'rgba(255,255,255,0.5)',position:'absolute',left:'350px',top:'35px'}
const modelfootbtn={width:'244px',height:'60px',lineHeight:'60px'}
const Userinfobox={marginTop:'36px',marginRight:'30px'}
const Userinfospshop={height:'20px',lineHeight:'20px'}
const line={margin:'-1px 10px 0',height:'20px'}
const userdropdownmenu={marginTop:'-1px'}
const loginlogo={width: '100%',height: '168px',background: '#35BAB0',overflow: 'hidden',borderRadius: '3px 3px 0 0'}
const loginlogobox={width:'210px',height: '83px',margin:'0 auto',marginTop: '43px'}
const loginformbutton={width: '100%',marginTop: '12px'}
const login_form={maxWidth: '400px',margin:'0 auto',marginTop:'30px'}
// 修改密码form
const FormItem = Form.Item;
class NormalLoginForm extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      login:true
    }
  }
  setvalue=(values)=>{
    this.props.form.setFieldsValue({
      username: values,
    });
  }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
                const result=GetServerData('qerp.pos.ur.user.passwordupdate',values)
                result.then((res) => {
                  return res;
                }).then((json) => {
                    if(json.code=='0'){
                        this.props.handleCancel()
                    }else{
                        message.error(json.message);
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
                        <Input prefix={<Icon type="user" className='f13'/>}/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('oldPassword', {})(
                        <Input prefix={<Icon type="lock" />}  placeholder="输入6-16位原密码" className='f13'/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('newPassword', {})(
                        <Input prefix={<Icon type="lock" />}  placeholder="输入6-16位新密码" className='f13'/>
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" style={loginformbutton}>
                         确认修改
                    </Button>
                </FormItem>
            </Form>
        );
    }
    componentDidMount(){
        let username=sessionStorage.getItem("username")
        this.setvalue(username)

    }

}
NormalLoginForm.contextTypes= {
    router: React.PropTypes.object
}
const WrappedNormalLoginForm = Form.create()(NormalLoginForm);






//修改密码
function Revesivepassword() {
    return (
        <div>苏州吴江邻里广场店</div>
   )
}

class Dropdownmenu extends React.Component {
    state = { 
        visible: false,
        title:'',
        isshift:true
    }
    onClick=({ key })=>{
        if(key==1){
            this.setState({
               isshift:true
            },function(){
                this.props.dispatch({
                    type:'header/shift',
                    payload: {code:'qerp.pos.od.user.shift'}
                })
                this.showModal()
            }) 
        }
        if(key==2){
            window.open('../../static/adjust.xlsx')
       
        }
        if(key==3){
            this.setState({
                isshift:false
            },function(){

                this.showModal()
            })
            
        }
        if(key==4){
              this.props.dispatch({
                type:'header/logout',
                payload: {code:'qerp.pos.ur.user.logout'}
            })
           
        }
    }
    handleOk = (e) => {
        this.setState({
            visible: false
        },function(){
            Messagesuccess('交班成功',4,this.logout)
        })
    }
    logout=()=>{
        this.context.router.push('/')
    }

    handleCancel = (e) => {
        this.setState({
            visible: false
        })
    }
    showModal = (title,isshift) => {
        this.setState({
            visible: true
        })
    }
    render() {
        const saleDataDetail=this.props.saleDataDetail
        const menu1 = (
            <Menu onClick={this.onClick.bind(this)} className='tc'>
                <Menu.Item key='1'>
                  <span className='menuitem'>交班</span>
                </Menu.Item>
                <Menu.Item key='2'>
                  <span className='menuitem'>帮助</span>
                </Menu.Item>
                <Menu.Item key='3'>
                  <span className='menuitem'>修改密码</span>
                </Menu.Item>
                <Menu.Item key='4'>
                  <span className='menuitem'>退出登录</span>
                </Menu.Item>
            </Menu>
        )
        const menu2=(
            <Menu onClick={this.onClick.bind(this)} className='tc'>
                <Menu.Item key='1'>
                  <span className='menuitem'>交班</span>
                </Menu.Item>
                <Menu.Item key='2'>
                  <span className='menuitem'>帮助</span>
                </Menu.Item>
                <Menu.Item key='4'>
                  <span className='menuitem'>退出登录</span>
                </Menu.Item>
            </Menu>
        )
        return (
            <div style={{height:'20px'}}>
                <Dropdown overlay={sessionStorage.getItem("role")=='1'?menu2:menu1} className='dropdown'>
                    <span className="ant-dropdown-link point f14 fff">{sessionStorage.getItem("nickname")} <Icon type="down" className='fff'/></span>
                </Dropdown>
                {
                    this.state.isshift
                    ?<Modal
                    title={null}
                    visible={this.state.visible}
                    closable={false}
                    footer={null}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    className='dropdownmodal'
                    footer={[
                        <div className='fl tc f14' style={modelfootbtn} key='back' onClick={this.handleCancel.bind(this)}>取消</div>,
                        <div className='fl tc f14 themecolor' style={modelfootbtn} key='submit' onClick={this.handleOk.bind(this)}>确定</div>,
                        <div className='dividingline' key='line'></div>
                    ]}
                >
                    <div style={shift_box} className='pb20'>
                        <div style={shift_top} className='themebgcolor'>
                            <div style={shift_count} className='w'>
                                <div className='clearfix fff' style={shift_top_title}>
                                    <div className='fl f14'>本次登录时间：{saleDataDetail.loginTimeSt} -- {saleDataDetail.loginTimeEd}</div>
                                    <div className='fr f20'>收营员：{saleDataDetail.nickname}</div>
                                </div>
                                <div>
                                    <ul className='clearfix posion'>
                                        <li style={shift_top_list} className='fl tc f20 fff'><span className='f14'>销售额</span><br/>￥{saleDataDetail.amountSum}</li>
                                        <li style={shift_top_list} className='fr tc f20 fff'><span className='f14'>净收款</span><br/>￥{saleDataDetail.profitSum}</li>
                                        <li style={shift_top_list} className='w tc f20 fff'><span className='f14'>销售订单</span><br/>{saleDataDetail.orderSum}笔</li>
                                        <li style={shift_top_list_line1}></li>
                                        <li style={shift_top_list_line2}></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <ul className='clearfix shift_bottom_list w' style={shift_counts}>
                            <li><span className='f14 c74'>现金</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{saleDataDetail.cashSum}</span></li>
                            <li><span className='f14 c74'>微信</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{saleDataDetail.wechatSum}</span></li>
                            <li><span className='f14 c74'>支付宝</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{saleDataDetail.alipaySum}</span></li>
                            <li><span className='f14 c74'>银联</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{saleDataDetail.bankCardSum}</span></li>
                            <li><span className='f14 c74'>会员充值</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{saleDataDetail.cardRechargeSum}</span></li>
                            <li><span className='f14 c74'>会员消费</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{saleDataDetail.cardAmountSum}</span></li>
                            <li><span className='f14 c74'>积分抵扣</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{saleDataDetail.cardPonitSum}</span></li>
                            <li><span className='f14 c74'>退款</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{saleDataDetail.returnSum}</span></li>
                        </ul>
                    </div>
                </Modal>
                :<Modal
                    title={null}
                    visible={this.state.visible}
                    closable={false}
                    footer={null}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    className='dropdownmodal'
                    footer={null}
                >
                    <div>
                        <div style={loginlogo}>
                            <div style={loginlogobox}>
                                <img src={require('../../images/logo_head.png')} className='w100 h100'/>
                            </div>
                        </div>
                        <div className='login-form'><WrappedNormalLoginForm handleCancel={this.handleCancel.bind(this)}/></div>
                    </div>
                </Modal>


                }
                
            </div>
        )
    }
}
Dropdownmenu.contextTypes= {
    router: React.PropTypes.object
}

function Userinfo({dispatch,saleDataDetail}) {
    return (
        <div style={Userinfobox} className='clearfix'>
            <div style={Userinfospshop} className='fl f14 fff'>{sessionStorage.getItem("spShop")}</div>
            <div className='fl fff' style={line}>|</div>
            <div className='fl' style={userdropdownmenu}><Dropdownmenu dispatch={dispatch} saleDataDetail={saleDataDetail}/></div>
        </div>
  )
}

function mapStateToProps(state) {
    console.log(state)
    const {saleDataDetail} = state.header;
    return {saleDataDetail};
}

export default connect(mapStateToProps)(Userinfo);

