import React from 'react';
import Menu from './Menu';
import Userinfo from './Userinfo';

const header_bgcolor={
	background: '#35BAB0',
	width: '100%',
	height: '93px',
	marginBottom:'20px'
}
const header_bgcolor_ano={
	background:'#FC4F4F',
	width: '100%',
	height: '93px',
	marginBottom:'20px'
}
function Header({type,data,color}) {
  return (
    <div style={color?header_bgcolor:header_bgcolor_ano}>
    	<div className='clearfix'>
      		<div className='fl'><Menu type={type}/></div>
      		<div className='fr'><Userinfo data={data}/></div>
      	</div>
    </div>
  )
}
export default Header;
