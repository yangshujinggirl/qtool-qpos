import React, { Component } from 'react';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,Switch} from 'antd';
import { Link } from 'dva/router';
import {GetServerData} from '../../../services/services';
import {Gettime} from '../../../services/data';
import './AddEditModal.less';


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const batrhdata=Gettime()

//宝宝生日table
class EditableTablebaby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        dataSource: this.props.mbCardBirths,
        count: 2,
        type:this.props.type,
        checked:this.props.checked,
    };
    this.columns = [{
        title: 'year',
        dataIndex: 'year',
        render: (text, record, index) => (
          <div>
            <Select
              style={{ width: 78 }}
              onChange={(value)=>this.dateChange(index,value,'year')}
              value={this.state.dataSource[index].year}>
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
              value={this.state.dataSource[index].month}>
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
              value={this.state.dataSource[index].day}>
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
  componentWillReceiveProps(props) {
    this.setState({
      dataSource: props.mbCardBirths,
      type: props.type,
      checked: props.checked
    })
  }
  //增加
  handleAdd = () => {
    const { count, dataSource } = this.state;
    if(dataSource.length>5 || dataSource.length==5){
        message.warning('宝宝生日最多可以添加5条',1)
        return
    }
    const newData = {
            key: count,
            year:'',
            month:'',
            day:'',
            type:this.state.type
        };
    this.setState({
        dataSource: [...dataSource, newData],
        count: count+1,
    },()=>{
        this.props.receivebabydata(this.state.dataSource)
    });
  }
  //公历切换
  SwitchChange=(checked)=>{
    var ds=this.state.dataSource;
    let type;
    if(checked){
      ds.map((el,index) => el.type = 1);
      type = 1;
    }else{
      ds.map((el,index) => el.type = 2);
      type = 2;
    }
    this.setState({
      dataSource:ds,
      type,
      checked:checked
    },()=>{
      this.props.receivebabydata(this.state.dataSource)
    })
  }
  //日期change事件，值回填
  dateChange(index,value,type) {
    let ds=this.state.dataSource;
    if(type == 'year') {
      ds[index].year=value
    } else if(type == 'month') {
      ds[index].month=value
    } else if(type == 'day') {
      ds[index].day=value
    }
    this.setState({
        dataSource:ds,
    })
    this.props.receivebabydata(ds)
  }
  render() {
    const { dataSource, checked } = this.state;
    const columns = this.columns;
    return (
      <div className='clearfix birthday' style={{width:'340px'}}>
        <div className='fl babytablesbox'>
          <Table
            bordered
            dataSource={this.state.dataSource}
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

class Modelform extends Component {
  constructor(props) {
    super(props);
    this.babydatasouces=[]
  }
  MemberonChange = (e) => {
    this.props.form.setFieldsValue({
      role: e.target.value,
    });
  }
  //取消
  handleCancel = () => {
    this.props.handleCancel()
    this.props.form.resetFields()
  }
  //确认保存
  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.mbCardBirths=this.babydatasouces;
        var babydatatattu=values.mbCardBirths.every(function(item,index){
          return  (item.year==null && item.month===null && item.day===null) || (item.year!=null && item.month!=null && item.day!=null)
        })
        if(babydatatattu){
          this.props.handleOk(values,this.handleCancel)
        }else{
          message.warning('生日信息不全')
        }
      }
    })
  }
  receivebabydata=(dataSource)=>{
    this.babydatasouces=dataSource
  }
  render() {
    const { getFieldDecorator,getFieldInstance,getFieldProps } = this.props.form;
    const { name, mobile, cardNo, level, amount, point, mbCardBirths, type, checked} = this.props.data;
    return (
      <div className="member-list-pages">
        <Modal
          className="member-width-style member-modal-wrap add-member-modal"
          title={this.props.texts}
          visible={this.props.visible}
          // visible={true}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
          width={this.props.width+'px'}
          closable={false}
          width={500}
          footer={<div className="handle-btn-lists">
            <Button onClick={this.handleCancel.bind(this)}>
              取消
              <span className="lines"></span>
            </Button>
            <Button onClick={this.handleOk.bind(this)} loading={this.props.loading}>确定</Button>
          </div>}>
            <Form className='formdis member-form-wrap'>
              {
                !this.props.mbCardId?
                null
                :
                <FormItem
                  label="会员卡号"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 16 }}>
                    {getFieldDecorator('cardNo', {
                        initialValue: cardNo,
                        rules: [{ required: true, message: '请输入1-5位会员姓名' }],
                    })(

                        <Input placeholder="请输入1-5位会员姓名" className='inputwidth' autoComplete="off" disabled/>
                    )}
                </FormItem>
              }
              <FormItem
                label="会员姓名"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}>
                  {getFieldDecorator('name', {
                      initialValue: name,
                      rules: [{ required: true, message: '请输入1-5位会员姓名' }],
                  })(

                      <Input placeholder="请输入1-5位会员姓名" className='inputwidth' autoComplete="off"/>
                  )}
              </FormItem>
              <FormItem
                label="会员电话"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}>
                  {getFieldDecorator('mobile', {
                      initialValue: mobile,
                      rules: [{ required: true, message: '请输入11位手机号' }],
                  })(
                      <Input placeholder="请输入11位手机号" className='inputwidth' autoComplete="off" />
                  )}
              </FormItem>
              <FormItem
                label="宝宝生日"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                className='listform'>
                    <EditableTablebaby
                      dispatch={this.props.dispatch}
                      mbCardBirths={mbCardBirths}
                      mbCardId={this.props.mbCardId}
                      type={type}
                      checked={checked}
                      receivebabydata={this.receivebabydata.bind(this)}/>
              </FormItem>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                label="会员级别"
                className='listform'>
                  {getFieldDecorator('level', {
                      initialValue: Number(level)
                  })(
                      <RadioGroup onChange={this.MemberonChange.bind(this)}>
                          <Radio value={1}>金卡</Radio>
                          <Radio value={2}>银卡</Radio>
                          <Radio value={3}>普卡</Radio>
                      </RadioGroup>
                  )}
              </FormItem>
              {
                !this.props.mbCardId?
                null
                :
                <FormItem
                  label="账户金额"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 16 }}
                  className='listform'>
                    {getFieldDecorator('amount', {
                        initialValue: Number(amount)
                    })(
                        <Input className='inputwidth teinput' disabled  autoComplete="off"/>
                    )}
                </FormItem>
              }
              {
                !this.props.mbCardId?
                null
                :
                <FormItem
                  label="会员积分"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 16 }}
                  className='listform'>
                    {getFieldDecorator('point', {
                        initialValue: Number(point)
                    })(
                        <Input className='inputwidth teinput' disabled  autoComplete="off"/>
                    )}
                </FormItem>
               }
            </Form>
        </Modal>
      </div>
    );
  }
}

const AddEditModal=Form.create()(Modelform);

export default AddEditModal;
