import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message} from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';

//利润报表
class ProfitReport extends React.Component {
    state={};

    render() {
        return (
            <div>
                我是利润报表内容
            </div>
        );
    }
}

function mapStateToProps(state){
   return {};
}

export default connect(mapStateToProps)(ProfitReport);