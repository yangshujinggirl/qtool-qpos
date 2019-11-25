import React, { Component } from 'react';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,Switch} from 'antd';
import { Link } from 'dva/router';
import {GetServerData} from '../../../services/services';
import {Gettime} from '../../../services/data';
import './AddEditModal.less';
import BabyBirth from './BabyBirth';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const batrhdata=Gettime()

let levelMap={
  1:'金卡',
  2:'银卡',
  3:'普卡',
}
class Modelform extends Component {
  constructor(props) {
    super(props);
    this.babydatasouces=[];
  }
  //取消
  handleCancel = () => {
    this.babydatasouces=[]
    this.props.handleCancel()
    this.props.form.resetFields()
  }
  //确认保存
  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let babeBirthList = JSON.parse(JSON.stringify(this.props.data.mbCardBirths));
        babeBirthList.map((el,index) => {
          if(el.year==null && el.month==null && el.day==null) {
            babeBirthList.splice(index,1);
          };
        })
        babeBirthList&&babeBirthList.map((el,index) => el.key=index)
        let validData = babeBirthList;
        var isFull=validData.every(function(item,index){
          return  (item.year!='' && item.month!='' && item.day!='')&&(item.year!=null && item.month!=null && item.day!=null);
        })
        validData = validData.filter((item) => {
          return (item.year!='' && item.month!='' && item.day!='')
        })
        if(isFull){
          if(validData&&validData.length>0) {
            values.mbCardBirths=validData;
          }
          values={...values,level:3}
          this.props.handleOk(values,this.handleCancel);
        }else{
          message.warning('生日信息不全');
        }
      }
    })
  }

  receivebabydata=(checked,dataSource)=>{
    this.babydatasouces=dataSource;
    this.props.upDateDetail({mbCardBirths:dataSource,checked})
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { name, mobile, cardNo, level, amount, point, mbCardBirths, type, checked} = this.props.data;
    return (
      <Modal
        className="member-width-style member-modal-wrap add-member-modal"
        title={this.props.texts}
        visible={this.props.visible}
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
                  <BabyBirth
                    form={this.props.form}
                    dataSource={mbCardBirths}
                    mbCardId={this.props.mbCardId}
                    type={type}
                    checked={checked}
                    receivebabydata={this.receivebabydata.bind(this)}/>
            </FormItem>
            {
              this.props.mbCardId?
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                label="会员级别"
                className='listform'>
                  {levelMap[level]}
              </FormItem>
              :
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                label="会员级别"
                className='listform'>
                  {getFieldDecorator('level', {
                      initialValue: 3
                  })(
                      <RadioGroup>
                        {/*  <Radio value={1}>金卡</Radio>
                      <Radio value={2}>银卡</Radio>*/}
                          <Radio value={3}>普卡</Radio>
                      </RadioGroup>
                  )}
                  <span className="ant-form-text">初始会员均默认为“普卡”等级，不可修改</span>
              </FormItem>
            }
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
    );
  }
}

const AddEditModal=Form.create()(Modelform);

export default AddEditModal;
