import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message} from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';

//店员销售
class ClerkSale extends React.Component {
    state={};

    render() {
        return (
            <div>
                我是店员销售内容
            </div>
        );
    }
}

function mapStateToProps(state){
   return {};
}

export default connect(mapStateToProps)(ClerkSale);