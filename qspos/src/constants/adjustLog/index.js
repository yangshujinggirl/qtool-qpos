import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip} from 'antd';
import { Link } from 'dva/router';
import CommonTable from '../../constants/dataManage/commonTable';
import {GetServerData} from '../../services/services';
import {GetExportData} from '../../services/services';
import moment from 'moment';
import RemarkText from './remarkModal';
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
            adjustTimeStart:"",
            adjustTimeEnd:"",
            visible:false,
            remarkText:'',
            windowHeight:''
        };
        this._isMounted = false;
        this.columns = [{
            title: '商品条码',
            dataIndex: 'barcode',
            width:'12%',
        },{
            title: '商品名称',
            dataIndex: 'name',
            width:'12%',
        },{
            title: '规格',
            dataIndex: 'displayName',
            width:'12%',
        },{
            title: '成本价',
            dataIndex: 'averageRecPrice',
            width:'8%',
        },{
            title: '损益数量',
            dataIndex: 'diffQty',
            width:'8%',
        },{
            title: '损益金额',
            dataIndex: 'adjustAmount',
            width:'8%',
        },{
            title: '操作人',
            dataIndex: 'operater',
            width:'8%',
        },{
            title: '操作时间',
            dataIndex: 'operateTime',
            width:'12%',
        },{
            title: '损益备注',
            dataIndex: 'remark',
            width:'6%',
            render: (text, record, index) => {
                return (
                    <span style={{color:"#35BAB0",cursor:"pointer"}} onClick={this.showRemark.bind(this,record)}>查看</span>
                )
            }
        }];
    }

    showRemark = (record) =>{
        this.setState({
            remarkText:record.remark,
            visible:true
        })
    }

    dateChange = (date, dateString) =>{
        this.setState({
            adjustTimeStart:dateString[0],
            adjustTimeEnd:dateString[1]
        })
    }

    //表格的方法
    pageChange=(page,pageSize)=>{
        const self = this;
        this.setState({
            currentPage:page-1
        },function(){
            let data = {
                currentPage:this.state.currentPage,
                limit:this.state.limit,
                adjustTimeStart:this.state.adjustTimeStart,
                adjustTimeEnd:this.state.adjustTimeEnd,
                name:this.state.name,
                type:1
            }
            self.getServerData(data);
        });
    }
    onShowSizeChange=(current, pageSize)=>{
        const self = this;
        this.setState({
            limit:pageSize,
            currentPage:0
        },function(){
            let data = {
                currentPage:this.state.currentPage,
                limit:this.state.limit,
                adjustTimeStart:this.state.adjustTimeStart,
                adjustTimeEnd:this.state.adjustTimeEnd,
                name:this.state.name,
                type:1
            }
            self.getServerData(data);
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
                    type:1
                }
                self.getServerData(data);
            })
        })
    }

    //导出数据
    exportList = () =>{
        let data = {
            adjustTimeStart:this.state.adjustTimeStart,
            adjustTimeEnd:this.state.adjustTimeEnd,
            name:this.state.name,
            type:1
        }
        const result=GetExportData('qerp.qpos.pd.adjust.export',data);
    }

    //改变visible
    changeVisible = () =>{
        this.setState({
            visible:false
        })
    }

    rowClassName=(record, index)=>{
    	if (index % 2) {
      		return 'table_gray'
    	}else{
      		return 'table_white'
    	}
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
                                value={this.state.adjustTimeStart?
                                        [moment(this.state.adjustTimeStart, dateFormat), moment(this.state.adjustTimeEnd, dateFormat)]
                                        :null
                                    }
                                format={dateFormat}
                                onChange={this.dateChange.bind(this)} />
                        </FormItem>
                        <FormItem
                        label="商品名称"
                        labelCol={{ span: 5 }}
                        wrapperCol={{span: 10}}>
                        {getFieldDecorator('name')(
                            <Input  autoComplete="off" placeholder="请输入商品名称"/>
                        )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" icon="search" onClick={this.handleSearch.bind(this)}>搜索</Button>
                            {/* <div className="export-div">  className="export-btn"*/}
                                <Button type="primary" onClick={this.exportList.bind(this)}>导出数据</Button>
                            {/* </div> */}
                        </FormItem>
                        
                    </Form>
                </div>
                <div className="table-wrapper add-norecord-img" ref="tableWrapper">
                    <RemarkText visible={this.state.visible} changeVisible={this.changeVisible.bind(this)}
                                remarkText={this.state.remarkText}/>
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
        let date = new Date();
        let seperator1 = "-";
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;

        let date2 = new Date(date);
        date2.setDate(date.getDate() - 30);
        let month1 = date2.getMonth() + 1;
        let strDate1 = date2.getDate();
        if (month1 >= 1 && month1 <= 9) {
            month1 = "0" + month;
        }
        if (strDate1 >= 0 && strDate1 <= 9) {
            strDate1 = "0" + strDate1;
        }
        var currentdate1 = date2.getFullYear() + seperator1 + month1 + seperator1 + strDate1;
        this.setState({
            adjustTimeStart:currentdate1,
            adjustTimeEnd:currentdate
        },function(){
            let values = {
                currentPage:0,
                limit:10,
                adjustTimeStart:this.state.adjustTimeStart,
                adjustTimeEnd:this.state.adjustTimeEnd,
                type:1
            }
            self.getServerData(values);
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

function mapStateToProps(state){
   return {};
}

const AdjustLogIndex = Form.create()(AdjustLogIndexForm);

export default connect(mapStateToProps)(AdjustLogIndex);