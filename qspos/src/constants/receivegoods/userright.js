
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Switch,Modal} from 'antd';

class Operationr extends React.Component {
	render() {
		const color=this.props.color
		const type=this.props.type
		return(
    		<div className={color?'operationcon':'operationconbg'}>
      			<div className='fl list1' onClick={this.props.payok.bind(this)}>
      				<div className='con1'>收货</div>
      				<div className='con2'>「空格键」</div>
      			</div>
      			<div className='fl list2'>
      				<div className='con1'>商品</div>
      				<div className='con2'>{this.props.datasoucelen}</div>
      			</div>
      			<div className='fl list3'>
      				<div className='con1'>数量</div>
      				<div className='con2'>{this.props.totolsamount}</div>
      			</div>
    		</div>
		)
	}
}

function mapStateToProps(state) {
	const {datasoucelen,totolsamount} = state.receivegoods;
   return {datasoucelen,totolsamount};
}

export default connect(mapStateToProps)(Operationr);
