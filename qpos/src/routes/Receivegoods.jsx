import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';
import Operation from '../components/Operation/Operation.jsx';
import Header from '../components/header/Header';
import {LocalizedModal,Buttonico} from '../components/Button/Button';
import {GetServerData} from '../services/services';

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
      dataIndex: 'index',
      render: (text, record, index) => {
        return (
          this.state.dataSource.length > 0 ?
          (
            <div>{index+1}</div>
          ) : null
        );
      }

    }, {
      title: '商品条码',
      dataIndex: 'barcode'
    }, {
      title: '商品名称',
      dataIndex: 'name'
    },{
      title: '规格',
      dataIndex: 'displayName'
    },{
      title: '代收数量',
      dataIndex: 'unReceiveQty'
    },{
      title: '本次数量',
      dataIndex: 'receiveQty',
      render: (text, record, index) => {
        return (
          this.state.dataSource.length > 0 ?
          (
            <Input style={inputwidth}/>
          ) : null
        );
      }
    },{
      title: '零售价',
      dataIndex: 'toCPrice'
    }];

    this.state = {
      dataSource: [],
      count: 2,
      ispdOrder:false
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
 
 //配货单号请求数据生成datasouce
  revisedata=(messages)=>{
        const result=GetServerData('qerp.pos.pd.phorder.info',messages)
                result.then((res) => {
                  return res;
                }).then((json) => {
                    console.log(json)
                    if(json.code=='0'){
                       this.setState({
                         dataSource:json.pdOrderDetails,
                         ispdOrder:true
                       })
                    }else{  
                        
                    }
                })

  }
//条码请求数据生成datasouce
barcoderevisedata=(messages)=>{
    const ispdOrders=this.state.ispdOrder
    if(ispdOrders){
    //遍历table中的数据，对收货数量进行更改，把当前扫描的移动到table第一条
        let datasouces=this.state.dataSource
        for(var i=0;i<datasouces.length;i++){
            if(datasouces[i].pdSpuId==pdspu.pdSpuId && Number(datasouces[i].receiveQty)<Number(datasouces[i].unReceiveQty)){
                datasouces[i].receiveQty=Number(datasouces[i].receiveQty)+1
                let str = datasouces.splice(i,1); //删除当前
                datasouces.unshift(str[0]); //把这个元素添加到开头
            }else{
                    console.log('这个条码已经收满')
                }
        }
    }else{
    //根据条码请求数据，结合table中已经存在的数据，生成datasouce
        const result=GetServerData('qerp.pos.pd.spu.find',messages)
            result.then((res) => {
                return res;
            }).then((json) => {
            console.log(json)
            if(json.code=='0'){
                    //根据当前table中的条码datasouce生成新的datasouce

                    
                    }else   {  
                     console.log(code.message)   
                
                }


            })

    }

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






class Receivegoods extends React.Component {
    tabledataset=(messages)=>{
        const revisedata=this.refs.table.revisedata
        revisedata(messages)
    }
    barcoderevisedata=(messages)=>{
        const revisedata=this.refs.table.barcoderevisedata
        revisedata(messages)
    }


    render(){
        return(
                <div style={{height:'100%',display:'flex','flex-direction':'column',}}>
                    <div>
                        <Header type={true} color={true}/>
                    </div>       
                    <div className='count'>
                        <EditableTable ref='table'/>
                    </div>       
                    <div className='mt30'>        
                        <div className='mt20'>
                            <Operation color={true} type={true} index={false} 
                                tabledataset={this.tabledataset.bind(this)} 
                                barcoderevisedata={this.barcoderevisedata.bind(this)}
                                />
                        </div> 
                    </div>
                </div> 
            )
    }
}



function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(Receivegoods);














