import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip,Pagination} from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';
import {GetServerData} from '../../services/services';
import CommonTable from '../dataManage/commonTable';
import {deepcCloneObj} from '../../utils/commonFc';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

class ReceiptDetailsForm extends React.Component {
    constructor(props,context) {
        super(props,context);
        this.state={
            dataSource:[],
            total:0,
            currentPage:0,
            limit:10,
            logdataSource:[]
        };
        this.columns = [{
            title: '商品条码',
            dataIndex: 'barcode',
        },{
            title: '商品名称',
            dataIndex: 'name',
        },{
            title: '商品规格',
            dataIndex: 'displayName',
        },{
            title: '系统数量',
            dataIndex: 'invQty',
        },{
            title: '盘点数量',
            dataIndex: 'checkQty',
        },{
            title: '盘点差异',
            dataIndex: 'diffQty',
        }];
        this.columns1=[{
            title: '操作记录',
            dataIndex: 'action',
        },{
            title: '操作人',
            dataIndex: 'operater',
        },{
            title: '操作时间',
            dataIndex: 'operateTime',
        }]
    }
    //表格的方法
    pageChange=(page,pageSize)=>{
        this.setState({
            limit:pageSize,
            currentPage:Number(page)-1
        },function(){
            this.getSearchData()
        });
    }
    onShowSizeChange=(current, pageSize)=>{
        this.setState({
            limit:pageSize,
            currentPage:Number(current)-1
        },function(){
            this.getSearchData()
        })
    }

    //获取数据
    getSearchData = () =>{
        const values={
            checkId:this.props.query.id,
            limit:this.state.limit,
            currentPage:this.state.currentPage
        }
        const result=GetServerData('qerp.pos.pd.check.detail.query',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                const checkdetails=json.checkdetails
                this.setState({
                    dataSource:checkdetails,
                    limit:json.limit,
                    currentPage:json.currentPage,
                    total:json.total
                })
            }else{  
                message.error(json.message); 
            }
        })
    }

    //订单日志查询
    checkRecord=()=>{
        const values={
            checkNo:this.props.query.checkNo
        }
        const result=GetServerData('qerp.pos.pd.check.record.query',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                const checkRecords=json.checkRecords
                this.setState({
                    logdataSource:checkRecords
                })
            }else{  
                message.error(json.message); 
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="ph-info">
                <div className="scroll-wrapper receipetDetailWrapper">
                    <div className="info-title">
                        商品盘点信息
                    </div>
                    <div className="info-content">
                        <label>订单号:</label><span>{this.props.query.checkNo}</span>
                        <label>盘点SKU数量:</label><span>{this.props.query.skuSum}</span>
                        <label>盘点商品数量:</label><span>{this.props.query.qty}</span>
                        <label>创建人:</label><span>{this.props.query.operater}</span>
                        <label>创建时间:</label><span>{this.props.query.operateTime}</span>
                    </div>
                    <div className="info-title">
                        商品信息
                    </div>
                    {/*搜索部分 */}
                    <CommonTable 
                        columns={this.columns} 
                        dataSource={this.state.dataSource}
                        pagination={true}
                        current={Number(this.state.currentPage)}
                        total={this.state.total}
                        currentPage={this.state.currentPage}
                        pageSize={this.state.limit}
                        onShowSizeChange={this.onShowSizeChange}
                        pageChange={this.pageChange}
                    />
                    <div className="info-title">
                        订单日志
                    </div>
                    {/*搜索部分 */}
                    <CommonTable 
                        columns={this.columns1} 
                        dataSource={this.state.logdataSource}
                        pagination={false}
                    />
                </div>
            </div>
        );
    }

    componentDidMount(){
        this.getSearchData()
        this.checkRecord()
    }
}



const Inventoryloginfos = Form.create()(ReceiptDetailsForm);

export default connect()(Inventoryloginfos);

