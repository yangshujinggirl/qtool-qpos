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
import Inventory from "./routes/Inventory";
import Adjust from "./routes/Adjust";
import Inventorydiff from "./routes/Inventorydiff";

//新增数据管理
import DataManage from "./routes/DataManage";
import ReceiptDetail from "./routes/ReceiptDetail"
import Memberinfo from "./routes/Memberinfo";
import AdjustLog from "./routes/AdjustLog";
import InventorydiffLog from "./routes/inventorydiffLog";
import Payamount from "./routes/Pay";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'antd';
import Adjustloginfo from './constants/adjustLog/info'

import Gooddb from './constants/gooddb/index'
import DbLogIndex from './constants/gooddb/dblog/index'
import Dbloginfo from './constants/gooddb/dblog/info'


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
      	<Route path="/sell" component={Sell} />
      	<Route path="/returngoods" component={Returngoods} />
      	<Route path="/inventory" component={Inventory} />
      	<Route path="/adjust" component={Adjust} />
      	<Route path="/inventorydiff" component={Inventorydiff} />
      	<Route path="/dataManage" component={DataManage}/>
      	<Route path="/member/info" component={Memberinfo} />
      	<Route path="/dataManage/receiptDetail" component={ReceiptDetail}/>
      	<Route path="/adjustLog" component={AdjustLog}/>
      	<Route path="/inventorydiffLog" component={InventorydiffLog}/>
		<Route path="/pay" component={Payamount}/>
		<Route path="/adjustLog/info" component={Adjustloginfo}/>
		<Route path="/gooddb" component={Gooddb}/>

		<Route path="/dblog" component={DbLogIndex}/>
		<Route path="/dblog/info" component={Dbloginfo}/>
		



    </Router>
		</LocaleProvider>
  );
}

export default RouterConfig;
