import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import Searchinput from '../components/Searchinput/Searchinput';
import {Buttonico} from '../components/Button/Button';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message} from 'antd';
import { Link } from 'dva/router';
import '../style/dataManage.css';

//每日对账单
import DailyBill from '../constants/dataManage/dailyBill';
//热销商品
import HotSellGoods from '../constants/dataManage/hotSellGoods';
//店员销售
import ClerkSale from '../constants/dataManage/clerkSale';
//收货报表
import ReceiptReport from '../constants/dataManage/receiptReport';
//利润报表
import ProfitReport from '../constants/dataManage/profitReport';
//进销存报表
import InoutReport from '../constants/dataManage/inoutReport';

const TabPane = Tabs.TabPane;

class DataManage extends React.Component {
    state={
        key:"1"
    };

    tabChange = (index)=>{
        this.setState({
            key:index
        })
        this.props.dispatch({
            type:'dataManage/initKey',
            payload: "1"
        })
    }

    render() {
        const role = sessionStorage.getItem('role');
        return (
            <div>
                <Header type={false} color={true}/>
                <div className='counters data-manage'>
                {
                    role != 3
                    ?
                    <Tabs type="card" tabBarStyle={{height:'54px'}} 
                            defaultActiveKey={this.props.initKey=="4"?"4":"1"}
                            onTabClick={this.tabChange.bind(this)}>
                        <TabPane tab="每日对账单" key="1">
                           {this.state.key == 1 && <DailyBill/>} 
                        </TabPane>
                        <TabPane tab="热销商品" key="2">
                            {this.state.key == 2 && <HotSellGoods/>} 
                        </TabPane>
                        <TabPane tab="店员销售" key="3">
                            {this.state.key == 3 && <ClerkSale/>} 
                        </TabPane>
                        <TabPane tab="收货报表" key="4">
                            {this.state.key == 4 && <ReceiptReport/>} 
                        </TabPane>
                        <TabPane tab="利润报表" key="5">
                            {this.state.key == 5 && <ProfitReport/>} 
                        </TabPane>
                        {/* <TabPane tab="进销存报表" key="6">
                            {this.state.key == 6 && <InoutReport/>} 
                        </TabPane> */}
                    </Tabs>
                    :
                    <Tabs type="card" tabBarStyle={{height:'54px'}} 
                            defaultActiveKey={this.props.initKey=="4"?"4":"1"}
                            onTabClick={this.tabChange.bind(this)}>
                        <TabPane tab="每日对账单" key="1">
                           {this.state.key == 1 && <DailyBill/>} 
                        </TabPane>
                        <TabPane tab="热销商品" key="2">
                            {this.state.key == 2 && <HotSellGoods/>} 
                        </TabPane>
                        <TabPane tab="店员销售" key="3">
                            {this.state.key == 3 && <ClerkSale/>} 
                        </TabPane>
                    </Tabs>
                }
                
                </div>
            </div>
        );
    }

    componentDidMount(){
        if(this.props.initKey == "4"){
            this.setState({
                key:"4"
            })
        }else{
            this.setState({
                key:"1"
            })
        }
    }
}

function mapStateToProps(state){
    const {initKey} = state.dataManage;
    return {initKey};
}

export default connect(mapStateToProps)(DataManage);