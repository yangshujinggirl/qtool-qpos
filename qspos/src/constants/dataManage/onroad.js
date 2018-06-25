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
            searchvalue:{},
            windowHeight:''
        };
        this.columns = [{
            title: '商品条码',
            dataIndex: 'goodCode',
        },{
            title: '商品名称',
            dataIndex: 'goodName',
        },{
            title: '规格',
            dataIndex: 'displayName',
        },{
            title: averageRecPricesd,
            dataIndex: 'waitDeliveryQty',
        },{
            title: diffQtysd,
            dataIndex: 'receivingQty',
        },{
            title: adjustAmount,
            dataIndex: 'waitReceiveQty',
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
        const result=GetServerData('qerp.qpos.pd.unreceived.query',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                let dataList = json.goods;
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
        // e.preventDefault();
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
    windowResize = () =>{
        if(!this.refs.tableWrapper){
            return
        }else{
            if(document.body.offsetWidth>800){
                this.setState({
                    windowHeight:document.body.offsetHeight-300,
                })
            }else{
                this.setState({
                windowHeight:document.body.offsetHeight-270,
            });
            }
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="onroad">
                <div className="scroll-wrapper">
                    {/*搜索部分 */}
                    <Form className="search-form">
                        <FormItem>
                            {getFieldDecorator('nameOrCode')(
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
                        <CommonTable
                            columns={this.columns} 
                            dataSource={this.state.dataSource}
                            pagination={false}
                            total={this.state.total}
                            current={this.state.currentPage}
                            // pageSize={10}
                            // onShowSizeChange={this.onShowSizeChange}
                            // pageChange={this.pageChange}
                            locale={true}
                            scroll={{y:this.state.windowHeight}}
                            scrolly={this.state.windowHeight}
                            />
                    </div>
                </div>
                <div className="footer-pagefixed">
                    <Pagination 
                        total={this.state.total}
                        current={this.state.currentPage+1}
                        pageSize={this.state.limit}
                        showSizeChanger 
                        onShowSizeChange={this.onShowSizeChange} 
                        onChange={this.pageChange} 
                         pageSizeOptions={['10','12','15','17','20','50','100','200']}
                        />
                </div>
            </div>
        );
    }

    componentDidMount(){
        this._isMounted = true;
        if(this._isMounted){
            if(document.body.offsetWidth>800){
                this.setState({
                   windowHeight:document.body.offsetHeight-300,
                 });
            }else{
                this.setState({
                    windowHeight:document.body.offsetHeight-270,
                });
            }
            window.addEventListener('resize',this.windowResize.bind(this));
        }
        this.handleSubmit();
    }
    componentWillUnmount(){
        this._isMounted = false;
        window.removeEventListener('resize', this.windowResize.bind(this));
    }
}

function mapStateToProps(state){
   return {};
}

const OnroadGoodsForm = Form.create()(HotSellGoodsForm);

export default connect(mapStateToProps)(OnroadGoodsForm);