import React from 'react';
import { Router, Route } from 'dva/router';
import Cashier from './routes/Cashier';
import IndexPage from './routes/Login';
import Account from "./routes/Account";
import Member from "./routes/Member";
import Receivegoods from "./routes/Receivegoods";
import Goods from "./routes/Goods";
import Sell from "./routes/Sell";
import Returngoods from "./routes/Returngoods";
import Inventory from "./routes/InventoryNew";
import Adjust from "./routes/Adjust";
import Inventorydiff from "./routes/Inventorydiff";
import OrderManage from './routes/OrderManage';
//新增数据管理
import DataManage from "./routes/DataManage";
import ReceiptDetail from "./routes/ReceiptDetail"
import Memberinfo from "./routes/Memberinfo";
import AdjustLog from "./routes/AdjustLog";
import InventorydiffLog from "./routes/inventorydiffLog";
import Payamount from "./routes/Pay";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'antd';
import Adjustloginfo from './routes/adjustloginfo'

import Gooddb from './constants/gooddb/index'
import DbLogIndex from './routes/dblog'
import Dbloginfo from './routes/dbinfolog'
import Inventoryloginfo from './routes/inventorydiffloginfo'
import MemberBirth from './routes/MemberBirth';

import ReceviceDetail from './constants/dataManage/ChargeBackList/GoodsDetail';//收货详情

function RouterConfig({ history }) {
  return (
		<LocaleProvider locale={zhCN}>
    <Router history={history}>
      <Route path='/' component={IndexPage} />
      <Route path='/cashier' component={Cashier} />
      <Route path="/account" component={Account} />
      <Route path="/member" component={Member} />
      <Route path="/receivegoods" component={Receivegoods} />
      <Route path="/goods" component={Goods} />
      <Route path="/sell" component={OrderManage} />
      <Route path="/returngoods" component={Returngoods} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/adjust" component={Adjust} />
      <Route path="/inventorydiff" component={Inventorydiff} />
      <Route path="/dataManage" component={DataManage}/>
      <Route path="/member/info" component={Memberinfo} />
      <Route path="/dataManage/receiptDetail/:id" component={ReceviceDetail}/>
      <Route path="/adjustLog" component={AdjustLog}/>
      <Route path="/inventorydiffLog" component={InventorydiffLog}/>
      <Route path="/pay" component={Payamount}/>
      <Route path="/adjustLog/info" component={Adjustloginfo}/>
      <Route path="/gooddb" component={Gooddb}/>
      <Route path="/dblog" component={DbLogIndex}/>
      <Route path="/dblog/info" component={Dbloginfo}/>
      <Route path="/inventorydiffLog/info" component={Inventoryloginfo}/>
      <Route path="/memberBirth" component={MemberBirth}/>
    </Router>
		</LocaleProvider>
  );
}

export default RouterConfig;
