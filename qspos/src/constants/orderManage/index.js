import React , { Component } from 'react';
import { connect } from 'dva';
import { Tabs, message } from 'antd';
import ListMod from './components/ListMod';
import DetailMod from './components/DetailMod';
import FilterForm from './components/FilterForm';
//引入打印
import {
  getSaleOrderInfo,
  getCDSaleOrderInfo,
  getReturnOrderInfo,
  getRechargeOrderInfo
} from '../../components/Method/Print';
import { GetServerData } from '../../services/services';
import './index.less';

const TabPane = Tabs.TabPane;
const TabsDataSourceApp =[{
          title:'全部订单',
          key:'0'
        },{
          title:'门店pos订单',
          key:'1'
        },{
          title:'门店APP订单',
          key:'2'
        },{
          title:'仓库直邮订单',
          key:'3'
        },{
          title:'保税订单',
          key:'4'
        }]
const TabsDataSource =[{
          title:'全部订单',
          key:'0'
        }]
const TabsDataSourceWorkers =[{
          title:'全部订单',
          key:'0'
        },{
          title:'门店pos订单',
          key:'1'
        },{
          title:'门店APP订单',
          key:'2'
        }]

class OrderManage extends Component {
  constructor(props) {
    super(props);
    this.state={
      fields: {},
      tabKey:'0',//tab切换KEY,对应source
    }
  }
  componentDidMount() {
    this.initPage()
  }
  initPage() {
    let fields={};
    const { tabKey } =this.state;
    switch(tabKey) {
      case '0':
        fields = {
          time:'',
          type:'',
          orderStatus:'',
          keywords:''
        };
        break;
      case '1':
      case '3':
      case '4':
        fields = {
          time:'',
          type:0,
          keywords:''
        };
        break;
      case '2':
        fields = {
          time:'',
          orderStatus:0,
          deliveryType:0,
          keywords:''
        };
        break;
    }
    this.setState({ fields });
    this.fetchlist(fields)
  }
  fetchlist(values) {
    const { tabKey } =this.state;
    values = {
      ...values,
      source:tabKey,
    };
    // values.type = values.type?values.type:0;
    this.props.dispatch({
      type:'orderManage/fetchList',
      payload:values
    })
  }
  //双向绑定表单
  handleFormChange = (changedFields) => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  }
  changeTab=(value)=> {
    this.setState({ tabKey: value},()=>{
      this.initPage()
    })
  }
  searchData=(values)=> {
    this.fetchlist(values)
  }
  //分页
  changePage = (currentPage, pageSize) => {
    currentPage--;
    let paramsObj = {
      currentPage,
      limit:pageSize
    }
    const { fields } = this.state;
    paramsObj ={...paramsObj,...fields}
    this.fetchlist(paramsObj)
  }
  //修改pageSize
  changePageSize =(values)=> {
    const { fields } = this.state;
    values = {...{limit:values},...fields}
    this.fetchlist(values)
  }
  goPrint=()=> {
    const { detailInfo } = this.props.orderManage;
    if(detailInfo.orderCategory=='1'&&detailInfo.odOrder.orderStatus=='4') {
      message.warning('订单已关闭，无法打印小票');
      return;
    }
    let size;
    this.props.dispatch({type: 'spinLoad/setLoading',payload:true})
    GetServerData('qerp.pos.sy.config.info')
    .then((res) => {
      const { code, config } =res;
      this.props.dispatch({type: 'spinLoad/setLoading',payload:false})
      if(code == '0') {
        if(config.paperSize=='80') {
          size = '80';
        } else {
          size = '58';
        }
        this.handlePrint(detailInfo,size);
      } else {
        message.warning('打印失败')
      }
    })
  }
  handlePrint(detailInfo,size) {
    const { orderCategory, businessType } =detailInfo;
    switch(orderCategory) {
      case '1':
        if(businessType == '1') {
          getSaleOrderInfo(detailInfo,size,"1")
        } else{
          getCDSaleOrderInfo(detailInfo,size,"1")
        }
        break;
      case '2':
        getRechargeOrderInfo(detailInfo,size,"1")
        break;
      case '3':
        getReturnOrderInfo(detailInfo,size,"1")
        break;
    }
  }
  render() {
    const { fields, tabKey } =this.state;
    const { dataList, detailInfo } =this.props.orderManage;
    let role = sessionStorage.getItem('role');
    let openApp = sessionStorage.getItem('openApp');
    let tabsData;
    if(role == 3) {//店员权限3只展示全部订单
      tabsData = TabsDataSource;
    } else if(openApp==1) {//店员权限3不显不保税仓库。
      tabsData = role==3?TabsDataSourceWorkers:TabsDataSourceApp;
    } else {
      tabsData = TabsDataSource;
    }
    // console.log('123455555我是测试代码')
    return(
      <div className="order-manage-content-wrap">
        <Tabs
          defaultActiveKey={this.state.tabKey}
          onChange={this.changeTab}
          type="card"
          className="common-tabs-wrap">
          {
            tabsData.map((el,index) => (
              <TabPane tab={el.title} key={el.key}>
                <div className="main-content-action">
                  <FilterForm
                    {...fields}
                    onValuesChange={this.handleFormChange}
                    submit={this.searchData}
                    type={el.key}/>
                  {
                    dataList.length>0?
                    <div className="list-detail-action">
                      <div className="part-l">
                        <ListMod
                          changePage={this.changePage}
                          changePageSize={this.changePageSize}
                          type={el.key}/>
                      </div>
                      <div className="part-r">
                        <DetailMod/>
                        {
                          (detailInfo.businessType=='1'||detailInfo.businessType=='2')&&
                          <div className="go-print" onClick={this.goPrint}></div>
                        }
                      </div>
                    </div>
                    :
                    <div className="no-data-list">暂无订单</div>
                  }
                </div>
              </TabPane>
            ))
          }
        </Tabs>
      </div>
    )
  }
}
function mapStateToProps(state){
  const { orderManage } = state;
  return { orderManage };
}
export default connect(mapStateToProps)(OrderManage)
