import React, { Component } from 'react';
import { Button, Select } from 'antd';
import './index.less';

class BtnsAction extends Component {
  render() {
    let currentActivityList=[];
    return(
      <div className="handle-actions">
        <div className="handle-lt">
          该商品正在参与促销活动，点击右侧选框可切换活动：
          <Select
            className="activity-list-select">
            <Option value="0" key="0">不参与活动</Option>
            {
              currentActivityList.map((el,index) => (
                <Option value={el.activityId} key={el.activityId}>{el.name}</Option>
              ))
            }
          </Select>
        </div>
        <div className="handle-rt">
          <Button>挂单F2</Button>
          <Button>取单F3</Button>
          <Button>移除商品F4</Button>
        </div>
      </div>
    )
  }
}
export default BtnsAction;
