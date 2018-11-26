import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select, Spin} from 'antd';
import '../style/goodsManage.css';
import GoodsIndex from '../constants/goods/index.js';

class Goods extends React.Component {
    pagefresh=(currentPage,pagesize)=>{
        const pagefreshs=this.refs.search.pagefresh
        pagefreshs(currentPage,pagesize)
    }

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
