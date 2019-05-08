import React from 'react';
import { Link } from 'dva/router'
import { connect } from 'dva';

const menusAdamin = [
        { icon: 'member', title: '会员管理', router: '/member' },
        { icon: 'delivery', title: '收货管理', router: '/receivegoods' },
        { icon: 'goods', title: '商品管理', router: '/goods' },
        { icon: 'sell', title: '订单管理', router: '/sell' },
        { icon: 'activity', title: '活动管理', router: '/activityManage' },
        { icon: 'dataManage', title: '数据管理', router: '/dataManage' },
        { icon: 'setting', title: '账号设置', router: '/account' }]
const menus = [
        { icon: 'member', title: '会员管理', router: '/member' },
        { icon: 'delivery', title: '收货管理', router: '/receivegoods' },
        { icon: 'goods', title: '商品管理', router: '/goods' },
        { icon: 'sell', title: '订单管理', router: '/sell' },
        { icon: 'sell', title: '活动管理', router: '/activityManage' },
        { icon: 'dataManage', title: '数据管理', router: '/dataManage' }]

function MenuSell({ urUser }) {
  const dataSource = urUser.role === '1' ? menusAdamin : menus;
  return (
    <div className="menu-content">
      <div className="logo-pic">
        <img src={require('../../images/logo.png')} />
      </div>
      <ul className="nav-list clearfix">
        {
          dataSource.map((item, index) => (
            <li key={index} className={`item-nav`}>
              <Link to={item.router}>
                <div className={`nav-icon nav-icon-${item.icon}`} />
                <p className="nav-title">{item.title}</p>
              </Link>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
function MenuReturn({ linkRoute, backinit }) {
  const linkUrl = !linkRoute ? { pathname: '/cashier', query: { backinit } } : `/${linkRoute}`;
  return (
    <Link to={linkUrl} className="return-header-part-l">
      <img src={require('../../images/icon_back.png')} />
    </Link>
  )
}
function Menu({ type, urUser, linkRoute, backinit }) {
  if (type) {
    return <MenuSell urUser={urUser} />
  } else {
    return <MenuReturn linkRoute={linkRoute} backinit={backinit} />
  }
}

function mapStateToProps(state) {
  const { urUser } = state.header;
  return { urUser };
}

export default connect(mapStateToProps)(Menu);
