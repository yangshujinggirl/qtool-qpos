import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip} from 'antd';
import { Link } from 'dva/router';
import CommonTable from '../../constants/dataManage/commonTable';
import {GetServerData} from '../../services/services';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

class InventorydiffLogIndexForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource:[],
            total:0,
            currentPage:0,
            limit:10,
            adjustTimeStart:"",
            adjustTimeEnd:"",
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
            title: '成本价',
            dataIndex: 'averageRecPrice',
        },{
            title: '损益数量',
            dataIndex: 'qty',
        },{
            title: '损益金额',
            dataIndex: 'adjustAmount',
        },{
            title: '操作人',
            dataIndex: 'operater',
        },{
            title: '操作时间',
            dataIndex: 'operateTime',
        }];
    }

    dateChange = (date, dateString) =>{
        console.log(date, dateString);
        this.setState({
            adjustTimeStart:dateString[0],
            adjustTimeEnd:dateString[1]
        })
    }

    //表格的方法
    pageChange=(page,pageSize)=>{
        this.setState({
            currentPage:page-1
        });
    }
    onShowSizeChange=(current, pageSize)=>{
        this.setState({
            limit:pageSize,
            currentPage:current-1
        })
    }

    handleSearch = (e) =>{
        const self = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.setState({
                name:values.name
            },function(){
                let data = {
                    currentPage:0,
                    limit:10,
                    adjustTimeStart:this.state.adjustTimeStart,
                    adjustTimeEnd:this.state.adjustTimeEnd,
                    name:this.state.name,
                    type:2
                }
                self.getServerData(data);
            })
        })
    }

    //导出数据
    exportList = () =>{
        let data = {
            currentPage:0,
            limit:10,
            adjustTimeStart:this.state.adjustTimeStart,
            adjustTimeEnd:this.state.adjustTimeEnd,
            name:this.state.name,
            type:2
        }
        const result=GetServerData('qerp.pos.pd.adjust.export',data);
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){

            }else{  
                message.error(json.message); 
            }
        })
    }

    //改变visible
    changeVisible = () =>{
        this.setState({
            visible:false
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="adjust-index">
                <div className="form-wrapper">
                    {/*搜索部分 */}
                    <Form className="search-form">
                        <FormItem
                        label="损益时间"
                        labelCol={{ span: 5 }}
                        wrapperCol={{span: 10}}>
                            <RangePicker 
                                value={[moment(this.state.adjustTimeStart, dateFormat), moment(this.state.adjustTimeEnd, dateFormat)]}
                                format={dateFormat}
                                onChange={this.dateChange.bind(this)} />
                        </FormItem>
                        <FormItem
                        label="商品名称"
                        labelCol={{ span: 5 }}
                        wrapperCol={{span: 10}}>
                        {getFieldDecorator('name')(
                            <Input />
                        )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" icon="search" onClick={this.handleSearch.bind(this)}>搜索</Button>
                            <Button type="primary" onClick={this.exportList.bind(this)}>导出数据</Button>
                        </FormItem>
                        {/* <div className="export-div">
                           className="export-btn" 
                        </div> */}
                    </Form>
                </div>
                <div className="table-wrapper">
                    <CommonTable 
                        columns={this.columns} 
                        dataSource={this.state.dataSource}
                        pagination={true}
                        total={this.state.total}
                        current={this.state.currentPage+1}
                        pageSize={this.state.limit}
                        onShowSizeChange={this.onShowSizeChange}
                        pageChange={this.pageChange}
                        />
                </div>
            </div>
        );
    }

    //获取数据
    getServerData = (values) =>{
        const result=GetServerData('qerp.pos.pd.adjust.detail',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                let dataList = json.adjustSpus;
                for(let i=0;i<dataList.length;i++){
                    dataList[i].key = i+1;
                };
                this.setState({
                    dataSource:dataList,
                    total:Number(json.total),
                    currentPage:Number(json.currentPage),
                    limit:Number(json.limit)
                })
            }else{  
                message.error(json.message); 
            }
        })
    }

    //获取当前时间
     getNowFormatDate = () =>{
        const self = this;
        var date = new Date();
        var seperator1 = "-";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        this.setState({
            adjustTimeStart:currentdate,
            adjustTimeEnd:currentdate
        },function(){
            let values = {
                currentPage:0,
                limit:10,
                adjustTimeStart:this.state.adjustTimeStart,
                adjustTimeEnd:this.state.adjustTimeEnd,
                type:2
            }
            self.getServerData(values);
        })
    }

    componentDidMount(){
        //获取当前时间
        this.getNowFormatDate();
    }
}

function mapStateToProps(state){
    const {pdCheckId} = state.inventory;
  	return {pdCheckId};
}

const InventorydiffLogIndex = Form.create()(InventorydiffLogIndexForm);

export default connect(mapStateToProps)(InventorydiffLogIndex);