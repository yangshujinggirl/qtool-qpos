import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import ReceiveGoods from './ReceiveGoods';
import ReturnGoods from './ReturnGoods';
import './index.less';

const TabPane = Tabs.TabPane;

class ChargeBackList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey:'1'
    }
  }
  componentWillUnmount() {
    console.log(this.props)
    console.log('222222222222')
  }
  callback=(key)=> {
    this.props.dispatch({
      type:'chargeBackList/setTabKey',
      payload:key
    })
  }
  render() {
    const { tabKey } =this.props.chargeBackList;
    return(
      <div className="two-level-component-pages charge-backList-pages">
        <Tabs defaultActiveKey={tabKey} onChange={this.callback}>
          <TabPane tab="收货列表" key="1">
            {tabKey=='1'&&<ReceiveGoods />}
          </TabPane>
          <TabPane tab="退货列表" key="2">
            {tabKey=='2'&&<ReturnGoods />}
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
function mapStateToProps(state) {
    const { chargeBackList } = state;
    return { chargeBackList };
}
export default connect(mapStateToProps)(ChargeBackList);
