import { connect } from 'dva';
import { message} from 'antd';
import {GetServerData} from '../../services/services';

class Operationr extends React.Component {
	hindclick=()=>{
        if(Number(this.props.totolnumber)>0 && parseFloat(this.props.totolamount)>0){
            const result=GetServerData('qerp.pos.sy.config.info')
            result.then((res) => {
                return res;
                }).then((json) => {
                if(json.code == "0"){
                    if(json.config.submitPrint=='1'){
                        this.props.dispatch({
                            type:'cashier/changeCheckPrint',
                            payload:true
                        })
                    }else{
                        this.props.dispatch({
                            type:'cashier/changeCheckPrint',
                            payload:false
                        })
                    }
                }
            })
            this.props.meth1.initModel()
        }else{
            message.error('数量为0，不能结算')
            return
           
        }
		
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