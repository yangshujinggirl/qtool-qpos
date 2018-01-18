import React from 'react';
import {Input} from 'antd';

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
        		<Input placeholder={this.props.text} className='fl f14 searchinput' style={{marginRight:'5px'}} onChange={this.hindchange.bind(this)} value={this.state.values} />
        		<div className='fl tc f14 fff point searchinputbtn' onClick={this.hindsearch.bind(this)}>搜索</div>
    		</div>
        )
    }
}
export default Searchinput;