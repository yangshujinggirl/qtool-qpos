
import {LocalizedModal,Buttonico} from '../../../components/Button/Button';
import { Table, Input, Icon, Button, Popconfirm ,message,Modal,Form} from 'antd';

const FormItem = Form.Item;

const CollectionCreateForm = Form.create()((props) => {
	const { visible, onCancel, onCreate, form ,hindPress} = props;
	const { getFieldDecorator } = form;
	return (
		<Modal
			visible={visible}
			okText="Create"
			onCancel={onCancel}
			onOk={onCreate}
			footer={null}
			closable={false}
			width={430}
			className='popmodel discount-modal'>
			<Form layout="inline">
			<FormItem label="请输入折扣数">
				{getFieldDecorator('title', {
				rules: [{ required: true, message: '请输入最多一位小数的折扣数',pattern:/^([1-9][0-9]*)+(.[0-9]{1,1})?$/ }],
				})(
				<Input  autoComplete="off" style={{width:'200px'}} onKeyUp={hindPress}/>
				)}
			</FormItem>
			</Form>
		</Modal>
	);
});
class CollectionsPage extends React.Component {
	state = {
		visible: false,
	};
	showModal = () => {
		this.setState({ visible: true });
	}
	handleCancel = () => {
		this.setState({ visible: false },function(){
			const form = this.form;
			form.resetFields()
		});
	}
	handleCreate = () => {
		const form = this.form;
		form.resetFields()
		this.setState({ visible: false });
	}
	hindPress=(e)=>{
		if(e.keyCode==13){
			const form = this.form;
			form.validateFields((err, values) => {
				if (!err) {
					const values=e.target.value
					this.props.takezhepop(values)
					this.handleCreate()
				}
			});
		}
	}
	saveFormRef = (form) => {
		this.form = form;
	}
	render() {
		return (
			<div>
				<Button  onClick={this.showModal} className='widthmethfw'>整单折扣</Button>
				<CollectionCreateForm
					ref={this.saveFormRef}
					visible={this.state.visible}
					onCancel={this.handleCancel}
					onCreate={this.handleCreate}
					hindPress={this.hindPress}/>
			</div>
		)
	}
}
class Btncashier extends React.Component {
	rowonDelete=()=>{
		const rowonDelete=this.props.rowonDelete
		rowonDelete()
	}
	takeout=()=>{
		const takeout=this.props.takeout
		takeout()
	}
	takein=()=>{
		const takein=this.props.takein
		takein()
	}
	render() {
		return(
			<div className='clearfix' style={{padding:'0 30px'}}>
				<div className='btn fr ml20'><CollectionsPage takezhepop={this.props.takezhe}/></div>
				<div className='btn fr ml20' onClick={this.rowonDelete.bind(this)}><Buttonico text='移除商品F4' fw={true}/></div>
				<div className='btn fr ml20' onClick={this.takein.bind(this)}><Buttonico text='取单F3' fw={true}/></div>
				<div className='btn fr' onClick={this.takeout.bind(this)}><Buttonico text='挂单F2' fw={true}/></div>
			</div>
		)
	}
}

export default Btncashier;
