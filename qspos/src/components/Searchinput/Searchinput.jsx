import React from 'react';
import {Input,Icon} from 'antd';

class Searchinput extends React.Component {
	state={
		value:''
	}
	hindchange=(e)=>{
		let value = e.target.value;
		this.setState({
			value
		},()=>{
			this.props.revisemessage(value)
		})
	}
	hindsearch=()=>{
		this.props.hindsearch()
	}
    render(){
        return(
           <div className='clearfix'>
        		<Input
							autoComplete="off"
							placeholder={this.props.text}
							className='fl f14 searchinput'
							onChange={this.hindchange.bind(this)}
							value={this.state.value} />
        		<div
							className='fl tc f14 fff point searchinputbtn'
							onClick={this.hindsearch.bind(this)}>搜索</div>
    		</div>
        )
    }
}
export default Searchinput;
