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

function RouterConfig({ history }) {
  return (
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
    </Router>
  );
}

export default RouterConfig;
