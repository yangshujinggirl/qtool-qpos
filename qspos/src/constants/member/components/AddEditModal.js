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
        dataSource: [{
            key: 0,
            year: '',
            month: '',
            day: '',
            type:'1'
        }],
        count: 2,
        type:1,
        checked:true,
    };
    this.columns = [{
        title: 'year',
        dataIndex: 'year',
        render: (text, record, index) => (
            <div>
                <Select  style={{ width: 78 }} onChange={this.yearhandleChange.bind(this,index)} value={this.state.dataSource[index].year}>
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
                onChange={this.monthhandleChange.bind(this,index)}
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
                  onChange={this.dayhandleChange.bind(this,index)}
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
  componentDidMount(){
      this.memberdata()
  }
  handleAdd = () => {
    if(this.state.dataSource.length>5 || this.state.dataSource.length==5){
        message.warning('宝宝生日最多可以添加5条')
        return
    }
    const { count, dataSource } = this.state;
    const newData = {
        key: count,
        year:'',
        month:'',
        day:'',
        type:this.state.type
    };
    this.setState({
        dataSource: [...dataSource, newData],
        count: count + 1,
    },function(){
        this.props.receivebabydata(this.state.dataSource)
    });
  }
  SwitchChange=(checked)=>{
      const dispatch=this.props.dispatch
      if(checked){
          var ds=this.state.dataSource
          for(var i=0;i<ds.length;i++){
              ds[i].type=1
          }
          this.setState({
              dataSource:ds,
              type:1,
              checked:checked
          },function(){
              this.props.receivebabydata(this.state.dataSource)
          })
      }else{
          var ds=this.state.dataSource
          for(var i=0;i<ds.length;i++){
              ds[i].type=2
          }
          this.setState({
              dataSource:ds,
              type:2,
              checked:checked
          },function(){
              this.props.receivebabydata(this.state.dataSource)
          })
      }
  }
  yearhandleChange=(index,value)=>{
      const dispatch=this.props.dispatch
      let ds=this.state.dataSource
      ds[index].year=value
      this.setState({
          dataSource:ds,
      },function(){
          this.props.receivebabydata(this.state.dataSource)
      })
  }
  monthhandleChange=(index,value)=>{
      let ds=this.state.dataSource
      const dispatch=this.props.dispatch
      ds[index].month=value
      this.setState({
          dataSource:ds,
      },function(){
          this.props.receivebabydata(this.state.dataSource)
      })
  }
  dayhandleChange=(index,value)=>{
      const dispatch=this.props.dispatch
      let ds=this.state.dataSource
      ds[index].day=value
      this.setState({
          dataSource:ds,

      },function(){
          this.props.receivebabydata(this.state.dataSource)
      })
  }
  //数据请求
  memberdata=()=>{
      this.props.receivebabydata(this.state.dataSource)
      if(this.props.type==false){
          const mbCardId=this.props.mbCardId
          let values={mbCardId:mbCardId}
          const result=GetServerData('qerp.pos.mb.card.info',values)
              result.then((res) => {
                return res;
              }).then((json) => {
                  if(json.code=='0'){
                      let mbCardInfo=json.mbCardInfo.mbCardBirths
                      if(mbCardInfo.length>0){
                          const barthtype=mbCardInfo[0].type
                          for(var i=0;i<mbCardInfo.length;i++){
                              mbCardInfo[i].key=i
                          }
                          if(barthtype=='1'){
                              this.setState({
                                  type:1,
                                  dataSource:mbCardInfo,
                                  checked:true

                              },function(){
                                  this.props.receivebabydata(this.state.dataSource)
                              })
                          }
                          if(barthtype=='2'){
                              this.setState({
                                  type:2,
                                  dataSource:mbCardInfo,
                                   checked:false
                              },function(){
                                  this.props.receivebabydata(this.state.dataSource)
                              })
                         }
                      }else{
                              this.setState({
                                  type:1,
                                  dataSource:[
                                      {
                                          year:null,
                                          month:null,
                                          day:null,
                                          key:-1,
                                          type:1,
                                      }
                                          ],
                                  checked:true
                              },function(){
                                  this.props.receivebabydata(this.state.dataSource)
                              })

                      }

                  }else{
                      this.props.receivebabydata(this.state.dataSource)
                  }
              })
      }else{
          this.setState({
                  type:1,
                  dataSource:[
                      {
                          year:null,
                          month:null,
                          day:null,
                          key:-1,
                          type:1
                      }
                          ],
                  checked:true
              },function(){
                   this.props.receivebabydata(this.state.dataSource)
          })
      }


  }
  render() {
    const { dataSource } = this.state;
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
          <div onClick={this.handleAdd} className='fl mr8 ml8 themecolor ' style={{height:'40px',lineHeight:'40px'}}>
            <Icon type="plus-circle-o" />
          </div>
          <div className='fl' style={{width:'54px',height:'40ox',lineHeight:'36px'}}>
            <Switch
              checkedChildren="公历"
              unCheckedChildren="农历"
              onChange={this.SwitchChange.bind(this)}
              checked={this.state.checked}/>
          </div>
        </div>
      </div>
    );
  }
}
class Modelform extends Component {
  constructor(props) {
      super(props);
      this.state = {
          visible: false,
          membervalue: 1,
          accountvalue:1,
          mbCardBirths:[],
          key:0,
          visiblesure:false,
          cardNo:null
      },
      this.babydatasouces=[]
  }
  MemberonChange = (e) => {
      this.props.form.setFieldsValue({
          role: e.target.value,
      });
  }
  showModal = () => {
      this.setState({
          visible: true
      },function(){
          this.memberinit()
      });
  }
  hideModal = () => {
      this.setState({
          visible: false,
      });
      this.props.form.resetFields()
  }
  handleCancel = () => {
      this.setState({ visible: false });
      this.props.form.resetFields()
  }
  //新建会员点击确定按钮执行方法
  hindokNewmember=()=>{
      let limitSize = localStorage.getItem('pageSize');
      this.props.dispatch({
           type:'member/fetch',
           payload: {code:'qerp.pos.mb.card.query',values:{keywords:'',limit:limitSize,currentPage:0}}
       });
      //重置页码为第一页
      this.props.initPageCurrent(1);
      // message.success('会员新建成功',1)
  }
  handleOk = () => {
      this.props.form.validateFields((err, values) => {
          if (!err) {
              values.mbCardBirths=this.babydatasouces;
              //如果数组中所有元素都满足条件，则通过，否则抛出异常
              var babydatatattu=values.mbCardBirths.every(function(item,index){
                return  (item.year==null && item.month===null && item.day===null) || (item.year!=null && item.month!=null && item.day!=null)
              })
              if(babydatatattu){
                  if(this.props.type==false){
                      const {mbCardId} = this.props.record;
                      values.mbCardId=mbCardId
                  }
                  let valuesdata={mbCardInfo:values}
                  const result=GetServerData('qerp.pos.mb.card.save',valuesdata)
                  result.then((res) => {
                      return res;
                  }).then((json) => {
                      if(json.code=='0'){
                          console.log(json)
                          this.hideModal();
                          setTimeout(() => {
                              if(this.props.type){
                                  //如果是新增会员，出弹窗，点击确定，再执行
                                  this.setState({
                                      visiblesure:true,
                                      cardNo:json.cardNo
                                  })
                              }else{
                                  message.success('会员信息修改成功',1)
                              }
                              let limitSize = localStorage.getItem('pageSize');
                              this.props.dispatch({
                                   type:'member/fetch',
                                   payload: {code:'qerp.pos.mb.card.query',values:{keywords:'',limit:limitSize,currentPage:0}}
                               });
                              //重置页码为第一页
                              this.props.initPageCurrent(1);


                            }, 1000)
                      }else{
                          message.error(json.message);
                      }
                  })
              }else{
                  message.warning('生日信息不全')
              }
          }

      })
  }
  receivebabydata=(dataSource)=>{
      this.babydatasouces=dataSource
  }
  memberinit=()=>{
      const memberdatas=this.props.form.getFieldInstance('ref').memberdata
      memberdatas()
  }
  //新建成功确认
  surehandleOk=()=>{
      this.setState({
          visiblesure: false,
        });
  }
  //新建成功取消
  surehandleCancel=()=>{
      this.setState({
          visiblesure: false,
      });
  }
  render() {
    const type=this.props.type
    const { getFieldDecorator,getFieldInstance,getFieldProps } = this.props.form;
    const { name, mobile, cardNo,level,mbCardId,amount,point} = this.props.record;
    const mbCardBirths=this.state.mbCardBirths
    return (
      <div className="member-list-pages">
        <div className={`${this.props.type}?widthmeth:textcoloe`}  onClick={this.showModal.bind(this)}>
            {this.props.text}
        </div>
        <Modal
          className="member-width-style member-modal-wrap add-member-modal"
          title={this.props.texts}
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
          width={this.props.width+'px'}
          closable={false}
          width={500}
          footer={[
              <div
                className='fl tc btn-common'
                key='back'
                onClick={this.handleCancel.bind(this)}>
                取消
                <div key='line' className="lines"></div>
              </div>,
              <div className='fr tc btn-common' key='submit' onClick={this.handleOk.bind(this)}>确定</div>,
          ]}>
            <Form className='formdis member-form-wrap'>
              {
                this.props.type?
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
                      receivebabydata={this.receivebabydata.bind(this)}
                      type={this.props.type}
                      {...getFieldProps('ref')}/>
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
                this.props.type?
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
                this.props.type?
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
        <Modal
          closable={false}
          className='member-nextmodel'
          title=""
          visible={this.state.visiblesure}
          onOk={this.surehandleOk}
          onCancel={this.surehandleCancel}
          footer={[<div key="submit" ><span onClick={this.surehandleOk}>确定</span></div>]}>
            <p>会员新增成功</p>
            <p>会员卡号:<span>{this.state.cardNo}</span></p>
        </Modal>
      </div>
    );
  }
}
const AddEditModal=Form.create()(Modelform);

export default AddEditModal;
