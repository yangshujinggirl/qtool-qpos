import { connect } from 'dva';

class Operationr extends React.Component {
	hindclick=()=>{
		this.props.meth1.initModel()
	}
	render() {
		const color=this.props.color
		return(   
            <div className={color?'operationcon':'operationconbg'}>
                <div className='fl list1' onClick={this.hindclick.bind(this)}>
                    <div className='con1'>结算</div>
                    <div className='con2'>「空格键」</div>
                </div>
                <div className='fl list2'>
                    <div className='con1'>数量</div>
                    <div className='con2'>{this.props.totolnumber}</div>
                </div>
                <div className='fl list3'>
                    <div className='con1'>金额</div>
                    <div className='con2'>{this.props.totolamount}</div>
                </div>
            </div>
		)
	}
}


function mapStateToProps(state) {
	const {totolnumber,totolamount,meth1} = state.cashier;
	return {totolnumber,totolamount,meth1};
}

export default connect(mapStateToProps)(Operationr);