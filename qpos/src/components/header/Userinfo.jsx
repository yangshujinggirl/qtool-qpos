import React from 'react';
import { Menu, Dropdown, Icon } from 'antd';

const menu = (
  <Menu style={{textAlign:'center'}}>
    <Menu.Item>
      <span className='menuitem'>交班</span>
    </Menu.Item>
    <Menu.Item>
      <span className='menuitem'>帮助</span>
    </Menu.Item>
    <Menu.Item>
      <span className='menuitem'>修改密码</span>
    </Menu.Item>
    <Menu.Item>
      <span className='menuitem'>退出登录</span>
    </Menu.Item>
  </Menu>
);

class Dropdownmenu extends React.Component {
  render() {
      return (
        <Dropdown overlay={menu} className='dropdown'>
          <span className="ant-dropdown-link" style={{color:'#fff',fontSize:'14px'}}>小强强 <Icon type="down" style={{color:'#fff'}}/></span>
        </Dropdown>
    )
  }
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