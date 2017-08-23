import React from 'react';
import {Input} from 'antd';

function Searchinput({text}) {
  return (
    <div className='clarfix'>
        <Input placeholder={text} style={{width:'300px',height:'40px',color:'#B4B4B4',borderRadius:'3px 0 0 3px'}} className='fl f14'/>
        <div className='fl tc f14 fff' style={{width:'87px',height:'40px',background: '#35BAB0',lineHeight:'40px',borderRadius:'0 3px 3px 0'}}>搜索</div>
    </div>
  );
}

export default Searchinput;
