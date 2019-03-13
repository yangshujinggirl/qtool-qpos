import React, { Component } from 'react';
import { Tabs } from 'antd';
import SaleCheck from './SaleCheck';
import SeparateCheck from './SeparateCheck';
import './index.less';

const TabPane = Tabs.TabPane;

class DailyStatement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key:'1'
    }
  }
  callback=(key)=> {
    this.setState({ key })
  }
  render() {
    return(
      <div className="two-level-component-pages daily-statement-pages">
        <Tabs defaultActiveKey={this.state.key} onChange={this.callback}>
          <TabPane tab="门店销售对账" key="1">
            {this.state.key=='1'&&<SaleCheck />}
          </TabPane>
          <TabPane tab="门店分成对账" key="2">
            {this.state.key=='2'&&<SeparateCheck />}
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default DailyStatement;
