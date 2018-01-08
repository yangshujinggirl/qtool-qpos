import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message} from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';

//进销存报表
class InOutReport extends React.Component {
    state={};

    render() {
        return (
            <div>
                我是进销存报表内容
            </div>
        );
    }
}

function mapStateToProps(state){
   return {};
}

export default connect(mapStateToProps)(InOutReport);