
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
            pageSize:localStorage.getItem("pageSize")==null?10:Number(localStorage.getItem("pageSize")),
            windowHeight:''
        };
        this.columns = [{
            title: '序号',
            dataIndex: 'index',
            width:'8%'
        }, {
            title: '订单号',
            width:'10%',
            dataIndex: 'orderNo'
        }, {
            title: '结算金额',
            width:'10%',
            dataIndex: 'amount'
        },{
            title: '本次积分',
            width:'10%',
            dataIndex: 'point'
        },{
            title: '积分抵扣',
            width:'10%',
            dataIndex: 'discountPoint'
        },{
            title: '会员充值',
            width:'10%',
            dataIndex: 'cardCharge'
        },{
            title: '会员卡消费',
            width:'10%',
            dataIndex: 'cardConsume'
        },{
            title: '优惠金额',
            width:'10%',
            dataIndex: 'discountMoney'
        },{
            title: '抹零金额',
            width:'10%',
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
    hindchange=(page)=>{
        let limitSize = localStorage.getItem('pageSize');
        this.props.dispatch({ type: 'member/fetch', payload: {code:'qerp.pos.mb.card.query',values:{keywords:'',limit:limitSize,currentPage:page.current-1}} });
    }
    pageChange=(page,pageSize)=>{
        this.setState({
            currentPage:page
        },function(){
            const current=Number(page)-1;
            this.props.pagefresh(current,this.state.pageSize)
        });
    }
    
    //pageSize 变化的回调
    onShowSizeChange=(current, pageSize)=>{
        this.setState({
            pageSize:pageSize,
            currentPage:1
        },function(){
             localStorage.setItem("pageSize", pageSize); 
            this.props.pagefresh(0,pageSize)
        })
        
    }

    //初始化页码
    initPageCurrent = (currentPage) =>{
        this.setState({
            currentPage:currentPage
        });
    }

    windowResize = () =>{
       this.setState({
        windowHeight:document.body.offsetHeight-300
       });
    }

    render() {
        const columns = this.columns;
        return (
            <div className='member-style memberinfo-style'>
               <Table 
                    bordered 
                    dataSource={this.props.details} 
                    columns={columns} 
                    rowClassName={this.rowClassName.bind(this)} 
                    pagination={{'total':Number(this.props.total),current:this.state.currentPage,
                    pageSize:this.state.pageSize,showSizeChanger:true,onShowSizeChange:this.onShowSizeChange,
                    onChange:this.pageChange,pageSizeOptions:['10','12','15','17','20','50','100','200']}}
                    scroll={{y:this.state.windowHeight}}
                    title={title}
                   
               />
            </div>
        )
    }

    componentDidMount(){
        this.setState({
           windowHeight:document.body.offsetHeight-300
         });
        window.addEventListener('resize', this.windowResize);    
    }
    componentWillUnmount(){   
        window.removeEventListener('resize', this.windowResize);
    }

}

function mapStateToProps(state) {
    const {details} = state.memberinfo;
    return {details};
}

export default connect(mapStateToProps)(EditableTable);

