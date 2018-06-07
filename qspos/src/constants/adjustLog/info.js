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
            title: '成本价',
            dataIndex: 'averageRecPrice',
        },{
            title: '损益数量',
            dataIndex: 'adjustQty',
        },{
            title: '损益总价',
            dataIndex: 'adjustAmount',
        }];
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
            adjustId:this.props.query.id,
            limit:this.state.limit,
            currentPage:this.state.currentPage
        }
        const result=GetServerData('qerp.pos.pd.adjust.detail',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                const pdSpus=json.pdSpus
                this.setState({
                    dataSource:pdSpus,
                    limit:json.limit,
                    currentPage:json.currentPage,
                    total:json.total
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
                        商品损益信息
                    </div>
                    <div className="info-content">
                        <label>订单号:</label><span>{this.props.query.adjustNo}</span>
                        <label>创建人:</label><span>{this.props.query.operater}</span>
                        <label>损益时间:</label><span>{this.props.query.operateTime}</span>
                        <label>损益类型:</label><span>{this.props.query.typeStr}</span>
                        <label>损益备注:</label><span>{this.props.query.remark}</span>
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
                </div>
            </div>
        );
    }

    componentDidMount(){
        this.getSearchData()

    
    }
}



const Adjustloginfochil = Form.create()(ReceiptDetailsForm);

export default connect()(Adjustloginfochil);