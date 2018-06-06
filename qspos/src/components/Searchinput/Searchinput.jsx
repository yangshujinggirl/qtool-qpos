import React from 'react';
import {Input,Icon} from 'antd';

class Searchinput extends React.Component {
	state={
		values:''
	}
	hindchange=(e)=>{
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
        		<Input  autoComplete="off" placeholder={this.props.text} className='fl f14 searchinput'  onChange={this.hindchange.bind(this)} value={this.state.values} />
        		<div className='fl tc f14 fff point searchinputbtn' onClick={this.hindsearch.bind(this)}><Icon type="search"/><span style={{marginLeft:'5px'}}>搜索</span></div>
    		</div>
        )
    }
}
export default Searchinput;