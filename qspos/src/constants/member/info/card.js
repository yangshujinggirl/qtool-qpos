
import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,Switch,Card} from 'antd';
import { Link } from 'dva/router'
import {GetServerData} from '../../../services/services';

class Cardlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           
        };
    }
   
   

    render() {
        console.log(this.props.cardlist)
        return (
            <div className='mbindocard'>
               <Card title="会员基本信息" noHovering={true}>
                    <div className='cardlist'>
                        {
                            this.props.cardlist.map((item,index)=>{
                                return (<div className='cardlist_item' key={index}><label>{item.lable}：</label><span>{item.text}</span></div>)
                            })
                        }
                    </div>
                </Card>
            </div>
        )
    }
}

export default Cardlist;




