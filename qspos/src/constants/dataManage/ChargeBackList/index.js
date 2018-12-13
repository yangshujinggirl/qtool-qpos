import React, { Component } from 'react';
import { Tabs } from 'antd';
import ReceiveGoods from './ReceiveGoods';
import ReturnGoods from './ReturnGoods';
import './index.less';

const TabPane = Tabs.TabPane;

class ChargeBackList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key:'1'
    }
  }
  callback=(key)=> {
    console.log(key);
    this.setState({ key })
  }
  render() {
    return(
      <div className="daily-statement-pages">
        <Tabs defaultActiveKey={this.state.key} onChange={this.callback}>
          <TabPane tab="收货列表" key="1">
            {this.state.key=='1'&&<ReceiveGoods />}
          </TabPane>
          <TabPane tab="退货列表" key="2">
            {this.state.key=='2'&&<ReturnGoods />}
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default ChargeBackList;
