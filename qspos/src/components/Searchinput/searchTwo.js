import React from 'react';
import {Input,Button} from 'antd';

class SearchinputTwo extends React.Component {
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

	exportData = ()=>{
		this.props.exportData();
	}

    render(){
        return(
           <div className='clearfix'>
        		<Input autoComplete="off" placeholder={this.props.text} className='fl f14 searchinput mr10 goodindex-input' onChange={this.hindchange.bind(this)} value={this.state.values} />
        		<Button type="primary" className='fl tc f14 fff point searchinputbtn  goodindex-searchinputbtn' onClick={this.hindsearch.bind(this)}>搜索</Button>
				<Button type="primary" className="exportBtn f14" onClick={this.exportData.bind(this)}>导出数据</Button>
    		</div>
        )
    }
}
export default SearchinputTwo;