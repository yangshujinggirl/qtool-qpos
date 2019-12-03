import React, { Component } from 'react';
import { Modal, Table } from 'antd';
import './index.less';

const columns = [{
			title:'会员名称',
			dataIndex: 'name',
			key: 'name',
      width:'40%',
	},{
			title:'可用积分',
			dataIndex: 'point',
			key: 'point',
      width:'40%',
	}]

class ToggleVipModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys:[]
    }
  }
  componentWillReceiveProps(props) {
    console.log('componentWillReceiveProps')
  }
  //选择会员
	checkChange=(selectedRowKeys, selectedRows)=> {
		let cardNoMobile = selectedRows[0].cardNo;
		this.props.validateToggle(cardNoMobile,'cardNo')
		this.props.dispatch({
			type:'cashierManage/fetchMemberInfo',
			payload:{ cardNoMobile }
		})
		this.props.onCancel();
	}
  render(){
    const { visible, dataSource } =this.props;
    let selectedRowKeys = dataSource.findIndex((value, index, arr) => {
      return value.cardNo == this.props.memberInfo.cardNo
    })
    const rowSelection={
			onChange:this.checkChange,
			type:'radio',
			selectedRowKeys:[selectedRowKeys]
		};

    return(
      <Modal
        title="切换会员"
        visible={visible}
        onCancel={()=>this.props.onCancel()}
        width={420}
        closable={true}
        className="toggle-modal-wrap"
        footer={null}>
        <div className="main-content">
          <Table
            className="member-table"
            bordered
            pagination={false}
            rowSelection={rowSelection}
            dataSource={dataSource}
            columns={columns}
            scroll={{ y: 200 }}/>
        </div>
      </Modal>
    )
  }
}

export default ToggleVipModal;
