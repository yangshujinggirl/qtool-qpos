import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip,Pagination} from 'antd';

import {GetServerData} from '../../../services/services';
import CommonTable from '../../dataManage/commonTable';

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
        var exchangeId = location.hash.split('?')[1].split('&')[0].split('=')[1]
        var exchangeNo = location.hash.split('?')[1].split('&')[1].split('=')[1]
        const data0 = GetServerData('qerp.pos.pd.exchange.query',{exchangeNo:exchangeNo})
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
        const data1 = GetServerData('qerp.qpos.pd.exchange.detail.info',{qposPdExchangeId:exchangeId})
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
        const logdata = GetServerData('qerp.qpos.pd.exchange.info',{qposPdExchangeId:exchangeId})
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

    render() {
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
                        current={Number(this.state.currentPage)}
                        total={this.state.total}
                        currentPage={this.state.currentPage}
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
            </div>
        );
    }

    componentDidMount(){
        this.getSearchData()
    }
}

const Dbloginfos = Form.create()(ReceiptDetailsForm);

export default connect()(Dbloginfos);
