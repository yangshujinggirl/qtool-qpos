import React from 'react';
import Menu from './Menu';
import Userinfo from './Userinfo';

function Header({type,data,color}) {
  return (
    <div className={color?'header_bgcolor':'header_bgcolor_ano'}>
    	<div className='clearfix'>
      		<div style={{float:'left'}}><Menu type={type}/></div>
      		<div style={{float:'right'}}><Userinfo data={data}/></div>
      	</div>
    </div>
  );
}
export default Header;
