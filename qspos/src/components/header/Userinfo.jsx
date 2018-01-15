import React from 'react';
import { connect } from 'dva';
import { Menu, Dropdown, Icon, Modal, Form, Input, Button,message} from 'antd';
import {GetServerData} from '../../services/services';
import {getShiftInfo} from '../../components/Method/Print';

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
            <Form onSubmit={this.handleSubmit} className='userlogin_form'>
                <FormItem>
                    {getFieldDecorator('username', {})(
                        <Input prefix={<Icon type="user" className='f13'/>} disabled className='usersinput'/>
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
                    <Button type="primary" htmlType="submit" className='userloginformbutton'>
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
                    payload: {code:'qerp.web.qpos.st.user.sale.exchangequery',values:{}}
                })
                this.showModal()
            }) 
        }
        if(key==2){
            window.open('../../static/Qtools POS使用帮助.pdf')
       
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
                payload: {code:'qerp.pos.ur.user.logout',values:{}}
            })
           
        }
    }
    handleOk = (e) => {
        if(this.state.isshift){
           console.log(this.props.urUser)
            let values={stUserSaleId:this.props.urUser.urUserId}
            const result=GetServerData('qerp.web.qpos.st.user.sale.update',values)
                result.then((res) => {
                  return res;
                }).then((json) => {
                    console.log(json)
                    if(json.code=='0'){
                        this.setState({
                            visible: false
                        },function(){
                            message.success('交班成功',1,this.logoutsettime())
                            //判断是否打印
                            const result=GetServerData('qerp.pos.sy.config.info');
                            result.then((res) => {
                            return res;
                            }).then((json) => {
                                    if(json.code == "0"){
                                        if(json.config.exchangePrint=='1'){
                                            //判断是打印大的还是小的
                                            if(json.config.paperSize=='80'){
                                                getShiftInfo(this.props.userSales,this.props.urUser,"80",json.config.exchangePrintNum);
                                                // GetLodop(this.props.orderId,'odReturn',this.props.odReturn.returnNo,true)
                                            }else{
                                                getShiftInfo(this.props.userSales,this.props.urUser,"58",json.config.exchangePrintNum);
                                                // GetLodop(this.props.orderId,'odReturn',this.props.odReturn.returnNo,false)
                                            } 
                                        }
                                    }else{
                                        message.warning('打印失败')
                                    }
                            })
                        })
                    }else{
                        message.error(json.message);
                    }
                })


        }else{
             this.setState({
                visible: false
            })
        }   
    }

    logoutsettime=()=>{
        this.logout()
    //    setTimeout(this.logout,2000)
    }

    logout=()=>{
        location.reload();
        // this.context.router.push('/')
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
        const userSales=this.props.userSales
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
            <div className='jiaos'>
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
                    className='dropdownmodal dropdownmodal-changePerson'
                    footer={[
                        <div className='fl tc usermodelfootbtn' key='back' onClick={this.handleCancel.bind(this)}>取消</div>,
                        <div className='fr tc themecolor usermodelfootbtn' key='submit' onClick={this.handleOk.bind(this)}>确定</div>,
                        <div className='dividingline' key='line'></div>
                    ]}
                >
                    <div className='pb20 usershift_box'>
                        <div className='themebgcolor usershift_top'>
                            <div className='w usershift_count'>
                                <div className='clearfix fff usershift_top_title'>
                                    <div className='fl f14'>本次登录时间：{userSales.lastExchangeLoginTimeStr} -- {userSales.endTime}</div>
                                    <div className='fr f20'>收营员：{userSales.nickname}</div>
                                </div>
                                <div>
                                    <ul className='clearfix posion ul-3-style'>
                                        <li className='fl tc f20 fff usershift_top_list'><span className='f14'>销售额</span><br/>￥{userSales.amount}</li>
                                        <li className='fr tc f20 fff usershift_top_list'><span className='f14'>净收款</span><br/>￥{userSales.icAmount}</li>
                                        <li className='w tc f20 fff usershift_top_list'><span className='f14'>销售订单</span><br/>{userSales.orderQty}笔</li>
                                        <li className='usershift_top_list_line1'></li>
                                        <li className='usershift_top_list_line2'></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <ul className='clearfix shift_bottom_list w usershift_counts'>
                            <li><span className='f14 c74'>现金</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.cashAmount}</span></li>
                            <li><span className='f14 c74'>微信</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.wechatAmount}</span></li>
                            <li><span className='f14 c74'>支付宝</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.alipayAmount}</span></li>
                            <li><span className='f14 c74'>银联</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.unionpayAmount}</span></li>
                            <li><span className='f14 c74'>会员充值</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.cardChargeAmount}</span></li>
                            <li><span className='f14 c74'>会员消费</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.cardConsumeAmount}</span></li>
                            <li><span className='f14 c74'>积分抵扣</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.pointAmount}</span></li>
                            <li><span className='f14 c74'>退款</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.refundAmount}</span></li>
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
                    className='dropdownmodal dropdownmodal-changePwd'
                    footer={null}
                >
                    <div>
                        <div className='userloginlogo'>
                            <div className='userloginlogobox'>
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

function Userinfo({dispatch,userSales,urUser}) {
    return (
        <div className='clearfix Userinfobox'>
            <div className='fl f14 fff Userinfospshop'>{sessionStorage.getItem("spShop")}</div>
            <div className='fl fff userline'>|</div>
            <div className='fl userdropdownmenu'><Dropdownmenu dispatch={dispatch} userSales={userSales} urUser={urUser}/></div>
        </div>
  )
}

function mapStateToProps(state) {
    const {userSales,urUser} = state.header;
    sessionStorage.setItem('nickname',urUser.nickname);
    sessionStorage.setItem('urUserId',urUser.urUserId);
    sessionStorage.setItem('username',urUser.username);
    sessionStorage.setItem('spShop',urUser.shop.name);
    sessionStorage.setItem('spShopId',urUser.shop.spShopId);
    sessionStorage.setItem('role',urUser.role);
    sessionStorage.setItem('status',urUser.status);
    return {userSales,urUser};
}

export default connect(mapStateToProps)(Userinfo);

