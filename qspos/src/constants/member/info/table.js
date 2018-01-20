
import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,Switch} from 'antd';
import { Link } from 'dva/router'
import {GetServerData} from '../../../services/services';

const title = () => '会员历史消费记录';
class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage:1,
            pageSize:10,
            windowHeight:''
        };
        this._isMounted = false;
        this.columns = [{
            title: '订单号',
            width:'12%',
            dataIndex: 'orderNo'
        }, {
            title: '结算金额',
            width:'8%',
            dataIndex: 'amount'
        },{
            title: '本次积分',
            width:'8%',
            dataIndex: 'point'
        },{
            title: '积分抵扣',
            width:'8%',
            dataIndex: 'discountPoint'
        },{
            title: '会员充值',
            width:'8%',
            dataIndex: 'cardCharge'
        },{
            title: '会员卡消费',
            width:'8%',
            dataIndex: 'cardConsume'
        },{
            title: '优惠金额',
            width:'8%',
            dataIndex: 'discountMoney'
        },{
            title: '抹零金额',
            width:'8%',
            dataIndex: 'reducAmount'
        },{
            title: '订单时间',
            width:'12%',
            dataIndex: 'createTime'
        }
    ];
    }
    rowClassName=(record, index)=>{
        if (index % 2) {
            return 'table_gray'
        }else{
            return 'table_white'
        }
    }
    
    pageChange=(page,pageSize)=>{
        this.setState({
            currentPage:page
        },function(){
            const current=Number(page)-1;
            this.props.dispatch({
               type: 'memberinfo/fetchList', 
               payload: {code:'qerp.qpos.mb.card.detail.page',values:{mbCardId:this.props.mbCardId,limit:this.state.pageSize,currentPage:current} }
            })
        });
    }
    
    //pageSize 变化的回调
    onShowSizeChange=(current, pageSize)=>{
        this.setState({
            pageSize:pageSize,
            currentPage:1
        },function(){
            this.props.dispatch({
                type: 'memberinfo/fetchList', 
                payload: {code:'qerp.qpos.mb.card.detail.page',values:{mbCardId:this.props.mbCardId,limit:pageSize,currentPage:0} }
             })

        })
        
    }

    

    windowResize = () =>{
        if(!this.refs.tableWrapper){
            return
        }else{
            this.setState({
                windowHeight:document.body.offsetHeight-565
            });
        }
    }

    render() {
        const columns = this.columns;
        return (
            <div className='member-style memberinfo-style' ref="tableWrapper">
               <Table 
                    bordered 
                    dataSource={this.props.details} 
                    columns={columns} 
                    rowClassName={this.rowClassName.bind(this)} 
                    pagination={{'total':Number(this.props.total),current:this.state.currentPage,
                    limit:this.props.limit,
                    pageSize:this.state.pageSize,showSizeChanger:true,onShowSizeChange:this.onShowSizeChange,
                    onChange:this.pageChange,pageSizeOptions:['10','12','15','17','20','50','100','200']}}
                    scroll={{y:this.state.windowHeight}}
                    title={title}
                   
               />
            </div>
        )
    }

    componentDidMount(){
        this._isMounted = true;
        if(this._isMounted){
            this.setState({
                windowHeight:document.body.offsetHeight-565
            });
            window.addEventListener('resize', this.windowResize);
        }
    }
    componentWillUnmount(){   
        this._isMounted = false;
        window.removeEventListener('resize', this.windowResize);
    }

}

function mapStateToProps(state) {
    const {details,total,mbCardId,limit} = state.memberinfo;
    return {details,total,mbCardId};
}

export default connect(mapStateToProps)(EditableTable);

