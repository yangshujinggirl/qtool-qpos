import React, { Component } from 'react';
import { Tabs } from 'antd';
import ActivityList from './ActivityList';
import Header from '../../components/Qheader';
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
      <div className="activity-statement-pages">
        <Header type={false} color={true} />
        <div className="content-wrap">
          <Tabs type="card" defaultActiveKey={this.state.key} onChange={this.callback}>
            <TabPane tab="pos促销活动" key="1">
              {this.state.key=='1'&&<ActivityList activityType={1}/>}
            </TabPane>
            <TabPane tab="App促销活动" key="2">
              {this.state.key=='2'&&<ActivityList  activityType={2}/>}
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default DailyStatement;
