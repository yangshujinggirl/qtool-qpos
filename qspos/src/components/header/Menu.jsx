import React from 'react';
import { Link } from 'dva/router'
import { connect } from 'dva';

const menus=[ 
                {icon:'icon_member.png',title:'会员管理',router:'/member'},
                {icon:'icon_delivery.png',title:'收货管理',router:'/receivegoods'},
                {icon:'icon_goods.png',title:'商品管理',router:'/goods'},
                {icon:'icon_sell.png',title:'销售管理',router:'/sell'},
                {icon:'icon_ dataManage.png',title:'数据管理',router:'/dataManage'},
                {icon:'icon_setting.png',title:'账号设置',router:'/account'}
            ]
const menuss=[ 
                {icon:'icon_member.png',title:'会员管理',router:'/member'},
                {icon:'icon_delivery.png',title:'收货管理',router:'/receivegoods'},
                {icon:'icon_goods.png',title:'商品管理',router:'/goods'},
                {icon:'icon_sell.png',title:'销售管理',router:'/sell'},
                {icon:'icon_ dataManage.png',title:'数据管理',router:'/dataManage'}
            ]


function Menuuse({urUser}) {
    return (
        <div className='clearfix'>
            <div className='fl headermenuuselogo'><div className='w headermenuuselogobox'><img src={require('../../images/logo.png')} className='w100 h100'/></div></div>
            <ul className='clearfix fl'>
                {
                    urUser.role==1
                    ?
                    menus.map((item,index)=>{
                        return (
                            <li key={index} className={'menu_list'+index}>
                                <Link to={item.router}>
                                    <div className='menu_list'></div><p className='menu_list_p'>{item.title}</p>
                                </Link>
                            </li>
                        )
                    })
                    :
                    menuss.map((item,index)=>{
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
function Menuicon({linkRoute,backinit}) {
    return (
        <div className='menuicon'>
            {/* <div className='ml30 mt30 headermenuiconcount'><Link to={!linkRoute?'/cashier':'/'+linkRoute}><img src={require('../../images/icon_back.png')} className='w100 h100'/></Link></div> */}
            <div className='ml30 mt30 headermenuiconcount'><Link to={!linkRoute?{pathname:'/cashier',query:{backinit:backinit}}:'/'+linkRoute}><img src={require('../../images/icon_back.png')} className='w100 h100'/></Link></div>
        </div>
  )
}
function Menu({type,urUser,linkRoute,backinit}) {
    return (
        <div>
            {
                type
                ?<Menuuse urUser={urUser}/>
                :<Menuicon linkRoute={linkRoute} backinit={backinit}/>
            }
        </div>
  )
}  

function mapStateToProps(state) {
    const {urUser} = state.header;
    // sessionStorage.setItem('nickname',urUser.nickname);
    // sessionStorage.setItem('urUserId',urUser.urUserId);
    // sessionStorage.setItem('username',urUser.username);
    // sessionStorage.setItem('spShop',urUser.shop.name);
    // sessionStorage.setItem('spShopId',urUser.shop.spShopId);
    // sessionStorage.setItem('role',urUser.role);
    // sessionStorage.setItem('status',urUser.status);
    return {urUser};
}

export default connect(mapStateToProps)(Menu);

