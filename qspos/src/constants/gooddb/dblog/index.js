// import React from 'react';
// import { connect } from 'dva';
// import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip} from 'antd';
// import { Link } from 'dva/router';
// import {GetServerData} from '../../../services/services';
// import {GetExportData} from '../../../services/services';
// import moment from 'moment';
// // import RemarkText from './remarkModal';
// import {timeForMats} from '../../../utils/commonFc';
// import '../../../style/adjustLog.css'
// import Header from '../../../components/header/Header';

// const FormItem = Form.Item;
// const Option = Select.Option;
// const { RangePicker } = DatePicker;
// const dateFormat = 'YYYY-MM-DD';

// class AdjustLogIndexForm extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state={
//             dataSource:[],
//             total:0,
//             currentPage:0,
//             limit:10,
//             adjustTimeStart:"",
//             adjustTimeEnd:"",
//             visible:false,
//             remarkText:'',
//             windowHeight:''
//         };
//         this._isMounted = false;
//         this.columns = [{
//             title: '商品损益单号',
//             dataIndex: 'barcode',
//             width:'12%',
//             render: (text, record, index) => {
//                 return (
//                     // <div onClick={this.toRoute.bind(this,record)} style={{color:"#35BAB0",cursor:"pointer"}}>{text}</div>
//                      <Link to={{pathname:'/dblog/info',query:{id:record.pdOrderId}}}>{text}</Link>
//                 )
//             }
//         },{
//             title: '损益数量',
//             dataIndex: 'name',
//             width:'12%',
//         },{
//             title: '损益类型',
//             dataIndex: 'displayName',
//             width:'12%',
//         },{
//             title: '创建人',
//             dataIndex: 'averageRecPrice',
//             width:'8%',
//         },{
//             title: '损益时间',
//             dataIndex: 'diffQty',
//             width:'8%',
//         }];
//     }

//     showRemark = (record) =>{
//         this.setState({
//             remarkText:record.remark,
//             visible:true
//         })
//     }

//     dateChange = (date, dateString) =>{
//         this.setState({
//             adjustTimeStart:dateString[0],
//             adjustTimeEnd:dateString[1]
//         })
//     }

//     //表格的方法
//     pageChange=(page,pageSize)=>{
//         const self = this;
//         this.setState({
//             currentPage:page-1
//         },function(){
//             let data = {
//                 currentPage:this.state.currentPage,
//                 limit:this.state.limit,
//                 adjustTimeStart:this.state.adjustTimeStart,
//                 adjustTimeEnd:this.state.adjustTimeEnd,
//                 name:this.state.name,
//                 type:1
//             }
//             self.getServerData(data);
//         });
//     }
//     onShowSizeChange=(current, pageSize)=>{
//         const self = this;
//         this.setState({
//             limit:pageSize,
//             currentPage:0
//         },function(){
//             let data = {
//                 currentPage:this.state.currentPage,
//                 limit:this.state.limit,
//                 adjustTimeStart:this.state.adjustTimeStart,
//                 adjustTimeEnd:this.state.adjustTimeEnd,
//                 name:this.state.name,
//                 type:1
//             }
//             self.getServerData(data);
//         })
//     }

//     handleSearch = (e) =>{
//         const self = this;
//         e.preventDefault();
//         this.props.form.validateFields((err, values) => {
//             this.setState({
//                 name:values.name
//             },function(){
//                 let data = {
//                     currentPage:0,
//                     limit:10,
//                     adjustTimeStart:this.state.adjustTimeStart,
//                     adjustTimeEnd:this.state.adjustTimeEnd,
//                     name:this.state.name,
//                     type:1
//                 }
//                 self.getServerData(data);
//             })
//         })
//     }

//     //导出数据
//     exportList = () =>{
//         let data = {
//             adjustTimeStart:this.state.adjustTimeStart,
//             adjustTimeEnd:this.state.adjustTimeEnd,
//             name:this.state.name,
//             type:1
//         }
//         const result=GetExportData('qerp.qpos.pd.adjust.export',data);
//     }

//     //改变visible
//     changeVisible = () =>{
//         this.setState({
//             visible:false
//         })
//     }

//     rowClassName=(record, index)=>{
//     	if (index % 2) {
//       		return 'table_gray'
//     	}else{
//       		return 'table_white'
//     	}
//   	}

//     render() {
//         const { getFieldDecorator } = this.props.form;
//         return (
//             <div className="adjust-index">
//                 <Header type={false} color={true} linkRoute="goods"/>
//                 <div className='counters'>
//                 <div className="form-wrapper">
//                     <Form className="search-form">
//                         <FormItem
//                             label="调拨时间"
//                             labelCol={{ span: 5 }}
//                             wrapperCol={{span: 10}}>
//                             <RangePicker 
//                                 value={this.state.adjustTimeStart?
//                                         [moment(this.state.adjustTimeStart, dateFormat), moment(this.state.adjustTimeEnd, dateFormat)]
//                                         :null
//                                     }
//                                 format={dateFormat}
//                                 onChange={this.dateChange.bind(this)} />
//                         </FormItem>
//                         <FormItem
//                             label="需求门店"
//                             labelCol={{ span: 5 }}
//                             wrapperCol={{span: 10}}
//                         >
//                         {getFieldDecorator('name')(
//                             <Input  autoComplete="off" placeholder="请输入商品名称/条码/单号"/>
//                         )}
//                         </FormItem>



//                         <FormItem
//                             label="损益类型"
//                             labelCol={{ span: 5 }}
//                             wrapperCol={{span: 10}}>
//                                 <Select size='large' style={{marginRight:"10px"}}>
//                                     <Option value="jack">店铺活动赠品</Option>
//                                     <Option value="lucy">仓储快递损坏</Option>
//                                     <Option value="disabled">商品丢失损坏</Option>
//                                     <Option value="Yiminghe">盘点差异调整</Option>
//                                     <Option value="Yiminghe2">过期商品处理</Option>
//                                 </Select>
//                         </FormItem>
//                         <FormItem>
//                         {getFieldDecorator('name')(
//                             <Input  autoComplete="off" placeholder="请输入商品名称/条码/单号"/>
//                         )}
//                         </FormItem>

//                         <FormItem>
//                             <Button type="primary" icon="search" onClick={this.handleSearch.bind(this)} size='large'>搜索</Button>
//                             {/* <div className="export-div">  className="export-btn"*/}
//                                 <Button type="primary" onClick={this.exportList.bind(this)} size='large'>导出数据</Button>
//                             {/* </div> */}
//                         </FormItem>
                        
//                     </Form>
//                 </div>
//                 <div className="table-wrapper add-norecord-img" ref="tableWrapper">
//                     {/* <RemarkText visible={this.state.visible} changeVisible={this.changeVisible.bind(this)}
//                                 remarkText={this.state.remarkText}/> */}
//                     <Table 
//                         bordered 
//                         columns={this.columns} 
//                         dataSource={this.state.dataSource} 
//                         rowClassName={this.rowClassName.bind(this)}
//                         scroll={{y:this.state.windowHeight}}
//                         pagination={
//                             {
//                                 total:this.state.total,
//                                 current:this.state.currentPage+1,
//                                 defaultPageSize:10,
//                                 pageSize:this.state.limit,
//                                 showSizeChanger:true,
//                                 onShowSizeChange:this.onShowSizeChange,
//                                 onChange:this.pageChange,
//                                 pageSizeOptions:['10','12','15','17','20','50','100','200']
//                             }
//                         }
//                         />
//                 </div>
//                 </div>
//             </div>
//         );
//     }

//     //获取数据
//     getServerData = (values) =>{
//         const result=GetServerData('qerp.pos.pd.adjust.detail',values)
//         result.then((res) => {
//             return res;
//         }).then((json) => {
//             if(json.code=='0'){
//                 let dataList = json.adjustSpus;
//                 for(let i=0;i<dataList.length;i++){
//                     dataList[i].key = i+1;
//                 };
//                 this.setState({
//                     dataSource:dataList,
//                     total:Number(json.total),
//                     currentPage:Number(json.currentPage),
//                     limit:Number(json.limit)
//                 })
//             }else{  
//                 message.error(json.message); 
//             }
//         })
//     }

//     //获取当前时间
//      getNowFormatDate = () =>{
//         const self = this;
//         let startRpDate=timeForMats(30).t2;
//         let endRpDate=timeForMats(30).t1;
//         this.setState({
//             adjustTimeStart:startRpDate,
//             adjustTimeEnd:endRpDate
//         },function(){
//             let values = {
//                 currentPage:0,
//                 limit:10,
//                 adjustTimeStart:this.state.adjustTimeStart,
//                 adjustTimeEnd:this.state.adjustTimeEnd,
//                 type:1
//             }
//             self.getServerData(values);
//         })
//     }

//     windowResize = () =>{
//         if(!this.refs.tableWrapper){
//             return
//         }else{
//             if(document.body.offsetWidth>800){
//                 this.setState({
//                     windowHeight:document.body.offsetHeight-300,
//                 })
//             }else{
//                 this.setState({
//                 windowHeight:document.body.offsetHeight-270,
//             });
//             }
//         }
//     }

//     componentDidMount(){
//         this._isMounted = true;
//         if(this._isMounted){
//             if(document.body.offsetWidth>800){
//                 this.setState({
//                    windowHeight:document.body.offsetHeight-300,
//                  });
//             }else{
//                 this.setState({
//                     windowHeight:document.body.offsetHeight-270,
//                 });
//             }
//             window.addEventListener('resize',this.windowResize.bind(this));
//         }
//         //获取当前时间
//         this.getNowFormatDate();
//     }

//     componentWillUnmount(){   
//         this._isMounted = false;
//         window.removeEventListener('resize', this.windowResize.bind(this));
//     }
// }


// const DbLogIndex = Form.create()(AdjustLogIndexForm);

// export default connect()(DbLogIndex);


import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip,AutoComplete} from 'antd';
import { Link } from 'dva/router';
import CommonTable from '../../../constants/dataManage/commonTable';
import {GetServerData} from '../../../services/services';
import {GetExportData} from '../../../services/services';
import moment from 'moment';
import {timeForMats} from '../../../utils/commonFc';
// import '../../style/adjustLog.css'

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
            adjustTimeStart:null,
            adjustTimeEnd:null,
            visible:false,
            windowHeight:'',
            shopId:null
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
            adjustTimeStart:dateString[0],
            adjustTimeEnd:dateString[1]
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
            values.exchangeTimeStart=this.state.adjustTimeStart
            values.exchangeTimeEnd=this.state.adjustTimeEnd
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
            adjustTimeStart:this.state.adjustTimeStart,
            adjustTimeEnd:this.state.adjustTimeEnd,
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
            adjustTimeStart:startRpDate,
            adjustTimeEnd:endRpDate
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


    handlespSearch = (value) => {
        let data={name:value};
        const result=GetServerData('qerp.web.sp.shop.list',data);
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                let shopList=json.shops;
                let dataSources=[];
                for(let i=0;i<shopList.length;i++){
                    dataSources.push({
                        text:shopList[i].name,
                        value:shopList[i].spShopId,
                        key:i
                    })
                }
                this.setState({
                    dataSources:dataSources,
                    shopId:null,
                    sureShopId:null
                },function(){
                    this.props.getNewidData(this.state.shopId)
                });
            }
        })
    }

    onSelect=(value)=>{
        this.setState({
            shopId:value
        },function(){
            this.props.getNewidData(this.state.shopId)
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="adjust-index">
                <div className="form-wrapper">
                    <Form className="search-form">
                        <FormItem
                            className='search-con-data1'
                            label="调拨时间"
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
                            className='search-con-data1'
                            label="调拨时间"
                            labelCol={{ span: 5 }}
                            wrapperCol={{span: 10}}>
                            <AutoComplete
                                dataSource={this.state.dataSources}
                                onSelect={this.onSelect}
                                onSearch={this.handlespSearch}
                                placeholder='请选择门店名称'
                            />
                        </FormItem>



                        <FormItem
                            label="调拨状态"
                            labelCol={{ span: 5 }}
                            wrapperCol={{span: 10}}>
                                {getFieldDecorator('status')(
                                   <Select size='large' style={{marginRight:"10px"}}>
                                        <Option value="1">待收货</Option>
                                        <Option value="3">收货中</Option>
                                        <Option value="4">已收货</Option>
                                        <Option value="2">已撤销</Option>
                                    </Select>
                                )} 
                        </FormItem>
                        <FormItem className='fr'>
                            <Button type="primary" onClick={this.handleSearch.bind(this)} size='large'>搜索</Button>
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


const DbLogIndexs =Form.create()(AdjustLogIndexForm);
export default connect()(DbLogIndexs);