import React from 'react';
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
    borderBottom: '1px solid rgba(255,255,255,0.5)'
}
const shift_top_list={
  width: '130px'
}
const dividingline={
  width: '2px',
  height: '15px',
  background:'#E7E8EC',
  margin:'0 auto',
  marginTop: '3px'
}

//交班
function Shift() {
    return (
        <div style={shift_box}>
            <div style={shift_top}>
                <div style={shift_count} className='w'>
                    <div className='clearfix' style={shift_top_title}>
                        <div className='fl'>本次登录时间：05／20  08:00 -- 05/20  18:21</div>
                        <div className='fr'>收营员：大湿湿</div>
                    </div>
                    <div>
                        <ul className='clearfix'>
                            <li style={{shift_top_list}} className='fl tc'>销售额<br/>￥123456.00</li>
                            <li style={shift_top_list} className='fr tc'>净收款<br/>￥123456.00</li>
                            <li style={shift_top_list} className='w tc'>销售订单<br/>￥123456.00</li>
                        </ul>
                    </div>
                </div>
            </div>
            <ul className='clearfix shift_bottom_list w' style={shift_counts}>
                <li><span>现金</span><br/><span>￥</span><span>9999.99</span></li>
                <li><span>微信</span><br/><span>￥</span><span>9999.99</span></li>
                <li><span>支付宝</span><br/><span>￥</span><span>9999.99</span></li>
                <li><span>银联</span><br/><span>￥</span><span>9999.99</span></li>
                <li><span>会员充值</span><br/><span>￥</span><span>9999.99</span></li>
                <li><span>会员消费</span><br/><span>￥</span><span>9999.99</span></li>
                <li><span>积分抵扣</span><br/><span>￥</span><span>9999.99</span></li>
                <li><span>退款</span><br/><span>￥</span><span>9999.99</span></li>
            </ul>
            <div className='clearfix' style={modelfooters}>
                <div className='fl tc' style={hrefshift_box}>取消</div>
                <div className='fl tc' style={hrefshift_boxs}>确定</div>
                <div style={dividingline}></div>
            </div>
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
            this.showModal('交班',true)
        }
        if(key==2){
       
        }
        if(key==3){
            this.showModal('修改密码',false)
        }
        if(key==4){
            this.context.router.push('/')
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
        const menu = (
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
        return (
            <div style={{height:'20px'}}>
                <Dropdown overlay={menu} className='dropdown'>
                    <span className="ant-dropdown-link" style={{color:'#fff',fontSize:'14px'}}>小强强 <Icon type="down" style={{color:'#fff'}}/></span>
                </Dropdown>
                <Modal
                    title={this.state.title}
                    visible={this.state.visible}
                    closable={false}
                    footer={null}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    className='dropdownmodal'
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

function Userinfo({data}) {
    return (
        <div style={{marginTop:'36px',marginRight:'30px'}} className='clearfix'>
            <div style={{color:'#fff',fontSize:'14px',height:'20px',lineHeight:'20px'}} className='fl'>苏州吴江邻里广场店</div>
            <div className='fl' style={{color:'#fff',margin:'-2px 10px 0',height:'20px'}}>|</div>
            <div className='fl' style={{marginTop:'-1px'}}><Dropdownmenu/></div>
        </div>
  )
}

export default Userinfo;