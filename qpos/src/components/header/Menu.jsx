import React from 'react';
import { Link } from 'dva/router'

//css
const menuiconcount={
    width: '84px',
    height: '34px',
    marginLeft: '30px',
    marginTop: '30px'
}

const menus=[ 
                {icon:'icon_member.png',title:'会员管理',router:'/member'},
                {icon:'icon_delivery.png',title:'收货管理',router:'/receivegoods'},
                {icon:'icon_goods.png',title:'商品管理',router:'/goods'},
                {icon:'icon_sell.png',title:'销售管理',router:'/sell'},
                {icon:'icon_setting.png',title:'账号设置',router:'/account'}
            ]
function Menuuse() {
    return (
        <div className='clearfix'>
            <div style={{float:'left',width:'256px',height:'93px'}}><div style={{width:'184px',height:'30px',margin:'0 auto',marginTop:'30px'}}><img src={require('../../images/logo.png')} style={{width:'100%',height:'100%'}}/></div></div>
            <ul className='clearfix fl'>
                {
                    menus.map((item,index)=>{
                        return (
                            <li key={index} className={'menu_list'+index}>
                                <Link to={item.router}>
                                    <div className='menu_list'></div><p className='menu_list_p'>{item.title}</p>
                                </Link>
                            </li>
                        )
                    })
                }       
            </ul>
        </div>
    )
}
function Menuicon() {
    return (
        <div className='menuicon'>
            <div style={menuiconcount}><Link to='/cashier'><img src={require('../../images/icon_back.png')} className='w100 h100'/></Link></div>
        </div>
  )
}
function Menu({type}) {
    return (
        <div>
            {
                type
                ?<Menuuse/>
                :<Menuicon/>
            }
        </div>
  )
}  
export default Menu;
