
import {LocalizedModal,Buttonico} from '../../../components/Button/Button';
import { Table, Input, Icon, Button, Popconfirm ,message,Modal,Form} from 'antd';

const FormItem = Form.Item;

const CollectionCreateForm = Form.create()((props) => {
	const { visible, onCancel, form ,hindPress} = props;
	const { getFieldDecorator } = form;
	return (
		<Modal
			visible={visible}
			okText="Create"
			onCancel={onCancel}
			onOk={onCancel}
			footer={null}
			closable={false}
			width={430}
			className='popmodel discount-modal'>
			<Form layout="inline">
			<FormItem label="请输入折扣数">
				{
					getFieldDecorator('title', {
						rules: [{
							required: true,
							message: '请输入最多一位小数的折扣数',
							pattern:/^([1-9][0-9]*)+(.[0-9]{1,1})?$/ }]
					})(
						<Input  autoComplete="off" style={{width:'200px'}} onKeyUp={hindPress}/>
					)
				}
			</FormItem>
			</Form>
		</Modal>
	);
});

class Btncashier extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
		};
	}
	showModal = () => {
		this.setState({ visible: true });
	}
	handleCancel = () => {
		const form = this.form;
		form.resetFields()
		this.setState({ visible: false });
	}
	//enter键
	hindPress=(e)=>{
		if(e.keyCode==13){
			const form = this.form;
			form.validateFields((err, values) => {
				if (!err) {
					const values=e.target.value
					this.props.takezhe(values)
					this.handleCreate()
				}
			});
		}
	}

	render() {
		const { rowonDelete, takeout, takein } = this.props;
		return(
			<div className='clearfix' style={{padding:'0 30px'}}>
				<div className='btn fr ml20'>
					<Button  onClick={this.showModal} className='widthmethfw'>整单折扣</Button>
				</div>
				<div className='btn fr ml20' onClick={rowonDelete.bind(this)}><Buttonico text='移除商品F4' fw={true}/></div>
				<div className='btn fr ml20' onClick={takein.bind(this)}><Buttonico text='取单F3' fw={true}/></div>
				<div className='btn fr' onClick={takeout.bind(this)}><Buttonico text='挂单F2' fw={true}/></div>
				<CollectionCreateForm
					ref={(form) => this.form = form}
					visible={this.state.visible}
					onCancel={this.handleCancel}
					hindPress={this.hindPress}/>
			</div>
		)
	}
}

export default Btncashier;
