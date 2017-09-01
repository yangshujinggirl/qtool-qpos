import React from 'react';
import {Input} from 'antd';

class Searchinput extends React.Component {
	state={
		values:''
	}
	hindchange=(e)=>{
		console.log(e)
		this.setState({
			values:e.target.value
		},function(){
			const revisemessage=this.props.revisemessage
			revisemessage(this.state.values)
		})
	}
	hindsearch=()=>{
		this.props.hindsearch()
	}
    render(){
        return(
           <div className='clearfix'>
        		<Input placeholder={this.props.text} style={{width:'300px',height:'40px',color:'#B4B4B4',borderRadius:'3px 0 0 3px'}} className='fl f14' onChange={this.hindchange.bind(this)} value={this.state.values} />
        		<div className='fl tc f14 fff' style={{width:'87px',height:'40px',background: '#35BAB0',lineHeight:'40px',borderRadius:'0 3px 3px 0'}} onClick={this.hindsearch.bind(this)}>搜索</div>
    		</div>
        )
    }
}
export default Searchinput;