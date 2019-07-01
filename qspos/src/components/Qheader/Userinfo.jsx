import React from 'react';
import { connect } from 'dva';
import { Menu, Dropdown, Icon, Modal, Form, Input, Button,message, Tooltip} from 'antd';
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
  componentDidMount(){
    let username=sessionStorage.getItem("username")
    this.setvalue(username)
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
          {getFieldDecorator('username')(
              <Input prefix={<Icon type="user" className='f13'/>} disabled className='usersinput'/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('oldPassword')(
              <Input prefix={<Icon type="lock" />}  placeholder="输入6-16位原密码" className='f13' autoComplete="off"/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('newPassword')(
            <Input prefix={<Icon type="lock" />}  placeholder="输入6-16位新密码" className='f13' autoComplete="off"/>
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
    switch(key) {
      case "1":
        this.setState({
           isshift:true
        },()=>{
          this.props.dispatch({
              type:'header/shift',
              payload: {code:'qerp.web.qpos.st.user.sale.exchangequery',values:{}}
          })
          this.showModal()
        });
        break;
      case "2":
        window.open('../../static/help.pdf')
        break;
      case "3":
        this.setState({
            isshift:false
        },function(){
            this.showModal()
        })
        break;
      case "4":
        this.props.dispatch({
          type:'header/logout',
          payload: {code:'qerp.pos.ur.user.logout',values:{}}
        })
        break;
    }
  }
  handleOk = (e) => {
    if(!this.state.isshift){
      this.setState({
         visible: false
      });
      return;
    }
    let values = { stUserSaleId: this.props.urUser.urUserId }
    GetServerData('qerp.web.qpos.st.user.sale.update', values)
    .then((json) => {
      if(json.code=='0'){
        this.setState({
            visible: false
        }, () => {
          message.success('交班成功', 1, this.logoutsettime())
          //判断是否打印
          GetServerData('qerp.pos.sy.config.info')
          .then((json) => {
            if(json.code !== "0"){
              message.warning('打印失败');
              return;
            }
            if(json.config.exchangePrint=='1'){
              //判断是打印大的还是小的
              if(json.config.paperSize=='80'){
                getShiftInfo(this.props.userAllInfo,this.props.urUser,"80",json.config.exchangePrintNum);
              }else{
                getShiftInfo(this.props.userAllInfo,this.props.urUser,"58",json.config.exchangePrintNum);
              }
            }
          })
        })
      }else{
        message.error(json.message);
      }
    })
  }
  logoutsettime=()=>{
     setTimeout(this.logout,2000)
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
    const userSales=this.props.userSales;
    const role = sessionStorage.getItem('role');
    const nickname = sessionStorage.getItem('nickname');
    const menuSource = (
        <Menu onClick={this.onClick.bind(this)} className='tc'>
            <Menu.Item key='1'>
              <span className='menuitem'>交班</span>
            </Menu.Item>
            <Menu.Item key='2'>
              <span className='menuitem'>帮助</span>
            </Menu.Item>
            {
              role !== '1'&&
              <Menu.Item key='3'>
                <span className='menuitem'>修改密码</span>
              </Menu.Item>
            }
            <Menu.Item key='4'>
              <span className='menuitem'>退出登录</span>
            </Menu.Item>
        </Menu>
      )
    return (
      <div>
        <Dropdown
          overlay={menuSource}
          overlayClassName='dropdown-handle'>
            <span className="dropdown-nickname">
              {nickname} <Icon type="down" className='fff'/>
           </span>
        </Dropdown>
        {
          this.state.isshift ?
          <Modal
            title={null}
            visible={this.state.visible}
            closable={false}
            footer={null}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={700}
            className='account-handle-modal'
            footer={[
                <div className='fl tc usermodelfootbtn' key='back' onClick={this.handleCancel.bind(this)}>取消</div>,
                <div className='fr tc themecolor usermodelfootbtn' key='submit' onClick={this.handleOk.bind(this)}>确定</div>,
                <div className='dividingline' key='line'></div>
            ]}>
            <div className='pb20 usershift_box'>
              <div className='themebgcolor usershift_top'>
                <div className='w usershift_count'>
                  <div className='clearfix fff usershift_top_title'>
                    <div className='fl f14 pop_tits'>本次登录时间：<span>{userSales.lastExchangeLoginTimeStr} -- {userSales.endTime}</span></div>
                    <div className='fr f20'>收银员：{userSales.nickname}</div>
                  </div>
                  <div>
                    <ul className='clearfix posion ul-3-style'>
                      <li className='fl tc f20 fff usershift_top_list'>
                        <Tooltip title="销售订单总金额 - 退货订单总金额">
                          <div>
                            <div className="tools-title">
                              <span className='f14 pop_tits sale-key'>销售额</span>
                              <Icon type="exclamation-circle-o f14" />
                            </div>
                            <div className='pop_titsq'>￥{userSales.amount}</div>
                          </div>
                        </Tooltip>
                      </li>
                      <li className='fr tc f20 fff usershift_top_list'>
                        <Tooltip title="微信+支付宝+现金+银联+APP支付">
                          <div>
                            <div className="tools-title">
                              <span className='f14 pop_tits sale-key'>净收款</span>
                              <Icon type="exclamation-circle-o f14" />
                            </div>
                            <div className='pop_titsq'>￥{userSales.icAmount}</div>
                          </div>
                        </Tooltip>
                      </li>
                      <li className='w tc f20 fff usershift_top_list'>
                        <Tooltip title="所有订单总数">
                          <div>
                            <div className="tools-title">
                              <span className='f14 pop_tits sale-key'>订单数</span>
                              <Icon type="exclamation-circle-o f14" />
                            </div>
                            <div className='pop_titsq'>￥{userSales.orderQty}</div>
                          </div>
                        </Tooltip>
                      </li>
                      <li className='usershift_top_list_line1'></li>
                      <li className='usershift_top_list_line2'></li>
                    </ul>
                  </div>
                </div>
              </div>
              <ul className='clearfix shift_bottom_list w usershift_counts'>
                <li><span className='f14 c74'>微信转账</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.wechatAmount}</span></li>
                <li><span className='f14 c74'>微信扫码</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.scanWechatAmount}</span></li>
                <li><span className='f14 c74'>支付宝转账</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.alipayAmount}</span></li>
                <li><span className='f14 c74'>支付宝扫码</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.scanAlipayAmount}</span></li>
                {
                  role!='3'&&
                  <li><span className='f14 c74'>App支付</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.appPay}</span></li>
                }
                <li><span className='f14 c74'>现金</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.cashAmount}</span></li>
                <li><span className='f14 c74'>银联</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.unionpayAmount}</span></li>
                <li><span className='f14 c74'>会员充值</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.cardChargeAmount}</span></li>
                <li><span className='f14 c74'>会员消费</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.cardConsumeAmount}</span></li>
                <li><span className='f14 c74'>积分抵扣</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.pointAmount}</span></li>
                <li><span className='f14 c74'>退款</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>{userSales.refundAmount}</span></li>
              </ul>
            </div>
          </Modal>
        :
          <Modal
            width={700}
            title={null}
            visible={this.state.visible}
            closable={false}
            footer={null}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            className='account-handle-modal'
            footer={null}>
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

function Userinfo({ dispatch, userSales, urUser, allData }) {
  return (
    <div className='account-info'>
      <div className='shop-name'>{sessionStorage.getItem("spShop")}</div>
      <div className='line'>|</div>
      <Dropdownmenu
        dispatch={dispatch}
        userAllInfo={allData}
        userSales={userSales}
        urUser={urUser} />
    </div>
  )
}

function mapStateToProps(state) {
  const { userSales, urUser, allData } = state.header;
  sessionStorage.setItem('nickname', urUser.nickname);
  sessionStorage.setItem('urUserId', urUser.urUserId);
  sessionStorage.setItem('username', urUser.username);
  sessionStorage.setItem('spShop', urUser.shop.name);
  sessionStorage.setItem('spShopId', urUser.shop.spShopId);
  sessionStorage.setItem('role', urUser.role);
  sessionStorage.setItem('status', urUser.status);
  return { userSales, urUser, allData };
}

export default connect(mapStateToProps)(Userinfo);
