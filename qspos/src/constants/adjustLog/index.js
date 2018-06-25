import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip} from 'antd';
import { Link } from 'dva/router';
import CommonTable from '../../constants/dataManage/commonTable';
import {GetServerData} from '../../services/services';
import {GetExportData} from '../../services/services';
import moment from 'moment';
import {timeForMats} from '../../utils/commonFc';
import '../../style/adjustLog.css'

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

class AdjustLogIndexForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource:[],
            total:0,
            currentPage:0,
            limit:10,
            adjustTimeST:"",
            adjustTimeET:"",
            visible:false,
            windowHeight:''
        };
        this._isMounted = false;
        this.columns = [{
            title: '商品损益单号',
            dataIndex: 'adjustNo',
            width:'12%',
            render: (text, record, index) => {
                return (
                    <Link to={{pathname:'/adjustLog/info',query:{id:record.adjustId,adjustNo:record.adjustNo,qty:record.qty,typeStr:record.typeStr,operater:record.operater,operateTime:record.operateTime,remark:record.remark}}}>{text}</Link>
                )
            }
        },{
            title: '损益数量',
            dataIndex: 'qty',
            width:'12%',
        },{
            title: '损益类型',
            dataIndex: 'typeStr',
            width:'12%',
        },{
            title: '创建人',
            dataIndex: 'operater',
            width:'8%',
        },{
            title: '损益时间',
            dataIndex: 'operateTime',
            width:'8%',
        }];
    }

    dateChange = (date, dateString) =>{
        this.setState({
            adjustTimeST:dateString[0],
            adjustTimeET:dateString[1]
        })
    }

    //表格的方法
    pageChange=(page,pageSize)=>{
        this.setState({
            limit:pageSize,
            currentPage:Number(page)-1
        },function(){
                this.handleSearch()
        })
    }
    onShowSizeChange=(current, pageSize)=>{
        this.setState({
            limit:pageSize,
            currentPage:Number(current)-1
        },function(){
            this.handleSearch()
        })
    }

    handleSearch = (e) =>{
        const self = this;
        this.props.form.validateFields((err, values) => {
            values.adjustTimeST=this.state.adjustTimeST
            values.adjustTimeET=this.state.adjustTimeET
            values.limit=this.state.limit;
            values.currentPage=this.state.currentPage
            const result=GetServerData('qerp.pos.pd.adjust.query',values)
            result.then((res) => {
                return res;
            }).then((json) => {
                if(json.code=='0'){
                    const adjustNos = json.adjustNos;
                    for(let i=0;i<adjustNos.length;i++){
                        adjustNos[i].key = i+1;
                    };
                    this.setState({
                        dataSource:adjustNos,
                        total:Number(json.total),
                        currentPage:Number(json.currentPage),
                        limit:Number(json.limit)
                    })
                }else{
                    message.error(json.message);
                }
            })
        })
    }

    //导出数据
    exportList = () =>{
        let data = {
            adjustTimeST:this.state.adjustTimeST,
            adjustTimeET:this.state.adjustTimeET,
            name:this.state.name,
            type:1
        }
        const result=GetExportData('qerp.qpos.pd.adjust.export',data);
    }


    rowClassName=(record, index)=>{
    	if (index % 2) {
      		return 'table_gray'
    	}else{
      		return 'table_white'
    	}
      }



    //获取当前时间
    getNowFormatDate = () =>{
        let startRpDate=timeForMats(30).t2;
        let endRpDate=timeForMats(30).t1;
        this.setState({
            adjustTimeST:startRpDate,
            adjustTimeET:endRpDate
        },function(){
            this.handleSearch();
        })
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
            <div className="adjust-index">
                <div className="form-wrapper">
                    <Form className="search-form">
                        <FormItem
                            className='search-con-data1'
                            label="损益时间"
                            labelCol={{ span: 5 }}
                            wrapperCol={{span: 10}}>
                            <RangePicker
                                value={this.state.adjustTimeST?
                                        [moment(this.state.adjustTimeST, dateFormat), moment(this.state.adjustTimeET, dateFormat)]
                                        :null
                                    }
                                format={dateFormat}
                                onChange={this.dateChange.bind(this)} />
                        </FormItem>
                        <FormItem
                            label="损益类型"
                            className='adjustlog-select-log'
                            labelCol={{ span: 5 }}
                            wrapperCol={{span: 10}}>
                                {getFieldDecorator('type')(
                                   <Select size='large' style={{marginRight:"10px"}} allowClear={true}
                                        placeholder="请选择损益类型">
                                            <Option value="1">商品丢失损坏</Option>
                                            <Option value="2">盘点差异调整</Option>
                                            <Option value="3">店铺活动赠品</Option>
                                            <Option value="4">仓储快递损坏</Option>
                                            <Option value="5">过期商品处理</Option>
                                    </Select>
                                )}
                        </FormItem>
                        <FormItem className='fr'>
                            <Button type="primary" onClick={this.handleSearch.bind(this)} size='large' className='adjust-formsearch-btn'>搜索</Button>
                            {/* <div className="export-div">  className="export-btn"*/}
                                {/* <Button type="primary" onClick={this.exportList.bind(this)} size='large'>导出数据</Button> */}
                            {/* </div> */}
                        </FormItem>
                        <FormItem className='fr search-con-input'>
                        {getFieldDecorator('keywords')(
                            <Input  autoComplete="off" placeholder="请输入商品名称/条码/单号"/>
                        )}
                        </FormItem>
                    </Form>
                </div>
                <div className="table-wrapper add-norecord-img" ref="tableWrapper">
                    <Table
                        bordered
                        columns={this.columns}
                        dataSource={this.state.dataSource}
                        rowClassName={this.rowClassName.bind(this)}
                        scroll={{y:this.state.windowHeight}}
                        pagination={
                            {
                                total:this.state.total,
                                current:this.state.currentPage+1,
                                defaultPageSize:10,
                                pageSize:this.state.limit,
                                showSizeChanger:true,
                                onShowSizeChange:this.onShowSizeChange,
                                onChange:this.pageChange,
                                pageSizeOptions:['10','12','15','17','20','50','100','200']
                            }
                        }
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
        //获取当前时间
        this.getNowFormatDate();
    }

    componentWillUnmount(){
        this._isMounted = false;
        window.removeEventListener('resize', this.windowResize.bind(this));
    }
}


const AdjustLogIndex = Form.create()(AdjustLogIndexForm);
export default connect()(AdjustLogIndex);
