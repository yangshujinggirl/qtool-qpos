import React from 'react';
import { Menu, Dropdown, Icon } from 'antd';


class Dropdownmenu extends React.Component {
  onClick=({ key })=>{
      console.log(key)
      if(key==4){
        this.context.router.push('/')
      }
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
    );
      return (
        <Dropdown overlay={menu} className='dropdown'>
          <span className="ant-dropdown-link" style={{color:'#fff',fontSize:'14px'}}>小强强 <Icon type="down" style={{color:'#fff'}}/></span>
        </Dropdown>
    )
  }
}
Dropdownmenu.contextTypes= {
    router: React.PropTypes.object
}


function Userinfo({data}) {
  return (
    <div style={{marginTop:'36px',marginRight:'30px'}}>
      <span style={{color:'#fff',fontSize:'14px'}}>苏州吴江邻里广场店  |  </span>
      <Dropdownmenu/>
    </div>
  );
}

export default Userinfo;