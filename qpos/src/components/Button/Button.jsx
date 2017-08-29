import React from 'react';

const widthmeth={
	width:'100px',
	height:'40px',
	background:'#FFF',
	border: '1px solid #E7E8EC',
	borderRadius: '3px',
	color: '#35BAB0',
	fontSize: '14px',
	textAlign:'center',
	lineHeight:'40px',
    cursor: 'pointer'
}

//button
export function Buttonico({text}) {
    return (
        <div style={widthmeth}>
            {text}
        </div>
  );
}

