import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip,Pagination} from 'antd';
import { Link } from 'dva/router';
import {GetServerData} from '../../services/services';
import CommonTable from '../dataManage/commonTable';
import {deepcCloneObj} from '../../utils/commonFc';
import Header from '../../components/header/Header';
import './inventorydiff.css'

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
            operateST:null,
            operateET:null,
            keywords:'',
            windowHeight:'',
            posOrder:{
                "orderNo": "",
                "qtySum": "",
                "receiveQty": "",
                "statusStr": "",
            }
        };
        this.columns = [{
            title: '商品条码',
            dataIndex: 'pdBarcode',
        },{
            title: '商品名称',
            dataIndex: 'pdSpuName',
        },{
            title: '商品规格',
            dataIndex: 'pdSkuType',
        },{
            title: '成本价',
            dataIndex: 'price',
        },{
            title: '预收数量',
            dataIndex: 'qty',
        },{
            title: '已收数量',
            dataIndex: 'receiveQty',
        },{
            title: '差异',
            dataIndex: 'differenceQty',
        },{
            title: '最后收货人',
            dataIndex: 'consignee',
        },{
            title: '最后操作时间',
            dataIndex: 'operateTime'
        }];
        this.columns1=[{
            title: '操作记录',
            dataIndex: 'pdBarcode',
        },{
            title: '操作人',
            dataIndex: 'pdSpuName',
        },{
            title: '操作时间',
            dataIndex: 'pdSkuType',
        }]
    }



    dateChange = (date, dateString) =>{
        this.setState({
            operateST:dateString[0],
            operateET:dateString[1]
        })
    }

    //表格的方法
    pageChange=(page,pageSize)=>{
        console.log(page)
        console.log(pageSize)
        this.setState({
            limit:pageSize,
            pageSize:pageSize,
            currentPage:Number(page)-1
        },function(){
            let values = {
                pdOrderId:this.props.detailId,
                keywords:this.state.keywords,
                operateST:this.state.operateST,
                operateET:this.state.operateET,
                limit:this.state.limit,
                currentPage:this.state.currentPage
            }
            this.getServerData(values)
        });
    }
    onShowSizeChange=(current, pageSize)=>{
        this.setState({
            limit:pageSize,
            currentPage:Number(current)-1
        },function(){
            let values = {
                pdOrderId:this.props.detailId,
                keywords:this.state.keywords,
                operateST:this.state.operateST,
                keywords:this.state.keywords,
                operateET:this.state.operateET,
                limit:this.state.limit,
                currentPage:this.state.currentPage
            }
            this.getServerData(values)
        })
    }

    //获取数据
    getServerData = (values) =>{
        const result=GetServerData('qerp.qpos.order.receiveRepDetail',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                let dataList = json.details;
                for(let i=0;i<dataList.length;i++){
                    dataList[i].key = i+1;
                    if(!dataList[i].operateTime){
                        dataList[i].operateTime="/";
                    };
                    if(!dataList[i].consignee){
                        dataList[i].consignee="/";
                    };
                }
                this.setState({
                    dataSource:dataList,
                    total:Number(json.total),
                    currentPage:Number(json.currentPage),
                    limit:Number(json.limit)
                });
            }else{  
                message.error(json.message); 
            }
        })
    }

    handleSubmit = (e) =>{
        const self = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            this.setState({
                keywords:values.keywords
            },function(){
                let values = {
                    pdOrderId:this.props.detailId,
                    keywords:this.state.keywords,
                    currentPage:0,
                    limit:10,
                    startDate:this.state.startDate,
                    operateST:this.state.operateST,
                    operateET:this.state.operateET,


                    
                }
                self.getServerData(values);
            })
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
            <Header type={false} color={true} linkRoute="goods"/>
            <div className='counters'>
            <div className="ph-info">
                <div className="scroll-wrapper receipetDetailWrapper">
                    <div className="info-title">
                        商品盘点信息
                    </div>
                    <div className="info-content">
                        <label>订单号:</label><span>{1}</span>
                        {/* <label>创建人:</label><span>{this.props.headerInfo.qtySum}</span>
                        <label>损益时间:</label><span>{this.props.headerInfo.receiveQty}</span>
                        <label>订单状态:</label><span>{this.props.headerInfo.statusStr}</span> */}
                    </div>
                    <div className="info-title">
                        商品信息
                    </div>
                    {/*搜索部分 */}
                    <CommonTable 
                        columns={this.columns} 
                        dataSource={this.state.dataSource}
                        pagination={false}
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
                    <CommonTable 
                        columns={this.columns1} 
                        dataSource={this.state.dataSource}
                        pagination={false}
                        current={Number(this.state.currentPage)}
                        total={this.state.total}
                        currentPage={this.state.currentPage}
                        pageSize={this.state.limit}
                        onShowSizeChange={this.onShowSizeChange}
                        pageChange={this.pageChange}
                        />
                    
                </div>



                {/* <div className="footer-pagefixed">
                    <Pagination 
                        total={this.state.total} 
                        current={Number(this.state.currentPage)+1}
                        pageSize={this.state.limit}
                        showSizeChanger 
                        onShowSizeChange={this.onShowSizeChange} 
                        onChange={this.pageChange} 
                        pageSizeOptions={['10','12','15','17','20','50','100','200']}
                        />
                </div> */}
            </div>
            </div>
            </div>
        );
    }

    componentDidMount(){
        // if(this.props.detailId){
        //     let values = {
        //         pdOrderId:this.props.detailId,
        //         keywords:this.state.keywords,
        //         operateST:this.state.operateST,
        //         operateET:this.state.operateET,
        //         limit:10,
        //         currentPage:0
        //     }
        //     this.getServerData(values);
        // }
        // //添加
        // this.props.dispatch({
        //     type:'dataManage/initKey',
        //     payload: "4"
        // })
    }
}



const Inventoryloginfo = Form.create()(ReceiptDetailsForm);

export default connect()(Inventoryloginfo);