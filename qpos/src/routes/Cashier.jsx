import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';
import Operation from '../components/Operation/Operation.jsx';
import Header from '../components/header/Header';
import {LocalizedModal,Buttonico} from '../components/Button/Button';

const inputwidth={
    width:'90px',
    height:'30px',
    border:'1px solid #E7E8EC',
    background: '#FFF'
}
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '序号',
      dataIndex: 'age',
    }, {
      title: '商品条码',
      dataIndex: 'address1'
    }, {
      title: '商品名称',
      dataIndex: 'address2'
    },{
      title: '规格',
      dataIndex: 'address3'
    },{
      title: '零售价',
      dataIndex: 'address4'
    },{
      title: '数量',
      dataIndex: 'address5',
      render: (text, record, index) => {
        return (
          this.state.dataSource.length > 0 ?
          (
            <Input style={inputwidth}/>
          ) : null
        );
      }
    },{
      title: '折扣',
      dataIndex: 'address6',
      render: (text, record, index) => {
        return (
          this.state.dataSource.length > 0 ?
          (
            <Input style={inputwidth}/>
          ) : null
        );
      }
    },{
      title: '折后价',
      dataIndex: 'operation7',
      render: (text, record, index) => {
        return (
          this.state.dataSource.length > 0 ?
          (
            <Input style={inputwidth}/>
          ) : null
        );
      },
    }];

    this.state = {
      dataSource: [{
        key: '0',
        name: 'Edward King 0',
        age: '32',
        address: 'London, Park Lane no. 0',
      }, {
        key: '1',
        name: 'Edward King 1',
        age: '32',
        address: 'London, Park Lane no. 1',
      },{
        key: '2',
        name: 'Edward King 1',
        age: '32',
        address: 'London, Park Lane no. 1',
      },{
        key: '3',
        name: 'Edward King 0',
        age: '32',
        address: 'London, Park Lane no. 0',
      }, {
        key: '4',
        name: 'Edward King 1',
        age: '32',
        address: 'London, Park Lane no. 1',
      },{
        key: '5',
        name: 'Edward King 1',
        age: '32',
        address: 'London, Park Lane no. 1',
      },{
        key: '6',
        name: 'Edward King 0',
        age: '32',
        address: 'London, Park Lane no. 0',
      }, {
        key: '7',
        name: 'Edward King 1',
        age: '32',
        address: 'London, Park Lane no. 1',
      },{
        key: '8',
        name: 'Edward King 1',
        age: '32',
        address: 'London, Park Lane no. 1',
      },{
        key: '9',
        name: 'Edward King 0',
        age: '32',
        address: 'London, Park Lane no. 0',
      }, {
        key: '10',
        name: 'Edward King 1',
        age: '32',
        address: 'London, Park Lane no. 1',
      },{
        key: '11',
        name: 'Edward King 1',
        age: '32',
        address: 'London, Park Lane no. 1',
      }],
      count: 2,
    };
  }
  rowClassName=(record, index)=>{
    	if (index % 2) {
      		return 'table_gray'
    	}else{
      		return 'table_white'
    	}
  	}
  onCellChange = (index, key) => {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = value;
      this.setState({ dataSource });
    };
  }
  onDelete = (index) => {
    const dataSource = [...this.state.dataSource];
    dataSource.splice(index, 1);
    this.setState({ dataSource });
  }
 
  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <div>
        <Table bordered dataSource={dataSource} columns={columns} rowClassName={this.rowClassName.bind(this)}  pagination={false}/>
      </div>
    );
  }
}


class Btncashier extends React.Component {
	 render() {
	 	return(
	 		<div className='clearfix' style={{padding:'0 30px'}}>
	 			<div className='btn fr ml20'><Buttonico text='移除商品F3'/></div>
	 			<div className='btn fr ml20'><Buttonico text='取单F2'/></div>
	 			<div className='btn fr'><Buttonico text='挂单F1'/></div>
	 		</div>
	 		)
	 }

}

function Cashier() {
  return (
    <div>
     	<div><Header type={true} color={true}/></div>
     	<div className='count'><EditableTable/></div>
     	<div className='mt30'>
     		<div><Btncashier/></div>
     		<div className='mt20'><Operation color={true} type={false} index={true}/></div>
     	</div>
    </div> 
  );
}

function mapStateToProps(state) {
  	return {};
}

export default connect(mapStateToProps)(Cashier);













