import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip,Pagination} from 'antd';

import {GetServerData} from '../../../services/services';
import CommonTable from '../../dataManage/commonTable';
import { getDbOrderInfo } from '../../../components/Method/Print'

class ReceiptDetailsForm extends React.Component {
    constructor(props,context) {
        super(props,context);
        this.state={
            dataSource:[],
            total:0,
            currentItem:{
              exchangeNo:null,
              inShopName:null,
              urUser:null,
              statusStr:null,
              qtySum:null,
              amountSum:null,
              createTime:null
           },
          logdataSource:[],
          currentPage:0,
          limit:10,
        };
        this.columns = [{
            title: '商品条码',
            dataIndex: 'code',
        },{
            title: '商品名称',
            dataIndex: 'name',
        },{
            title: '商品规格',
            dataIndex: 'displayName',
        },{
            title: '调拨数量',
            dataIndex: 'qty',
        },{
            title: '调拨总价',
            dataIndex: 'price',
        }];
        this.columns1=[{
          title: '操作记录',
          dataIndex: 'operateName',
        },{
          title: '操作人',
          dataIndex: 'operateUser',
        },{
          title: '操作时间',
          dataIndex: 'operateTime',
        },{
          title: '备注',
          dataIndex: 'remark',
        }]

    }

    //表格的方法
    pageChange=(page,pageSize)=>{
      page--
      this.setState({
          limit:pageSize,
          currentPage:page
      });

      this.getSearchData(page,pageSize)
    }

    onShowSizeChange=(current, pageSize)=>{
        current--;
        this.setState({
            limit:pageSize,
            currentPage:Number(current)-1
        })
        this.getSearchData(current, pageSize)
    }
    //获取数据
    getSearchData = (page,pageSize) =>{
        var exchangeId = location.hash.split('?')[1].split('&')[0].split('=')[1]
        var exchangeNo = location.hash.split('?')[1].split('&')[1].split('=')[1]
        let params1 = {
          currentPage:page||0,
          limit:pageSize||15,
          qposPdExchangeId:exchangeId
        }
        const data0 = GetServerData('qerp.pos.pd.exchange.query',{exchangeNo:exchangeNo})
        const data1 = GetServerData('qerp.qpos.pd.exchange.detail.info',params1)
        const logdata = GetServerData('qerp.qpos.pd.exchange.info',{qposPdExchangeId:exchangeId})
        data0.then((res) => {
          return res;
        }).then((json) => {
          if(json.code=='0'){
            const exchanges=json.exchangeNos
            this.setState({
              currentItem:exchanges[0],
            })
          }else{
            message.error(json.message);
          }
        })
        data1.then((res) => {
          return res;
        }).then((json) => {
          const pdSpus=json.pdInfo
          if(json.code=='0'){
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
        logdata.then((res) => {
            return res;
          }).then((json) => {
            const logs=json.logs
            if(json.code=='0'){
              this.setState({
                logdataSource:logs,
              })
            }else{
              message.error(json.message);
            }
          })
    }

    //打印


    printDborder=(exchangNo)=>{
      console.log('diao da yin fang fa')
      const printdata={}
      const values={
        exchangeNo:exchangNo
      }
      const result=GetServerData('qerp.pos.pd.exchange.query',values);
      result.then((res) => {
        return res;
      }).then((json) => {
        if(json.code=='0'){
          printdata.exchangeNos=json.exchangeNos
          const value={
            	qposPdExchangeId:json.exchangeNos[0].qposPdExchangeId
          }
          const result=GetServerData('qerp.qpos.pd.exchange.detail.info',value);
          result.then((res) => {
            return res;
          }).then((json) => {
            if(json.code=='0'){
              printdata.pdInfo=json.pdInfo
              //请求打印的份数
              const result=GetServerData('qerp.pos.sy.config.info')
              result.then((res) => {
                   return res;
              }).then((json) => {
                     console.log(json);
                     if(json.code == "0"){
                    const allocationPrint=json.config.allocationPrint  //是否可以打印  1是  0否
                    const allocationPrintNum = json.config.allocationPrintNum  //打印份数
                    const paperSize=json.config.paperSize  //打印纸张大小
                    if(allocationPrint=='1'){
                      if(paperSize=='80'){
                        getDbOrderInfo(printdata,'80',allocationPrintNum)
                      }else{
                        getDbOrderInfo(printdata,'58',allocationPrintNum)
                      }
                    }


                   }
               })
            }else{
              message.error(json.message);
            }
          })
        }else{
          message.error(json.message);
        }
      })

    }



    render() {
        console.log(this.state.currentPage)
        let { currentPage } =this.state;
        currentPage++;
        return (
            <div className="ph-info">
                <div className="scroll-wrapper receipetDetailWrapper">
                    <div className="info-title">商品调拨信息</div>
                    <div className="info-content">
                      <label>订单号:</label><span>{this.state.currentItem.exchangeNo}</span>
                      <label>需求门店:</label><span>{this.state.currentItem.inShopName}</span>
                      <label>创建人:</label><span>{this.state.currentItem.urUser}</span>
                      <label>调拨状态:</label><span>{this.state.currentItem.statusStr}</span>
                      <label>商品调拨数量:</label><span>{this.state.currentItem.qtySum}</span>
                      <label>商品调拨总价:</label><span>{this.state.currentItem.amountSum}</span>
                      <label>创建时间:</label><span>{this.state.currentItem.createTime}</span>
                    </div>
                    <div className="info-title">商品信息</div>
                      <CommonTable
                          columns={this.columns}
                          dataSource={this.state.dataSource}
                          pagination={true}
                          current={currentPage}
                          total={this.state.total}
                          currentPage={currentPage}
                          pageSize={this.state.limit}
                          onShowSizeChange={this.onShowSizeChange}
                          pageChange={this.pageChange}
                          />
                    <CommonTable
                      columns={this.columns1}
                      dataSource={this.state.logdataSource}
                      pagination={false}
                    />
                </div>
                <div className="re-print-db" onClick={this.printDborder.bind(this,this.state.currentItem.exchangeNo)}>
                        <img src={require("../../../images/icon_rePrint@2x.png")} alt=""/>
                </div>
            </div>
        );
    }

    componentDidMount(){
        this.getSearchData()
    }
}

const Dbloginfos = Form.create()(ReceiptDetailsForm);

export default connect()(Dbloginfos);
