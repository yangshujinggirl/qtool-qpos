import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message} from 'antd';
import { Link } from 'dva/router';
import '../../style/dataManage.css';

//店员销售
class CommonTable extends React.Component {
    state={};

    rowClassName=(record, index)=>{
    	if (index % 2) {
      		return 'table_gray'
    	}else{
      		return 'table_white'
    	}
  	}

    onShowSizeChange=(current,size)=>{
        this.props.pageSizeChange(current,size)
    }

    pageChange=(page,pageSize)=>{
        this.props.pageChange(page,pageSize)
    }
    
    render() {
        return (
            <Table 
                bordered 
                columns={this.props.columns} 
                dataSource={this.props.dataSource} 
                rowClassName={this.rowClassName.bind(this)}
                pagination={{
                    total:Number(this.props.total),
                    current:this.props.currentPage,
                    defaultPageSize:10,
                    pageSize:this.props.pageSize,
                    showSizeChanger:true,
                    onShowSizeChange:this.onShowSizeChange,
                    onChange:this.pageChange,
                    pageSizeOptions:['10','12','15','17','20','50','100','200']
                }}
            />
        );
    }
}

function mapStateToProps(state){
   return {};
}

export default connect(mapStateToProps)(CommonTable);