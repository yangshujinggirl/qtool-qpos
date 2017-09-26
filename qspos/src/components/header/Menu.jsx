import React from 'react';
import { Link } from 'dva/router'


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
            <div className='fl headermenuuselogo'><div className='mt30 w headermenuuselogobox'><img src={require('../../images/logo.png')} className='w100 h100'/></div></div>
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
            <div className='ml30 mt30 headermenuiconcount'><Link to='/cashier'><img src={require('../../images/icon_back.png')} className='w100 h100'/></Link></div>
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
