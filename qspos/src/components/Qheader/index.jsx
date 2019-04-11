import React from 'react';
import { connect } from 'dva';
import MenuList from './MenuList';
import Userinfo from './Userinfo';
import './index.less';

class Header extends React.Component{
	componentDidMount() {
	  this.props.dispatch({
			type: 'header/fetch',
			payload: {
				code: 'qerp.pos.ur.user.info',
				values: { urUserId: null }
			}
	  })
	}
	render(){
		return(
			<div className={`common-hearders-components ${this.props.color?'':'returnWarn'}`}>
				<div className='header-components-wrap'>
					<div className='header-part-l'>
						<MenuList
							type={this.props.type}
							linkRoute={this.props.linkRoute}
							backinit={this.props.backinit}/>
					</div>
					{
						this.props.title&&
						<div className='head-screen'>{this.props.title}</div>
					}
					<div className='header-part-r'>
						<Userinfo/>
					</div>
				</div>
			</div>
		)
	}
}
function mapStateToProps(state) {
    return {};
}
export default connect(mapStateToProps)(Header);
