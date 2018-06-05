import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Pagination,Tooltip} from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';
import {GetExportData} from '../../services/services';
import CommonTable from './commonTable';
import moment from 'moment';
import {GetServerData} from '../../services/services';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

const averageRecPricesd=<Tooltip placement="top" title='Q掌柜预订后仓库尚未发货的商品数量'>预定未发货数量&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;
const diffQtysd=<Tooltip placement="top" title='仓库（包含门店）已经发货本门店尚未收货的商品数量'>发货未收货数量&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;
const adjustAmount=<Tooltip placement="top" title='Q掌柜预订或者其他门店调拨本门店尚未收货的商品数量'>预订未收货数量&nbsp;<Icon type="exclamation-circle-o" /></Tooltip>;



//热销商品
class HotSellGoodsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource:[],
            total:0,
            currentPage:0,
            limit:10,
            startDate:"",
            endDate:"",
            searchvalue:{}
        };
        this.columns = [{
            title: '商品条码',
            dataIndex: 'barcode',
        },{
            title: '商品名称',
            dataIndex: 'name',
        },{
            title: '规格',
            dataIndex: 'displayName',
        },{
            title: averageRecPricesd,
            dataIndex: 'qty',
        },{
            title: diffQtysd,
            dataIndex: 'amount',
        },{
            title: adjustAmount,
            dataIndex: 'invQty',
        }];
    }

  

    //表格的方法
    pageChange=(page,pageSize)=>{
        this.setState({
            limit:pageSize,
            currentPage:Number(page)-1
        },function(){
            this.handleSubmit()
        })
    }
    onShowSizeChange=(current, pageSize)=>{
        this.setState({
            limit:pageSize,
            currentPage:Number(current)-1
        },function(){
            this.handleSubmit()
        })
    }

    //获取数据
    searchServerData = (values) =>{
        const result=GetServerData('qerp.pos.rp.pd.sell.list',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                let dataList = json.analysis;
                if(dataList.length){
                    for(let i=0;i<dataList.length;i++){
                        dataList[i].key = i+1;
                    }
                }
                this.setState({
                    searchvalue:values,
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
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            values.limit=this.state.limit
            values.currentPage=this.state.currentPage
            this.searchServerData(values);
        })
    }

    exportList = () =>{
        let data = this.state.searchvalue
        const result=GetExportData('qerp.qpos.rp.day.account.export',data);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="onroad">
                <div className="scroll-wrapper">
                    {/*搜索部分 */}
                    <Form className="search-form">
                        <FormItem>
                            {getFieldDecorator('name')(
                                <Input autoComplete="off" placeholder="请输入商品名称/条码"/>
                            )}
                        </FormItem>
                        <FormItem className='onroad_btn'>
                            <Button type="primary" icon="search" onClick={this.handleSubmit.bind(this)}>搜索</Button>
                        </FormItem>
                        <div className="export-div">
                        <   Button className="export-btn" onClick={this.exportList.bind(this)}>导出数据</Button>
                        </div>
                    </Form>
                    <div className="hotSell-wrapper add-norecord-img">
                        {
                            this.state.dataSource.length?
                            (
                                this.state.dataSource.length == 1? 
                                <div className="first-flag"></div>:
                                (
                                    this.state.dataSource.length == 2?
                                    <div>
                                        <div className="first-flag"></div>
                                        <div className="second-flag"></div>
                                    </div>
                                    :(
                                        <div>
                                            <div className="first-flag"></div>
                                            <div className="second-flag"></div>
                                            <div className="third-flag"></div>
                                        </div>
                                    )
                                )
                            )
                            :null
                        }
                        <CommonTable 
                            columns={this.columns} 
                            dataSource={this.state.dataSource}
                            pagination={false}
                            total={this.state.total}
                            current={this.state.currentPage}
                            pageSize={10}
                            onShowSizeChange={this.onShowSizeChange}
                            pageChange={this.pageChange}
                            locale={true}
                            />
                    </div>
                </div>
                {/* <div className="footer-pagefixed">
                    <Pagination 
                        total={this.state.total} 
                        current={this.state.currentPage+1}
                        pageSize={this.state.limit}
                        // showSizeChanger 
                        // onShowSizeChange={this.onShowSizeChange} 
                        onChange={this.pageChange} 
                        // pageSizeOptions={['10','12','15','17','20','50','100','200']}
                        />
                </div> */}
            </div>
        );
    }

    componentDidMount(){
        // this.handleSubmit();
    }
}

function mapStateToProps(state){
   return {};
}

const OnroadGoodsForm = Form.create()(HotSellGoodsForm);

export default connect(mapStateToProps)(OnroadGoodsForm);