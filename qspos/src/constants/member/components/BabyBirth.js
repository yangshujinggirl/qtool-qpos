import React, { Component } from 'react';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,Switch} from 'antd';
import { Link } from 'dva/router';
import {GetServerData} from '../../../services/services';
import {Gettime} from '../../../services/data';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const batrhdata=Gettime()

//宝宝生日table
class EditableTablebaby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        count: 2,
    };
    this.columns = [{
        title: 'year',
        dataIndex: 'year',
        render: (text, record, index) => (
          <div>
            <Select
              style={{ width: 78 }}
              onChange={(value)=>this.dateChange(index,value,'year')}
              value={record.year}>
              {
                batrhdata.year.map((item,index)=>{
                    return (<Option  key={index} value={item}>{item}</Option>)
                })
              }
            </Select>
            <span  className="textplace">年</span>
          </div>
        ),
      }, {
        title: 'month',
        dataIndex: 'month',
        width: '30%',
        render: (text, record, index) => (
          <div>
            <Select
              style={{ width: 62 }}
              onChange={(value)=>this.dateChange(index,value,'month')}
              value={record.month}>
              {
                batrhdata.month.map((item,index)=>{
                    return (<Option  key={index} value={item}>{item}</Option>)
                })
              }
            </Select>
            <span className="textplace">月</span>
          </div>
        )
      }, {
        title: 'day',
        dataIndex: 'day',
        width: '30%',
        render: (text, record, index) => (
           <div>
            <Select
              style={{ width: 62 }}
              onChange={(value)=>this.dateChange(index,value,'day')}
              value={record.day}>
              {
                batrhdata.day.map((item,index)=>{
                    return (<Option  key={index} value={item}>{item}</Option>)
                })
              }
            </Select>
            <span className="textplace">日</span>
          </div>
        )
      }];
  }
  //增加
  handleAdd = () => {
    let { dataSource } =this.props;
    let count = dataSource.length;
    if(dataSource.length>5 || dataSource.length==5){
        message.warning('宝宝生日最多可以添加5条',1)
        return
    }
    const newData = {
            key: count,
            year:null,
            month:null,
            day:null,
            type:this.props.checked?1:2
        };
        dataSource = [...dataSource, newData];
    this.setState({
        count: count+1,
    });
    this.props.receivebabydata(this.props.checked,dataSource)
  }
  //公历切换
  SwitchChange=(checked)=>{
    let ds=this.props.dataSource;
    let type;
    if(checked){
      ds.map((el,index) => el.type = 1);
    }else{
      ds.map((el,index) => el.type = 2);
    }
    this.props.receivebabydata(checked,ds)
  }
  //日期change事件，值回填
  dateChange(index,value,type) {
    let ds=this.props.dataSource;
    if(type == 'year') {
      ds[index].year=value
    } else if(type == 'month') {
      ds[index].month=value
    } else if(type == 'day') {
      ds[index].day=value
    }
    this.props.receivebabydata(this.props.checked,ds)
  }
  render() {
    const { dataSource, checked } = this.props;
    const columns = this.columns;
    return (
      <div className='clearfix birthday' style={{width:'340px'}}>
        <div className='fl babytablesbox'>
          <Table
            bordered
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            showHeader={false}
            bordered={false}
            className='babytables'/>
        </div>
        <div className='fl clearfix' style={{width:'86px'}}>
          <div
            onClick={this.handleAdd}
            className='fl mr8 ml8 themecolor '
            style={{height:'40px',lineHeight:'40px'}}>
            <Icon type="plus-circle-o" />
          </div>
          <div className='fl' style={{width:'54px',height:'40ox',lineHeight:'36px'}}>
            <Switch
              checkedChildren="公历"
              unCheckedChildren="农历"
              onChange={this.SwitchChange.bind(this)}
              checked={checked}/>
          </div>
        </div>
      </div>
    );
  }
}

export default EditableTablebaby;
