import React from 'react';
import Menu from './Menu';
import Userinfo from './Userinfo';
import { connect } from 'dva';

class Header extends React.Component{
	render(){
		return(
				<div className={this.props.color?'headers':'headersno'}>
    				<div className='clearfix'>
      					<div className='fl'><Menu type={this.props.type}/></div>
      					<div className='fr'><Userinfo/></div>
      				</div>
    			</div>
			)
	}
	componentDidMount(){
        this.props.dispatch({
            type: 'header/fetch', 
            payload: {code:'qerp.pos.ur.user.info',values:{urUserId:null}}
        })
    }
}
function mapStateToProps(state) {
    return {};
}
export default connect(mapStateToProps)(Header);



