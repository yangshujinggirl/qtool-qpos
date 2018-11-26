import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select, Spin} from 'antd';
import '../style/goodsManage.css';
import GoodsIndex from '../constants/goods/index.js';

class Goods extends React.Component {
    render() {
        return (
            <div className="common-pages-wrap">
              <Spin tip="加载中" spinning={this.props.spinLoad.loading}>
                <GoodsIndex {...this.props}/>
              </Spin>
            </div>
        );
    }
}

function mapStateToProps(state){
  const { spinLoad } = state;
  return { spinLoad };
}

export default connect(mapStateToProps)(Goods);
