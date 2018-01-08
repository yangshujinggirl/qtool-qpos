import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';
import Searchinput from '../components/Searchinput/Searchinput';
import {Buttonico} from '../components/Button/Button';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select} from 'antd';
import { Link } from 'dva/router';

class DataManage extends React.Component {
    state={};

    render() {
        return (
            <div>
                <Header type={false} color={true}/>
                <div>
                    我是数据管理页面
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
   return {};
}

export default connect(mapStateToProps)(DataManage);