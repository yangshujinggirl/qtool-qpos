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
    this.backUrl=0;
  }
  componentWillUnmount() {
    this.setKey()
  }
  setKey() {
    let tabKey;
    console.log(this.backUrl)
    if(this.backUrl) {
      tabKey = '1';
    } else {
      tabKey = '0';
    }
    console.log(tabKey)
    this.props.dispatch({
      type:'chargeBackList/setTabKey',
      payload: tabKey
    })
  }
  callback=(key)=> {
    this.props.dispatch({
      type:'chargeBackList/setTabKey',
      payload:key
    })
  }
  getBackUrl=(val)=>{
    this.backUrl=val;
  }
  render() {
    const { tabKey } =this.props.chargeBackList;
    return(
      <div className="two-level-component-pages charge-backList-pages">
        <Tabs defaultActiveKey={tabKey} onChange={this.callback}>
          <TabPane tab="收货列表" key="0">
            {tabKey=='0'&&<ReceiveGoods backUrl={this.getBackUrl}/>}
          </TabPane>
          <TabPane tab="退货列表" key="1">
            {tabKey=='1'&&<ReturnGoods backUrl={this.getBackUrl}/>}
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
