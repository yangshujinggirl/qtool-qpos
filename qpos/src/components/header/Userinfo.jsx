import React from 'react';
import { connect } from 'dva';
import { Menu, Dropdown, Icon, Modal, Button, Form , Input } from 'antd';


// 样式
const shift_box={
    width:'550px',
    paddingBottom:'20px'
}
const shift_count={
    width:'508px'
}
const shift_counts={
    width:'530px'
}
const hrefshift_box={
    width:'274px',
    fontSize: '14px'
}
const hrefshift_boxs={
    width:'274px',
    fontSize: '14px',
    color:'#35BAB0'
}
const modelfooters={
    height:'20px',
    lineHeight:'20px',
    marginTop:'20px'
}

const shift_top={
    height: '168px',
    background: '#35BAB0'
}
const shift_top_title={
    borderBottom: '1px solid rgba(255,255,255,0.5)',
    height:'60px',
    lineHeight:'60px',
    color:'#fff'
}
const shift_top_list={
  width: '130px',
  textAlign:'center',
  color:'#fff',
  marginTop:'24px'
}
const dividingline={
  width: '2px',
  height: '15px',
  background:'#E7E8EC',
  margin:'0 auto',
  marginTop: '24px'
}
const shift_top_list_line1={
    width:'2px',
    height:'30px',
    background:'rgba(255,255,255,0.5)',
    position:'absolute',
    left:'150px',
    top:'35px'

}
const shift_top_list_line2={
    width:'2px',
    height:'30px',
    background:'rgba(255,255,255,0.5)',
    position:'absolute',
    left:'350px',
    top:'35px'
}






//交班
function Shift() {
    return (
        <div style={shift_box}>
            <div style={shift_top}>
                <div style={shift_count} className='w'>
                    <div className='clearfix' style={shift_top_title}>
                        <div className='fl f14'>本次登录时间：05／20  08:00 -- 05/20  18:21</div>
                        <div className='fr f20'>收营员：大湿湿</div>
                    </div>
                    <div>
                        <ul className='clearfix posion'>
                            <li style={shift_top_list} className='fl tc f20'><span className='f14'>销售额</span><br/>￥123456.00</li>
                            <li style={shift_top_list} className='fr tc f20'><span className='f14'>净收款</span><br/>￥123456.00</li>
                            <li style={shift_top_list} className='w tc f20'><span className='f14'>销售订单</span><br/>￥123456.00</li>
                            <li style={shift_top_list_line1}></li>
                            <li style={shift_top_list_line2}></li>
                        </ul>
                    </div>
                </div>
            </div>
            <ul className='clearfix shift_bottom_list w' style={shift_counts}>
                <li><span className='f14 c74'>现金</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>9999.99</span></li>
                <li><span className='f14 c74'>微信</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>9999.99</span></li>
                <li><span className='f14 c74'>支付宝</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>9999.99</span></li>
                <li><span className='f14 c74'>银联</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>9999.99</span></li>
                <li><span className='f14 c74'>会员充值</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>9999.99</span></li>
                <li><span className='f14 c74'>会员消费</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>9999.99</span></li>
                <li><span className='f14 c74'>积分抵扣</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>9999.99</span></li>
                <li><span className='f14 c74'>退款</span><br/><span className='f12 c74'>￥</span><span className='f20 c1A'>9999.99</span></li>
            </ul>
        </div>
  )
}

//修改密码
function Revesivepassword() {
    return (
        <div>苏州吴江邻里广场店</div>
  )
}

class Dropdownmenu extends React.Component {
    state = { 
        visible: false,
        title:''
    }
    onClick=({ key })=>{
        console.log(key)
        if(key==1){
            console.log(this)
            // this.props.dispatch({
            //     type:'header/shift',
            //     payload: {code:'qerp.pos.od.user.shift'}
            // })

            this.showModal('交班',true)
        }
        if(key==2){
       
        }
        if(key==3){
            this.showModal('修改密码',false)
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
        })
    }
    handleCancel = (e) => {
        this.setState({
            visible: false
        })
    }
    showModal = (title,isshift) => {
        this.setState({
            visible: true,
            title:title,
            isshift:isshift
        })
    }
    render() {
        const menu1 = (
            <Menu style={{textAlign:'center'}} onClick={this.onClick.bind(this)}>
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
            <Menu style={{textAlign:'center'}} onClick={this.onClick.bind(this)}>
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
                <Dropdown overlay={this.props.role=='1'?menu2:menu1} className='dropdown'>
                    <span className="ant-dropdown-link" style={{color:'#fff',fontSize:'14px'}}>{this.props.nickname} <Icon type="down" style={{color:'#fff'}}/></span>
                </Dropdown>
                <Modal
                    title={this.state.title}
                    visible={this.state.visible}
                    closable={false}
                    footer={null}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    className='dropdownmodal'
                    footer={[
                          <div className='fl tc' style={{width:'244px',fontSize: '14px',height:'60px',lineHeight:'60px'}} key='back' onClick={this.handleCancel.bind(this)}>取消</div>,
                          <div className='fl tc' style={{width:'244px',fontSize: '14px',color:'#35BAB0',height:'60px',lineHeight:'60px'}} key='submit' onClick={this.handleOk.bind(this)}>确定</div>,
                          <div style={dividingline} key='line'></div>
          ]}
                    >
                    {
                        this.state.isshift
                        ?<Shift/>
                        :<Revesivepassword/>
                    }
                </Modal>
            </div>
        )
    }
}
Dropdownmenu.contextTypes= {
    router: React.PropTypes.object
}

function Userinfo({dispatch,shop,nickname,role}) {
    return (
        <div style={{marginTop:'36px',marginRight:'30px'}} className='clearfix'>
            <div style={{color:'#fff',fontSize:'14px',height:'20px',lineHeight:'20px'}} className='fl'>{shop.name}</div>
            <div className='fl' style={{color:'#fff',margin:'-2px 10px 0',height:'20px'}}>|</div>
            <div className='fl' style={{marginTop:'-1px'}}><Dropdownmenu nickname={nickname} role={role} dispatch={dispatch}/></div>
        </div>
  )
}

function mapStateToProps(state) {
    console.log(state)
  const {shop,nickname,role} = state.header.urUser;
     return {shop,nickname,role};
}

export default connect(mapStateToProps)(Userinfo);

