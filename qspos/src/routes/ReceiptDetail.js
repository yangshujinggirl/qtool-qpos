import React,{Component} from 'react';
import { connect } from 'dva';
import Header from '../components/Qheader';
import { Link } from 'dva/router'
import ReceiptDetails from '../constants/dataManage/receiptDetails';
import '../style/dataManage.css';

class ReceiptDetail extends React.Component{
   render(){
        return (
            <div>
                <Header type={false} color={true} linkRoute="dataManage"/>
                <div className='counters'>
                    <div className="receipt-details">
                        <ReceiptDetails/>
                    </div>
                </div>
            </div>
        )
   }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(ReceiptDetail);
