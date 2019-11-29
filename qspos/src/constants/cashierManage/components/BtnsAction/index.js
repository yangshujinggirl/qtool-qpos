import React, { Component } from 'react';
import { Button, Select } from 'antd';
import { connect } from 'dva';
import './index.less';

class BtnsAction extends Component {
  handleSelect() {

  }
  render() {
    const { activityOptions, selectedActivityId } =this.props;
    console.log(activityOptions);
    return(
      <div className="handle-actions">
        {
          activityOptions.length>0&&
          <div className="handle-lt">
            该商品正在参与促销活动，点击右侧选框可切换活动：
            <Select
              className="activity-list-select"
              value={selectedActivityId}
              onSelect={this.handleSelect}>
              <Select.Option value="0" key="0">不参与活动</Select.Option>
              {
                activityOptions.map((el,index) => (
                  <Select.Option
                    value={el.activityId}
                    key={el.activityId}>{el.name}</Select.Option>
                ))
              }
            </Select>
          </div>
        }
        <div className="handle-rt">
          <Button>挂单F2</Button>
          <Button>取单F3</Button>
          <Button>移除商品F4</Button>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
    const { cashierManage } = state;
    return cashierManage;
}
export default connect(mapStateToProps)(BtnsAction);
