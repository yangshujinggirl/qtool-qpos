import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';
import Operation from '../components/Operation/Operation.jsx';
import Header from '../components/header/Header';
import {LocalizedModal,Buttonico} from '../components/Button/Button';

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: 'age',
      dataIndex: 'age',
    }, {
      title: 'address',
      dataIndex: 'address',
    }, {
      title: 'operation',
      dataIndex: 'operation',
      render: (text, record, index) => {
        return (
          this.state.dataSource.length > 1 ?
          (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(index)}>
              <a href="#">Delete</a>
            </Popconfirm>
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
      <div style={{background:'#fff'}}>
        <Table bordered dataSource={dataSource} columns={columns} rowClassName={this.rowClassName.bind(this)}/>
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



function Returngoods() {
  return (
    <div>
     	<Header type={false} color={false}/>
     	<div className='count' style={{marginTop:'10px'}}><EditableTable/></div>
     	<div style={{marginTop:'35px'}}>
     		<div><Btncashier/></div>
     		<div className='mt20'><Operation color={true} type={false} index={true}/></div>
     	</div>
    </div> 
  );
}

function mapStateToProps(state) {
  	return {};
}

export default connect(mapStateToProps)(Returngoods);













