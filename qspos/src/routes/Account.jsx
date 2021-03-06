import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message, Spin} from 'antd';
import Header from '../components/Qheader';
import Infomodel from '../components/Infomodel/Infomodel';
import Buttonico from '../components/Button/Button';
import {GetServerData} from '../services/services';
import './Account.less'
//css
const btn={position:'absolute',right:'0','top':'0'}
const addaccountspan={marginRight:'10px',fontSize:'14px',color: '#74777F'}
const modelfooters={height:'20px',lineHeight:'20px',marginTop:'20px'}
const hrefshift_box={'width':'224px','fontSize': '14px'}
const hrefshift_boxs={'width':'224px','fontSize': '14px',color:'#35BAB0'}
const dividingline={width: '2px',height: '15px',background:'#E7E8EC',margin:'0 auto',marginTop: '3px'}
const widthmeth={width:'100px',height:'40px',background:'#FFF',border: '1px solid #E7E8EC',borderRadius: '3px',color: '#35BAB0',fontSize: '14px',textAlign:'center',lineHeight:'40px',cursor: 'pointer',marginLeft:'95px'}
const textcoloe={color: '#35BAB0',cursor: 'pointer'}
const footleft={width:'224px',fontSize: '16px',height:'60px',lineHeight:'60px',cursor: 'pointer'}
const footlefts={width:'175px',fontSize: '16px',height:'60px',lineHeight:'60px',cursor: 'pointer'}
const footright={width:'224px',fontSize: '16px',color:'#35BAB0',height:'60px',lineHeight:'60px',cursor: 'pointer'}
const footrights={width:'175px',fontSize: '16px',color:'#35BAB0',height:'60px',lineHeight:'60px',cursor: 'pointer'}
const footcen={width: '1px',height: '15px',background:'#d8d8d8',margin:'0 auto',marginTop: '20px',cursor: 'pointer'}
const footcens={width:'100px',fontSize: '16px',height:'60px',lineHeight:'60px',margin:'0 auto',textAlign:'center',cursor: 'pointer'}
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class Modelform extends Component {
  constructor(props) {
      super(props);
      this.state = {
          visible: false,
          membervalue: 1,
          accountvalue:1,
          loadingOk:false,
          loadingRe:false,
      }
  }
  MemberonChange = (e) => {
      console.log('radio checked', e.target.value);
      this.props.form.setFieldsValue({
          role: e.target.value,
      });
  }
  AccountonChange = (e) => {
      console.log('radio checked', e.target.value);
      this.props.form.setFieldsValue({
          status: e.target.value,
      });
  }
  showModal = () => {
      this.setState({
          visible: true
      },function(){
          //设置form中的值，新增账号的时候设置为空，修改的时候获取id，请求数据，设置其值
          const type=this.props.type
          if(type){
              this.props.form.setFieldsValue({
                  nickname:null,
                  username:null,
                  role:3,
                  status:1
              });
          }else{
              const record=this.props.record
              console.log(record)
              this.props.form.setFieldsValue({
                  nickname: record.nickname,
                  username:record.username,
                  role:Number(record.role),
                  status:Number(record.status)
              });
          }
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
  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
        if(this.props.type==false){
            values.urUserId=this.props.record.urUserId
        }

        GetServerData('qerp.pos.ur.user.save',values)
        .then((json) => {
          if(json.code=='0'){
            this.setState({
                 visible: false,
             },()=>{
                if(this.props.type==false){
                  message.success('修改成功',1)
                  this.props.dispatch({
                      type:'account/fetch',
                      payload: {code:'qerp.pos.ur.user.query'}
                  })
                }else{
                  const showInfomodel=this.props.showInfomodel
                  showInfomodel('账号新建成功',json.userName,json.password)
                  this.props.dispatch({
                      type:'account/fetch',
                      payload: {code:'qerp.pos.ur.user.query'}
                  })
                }
             })
          }else{
             message.error(json.message)
          }
          this.setState({ loadingOk:false })
        })
      }
    });
  }
  NicknameHindchange=(e)=>{
      this.setState({
          nickname:e.target.value
      })
  }
  UsernameHindchange=(e)=>{
      this.setState({
          username:e.target.value
      })
  }
  revisepassword=()=>{
      if(this.props.type==false){
          let values={urUserId:this.props.record.urUserId}
          const result=GetServerData('qerp.pos.ur.user.passwordreset',values)
              result.then((res) => {
                return res;
              }).then((json) => {
                  console.log(json)
                  if(json.code=='0'){
                      this.hideModal()
                      const {username}= this.props.record;
                      const showInfomodel=this.props.showInfomodel
                      showInfomodel('重置密码成功',username,json.newPassword)

                  }else{

                  }
              })
      }
  }
  render() {
    const type=this.props.type
    const { getFieldDecorator } = this.props.form;
    const { nickname, username, role,status } = this.props.record;
    const { loadingOk,loadingRe} =this.state;
    return (
        <div>
            <div style={this.props.type?widthmeth:textcoloe} onClick={this.showModal.bind(this)}>
                {this.props.text}
            </div>
            <Modal
                className='accountmodel'
                title={this.props.texts}
                visible={this.state.visible}
                // visible={true}
                onOk={this.hideModal}
                onCancel={this.hideModal}
                okText="确认"
                cancelText="取消"
                width={this.props.width+'px'}
                closable={false}
                width={450}
                footer={<div className="handle-btn-list">
                  <Button onClick={this.handleCancel.bind(this)} >取消</Button>
                  <Button type="primary" onClick={this.handleOk.bind(this)} loading={loadingOk}>确定</Button>
                  {!type&&<Button onClick={this.revisepassword.bind(this)} loading={loadingRe}>重置密码</Button>}
                </div>}
                /*footer={[
                    <div className='fl tc' style={type?footleft:footlefts} key='back' onClick={this.handleCancel.bind(this)}>取消</div>,
                    <div className='fr tc' style={type?footright:footrights} key='submit' onClick={this.handleOk.bind(this)}>确定</div>,
                    <div style={type?footcen:footcens} key='line' onClick={this.revisepassword.bind(this)}>{type?null:'重置密码'}</div>,
                ]}*/>
                <Form className='formdis'>
                    <FormItem
                        label="帐号名称"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 8 }}
                        >
                        {getFieldDecorator('nickname', {
                            rules: [{ required: true, message: '请输入账号名称' }],
                        })(
                            <Input  autoComplete="off" placeholder="请输入1-5位会员姓名" className='inputwidth'/>
                        )}
                    </FormItem>
                    <FormItem
                        label="帐号电话"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 8 }}
                        >
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '请输入11位手机号' }],
                        })(
                            <Input autoComplete="off" placeholder="请输入11位手机号" className='inputwidth' />
                        )}
                    </FormItem>
                    <FormItem  label="账号权限"
                         labelCol={{ span: 5 }}
                        wrapperCol={{ span: 8 }}
                        className='listto checkboxlabel'>
                        {getFieldDecorator('role', {
                        })(
                            <RadioGroup onChange={this.MemberonChange.bind(this)}>
                                <Radio value={2}>店长</Radio>
                                <Radio value={3}>店员</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem label="帐号状态"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 8 }}
                      className='checkboxlabel checkboxlabelstatus'>
                        {getFieldDecorator('status', {
                        })(
                            <RadioGroup onChange={this.AccountonChange.bind(this)}>
                                <Radio value={1}>启用</Radio>
                                <Radio value={0}>禁用</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        </div>
    );
  }
}
const  Modelforms=Form.create()(Modelform);
//table组件：账号设置
class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            windowHeight:''
        };

        this._isMounted = false;
        this.columns = [{
            title: '姓名',
            width:'8%',
            dataIndex: 'nickname'

        }, {
            title: '账号手机',
            width:'10%',
            dataIndex: 'username'
        }, {
            title: '账号权限',
            width:'10%',
            dataIndex: 'roleStr'
        },{
            title: '账号状态',
            width:'10%',
            dataIndex: 'statusStr'
        },{
            title: '更新时间',
            width:'10%',
            dataIndex: 'updateTime'
        },{
            title: '操作',
            width:'10%',
            dataIndex: 'operation',
            render: (text, record, index) => {
                return (
                    this.props.users.length > 0  && record.roleStr!='店主'?
                    (
                        <Modelforms  record={record} text='修改'texts='账号修改' width='450' dispatch={this.props.dispatch} type={false} showInfomodel={this.showInfomodel.bind(this)}/>
                    ) : null
                )
            },
        }];
    }
    componentDidMount(){
        this._isMounted = true;
        if(this._isMounted){
            this.setState({
                windowHeight:document.body.offsetHeight-300
            });
            window.addEventListener('resize', this.windowResize);
        }
    }
    componentWillUnmount(){
        this._isMounted = false;
        window.removeEventListener('resize', this.windowResize);
    }
    showInfomodel=(text,account,password)=>{
        const showInfomodel=this.refs.Infomodel.showModal
        showInfomodel(text,account,password)
    }
    rowClassName=(record, index)=>{
        if (index % 2) {
            return 'table_gray'
        }else{
            return 'table_white'
        }
    }
    windowResize = () =>{
        if(!this.refs.tableWrapper){
            return
        }else{
            this.setState({
                windowHeight:document.body.offsetHeight-300
            });
        }
    }
    render() {
        const columns = this.columns;
        return (
            <div ref="tableWrapper">
                <Table bordered
                       dataSource={this.props.users}
                       columns={columns}
                       rowClassName={this.rowClassName.bind(this)}
                       pagination={false}
                       scroll={{y:this.state.windowHeight}}/>
                <Infomodel ref='Infomodel'/>
            </div>
        )
    }
}
 //基础设置组件
class App extends React.Component {
  state={
      value: 1,
      paperSize:"80",
      submitPrint:"1",
      rechargePrint:"1",
      xitong:true,
      allocationPrintNum:'1',
      allocationPrint:'1',
      loading:false
  }
  componentDidMount(){
      this.getSetData()
      //js判断本机是32位还是64为
      var agent = navigator.userAgent.toLowerCase();
      if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0) {
          this.setState({
              xitong:true  //64
          })
      }
      else {
          this.setState({
              xitong:false  //32
          })
      }
  }
  //获取设置
  getSetData = () =>{
     const result=GetServerData('qerp.pos.sy.config.info')
     result.then((res) => {
        return res;
      }).then((json) => {
            console.log(json);
            if(json.code == "0"){
               let setData = json.config;
               this.setState({
                  paperSize:setData.paperSize,
                  submitPrint:setData.submitPrint,
                  rechargePrint:setData.rechargePrint,
                  rechargePrintNum:setData.rechargePrintNum,
                  submitPrintNum:setData.submitPrintNum,
                  exchangePrint:setData.exchangePrint,
                  exchangePrintNum:setData.exchangePrintNum,
                  allocationPrint:setData.allocationPrint,
                  allocationPrintNum:setData.allocationPrintNum
                })
            }
      })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true })
          const config={config:values};
          GetServerData('qerp.pos.sy.config.save',config)
          .then((json) => {
            if(json.code=='0'){
              message.success('设置成功',1)
            }else{
               message.waring(json.message)
            }
            this.setState({ loading: false })
          })
      }
    });
  }
  callback=()=>{
      console.log(1)
  }
  onChange = (e) => {
      console.log('radio checked', e.target.value);
      this.setState({
          value: e.target.value,
      });
  }
  paperSizeonChange=(e)=>{
       this.props.form.setFieldsValue({
          paperSize: e.target.value,
      });
  }
  handleSelectChange = (value) => {
      console.log(value);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } =this.state;
    return (
      <Form
        onSubmit={this.handleSubmit}
        className='formdis accformdis basic-setting account-center  p30 baseSet-form-wrap'>
        {
          this.state.xitong?
          <FormItem
              label="打印控件"
              className='download fires fireses'>
              {getFieldDecorator('printDevice', {
              })(
                  <p className='downk'>
                     <a href='/static/CLodop_Setup_for_Win32NT.exe' target='_self'>下载打印控件</a>
                  </p>
              )}
          </FormItem>
          :
          <FormItem
            label="打印控件"
            className='download fires fireses'>
              {getFieldDecorator('printDevice', {
              })(
                  <p className='downk'>
                     <a href='/static/CLodop_Setup_for_Win32NT.exe' target='_self'>下载打印控件</a>
                  </p>
              )}
          </FormItem>
        }
        <FormItem
          label="纸张大小"
          className='paper fires fireses'>
            {getFieldDecorator('paperSize', {
                initialValue: this.state.paperSize,
            })(
                <RadioGroup onChange={this.paperSizeonChange}>
                    <Radio value={'80'}>80mm</Radio>
                    <Radio value={'58'}>58mm</Radio>
                </RadioGroup>

            )}
        </FormItem>
        <FormItem
          label="结算后打印"
          className='fireses'
          style={{display:"inline-block"}}>
            {getFieldDecorator('submitPrint', {
                initialValue:this.state.submitPrint,
            })(
                <RadioGroup>
                    <Radio value={'1'}>是</Radio>
                    <Radio value={'0'}>否</Radio>
                </RadioGroup>

            )}
        </FormItem>
        <FormItem
          className="page-count"
          label="小票份数"
          style={{display:"inline-block"}}
          labelCol={{span:3}}
          wrapperCol={{span:15}}>
          {getFieldDecorator('submitPrintNum', {
                initialValue:this.state.submitPrintNum,
            })(
                <Select style={{ width: 120 }}>
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3</Option>
                    <Option value="4">4</Option>
                    <Option value="5">5</Option>
                </Select>
          )}
        </FormItem>
        <div style={{width:"100%",height:"1px",visibility:"hidden"}}></div>
        <FormItem
            label="充值后打印"
            style={{display:"inline-block"}}>
          {getFieldDecorator('rechargePrint', {
              initialValue: this.state.rechargePrint,
          })(
              <RadioGroup>
                  <Radio value={'1'}>是</Radio>
                  <Radio value={'0'}>否</Radio>
              </RadioGroup>

          )}
        </FormItem>
        <FormItem
          className="page-count"
          label="小票份数"
          style={{display:"inline-block"}}
          labelCol={{span:3}}
          wrapperCol={{span:15}}>
          {getFieldDecorator('rechargePrintNum', {
                  initialValue:this.state.rechargePrintNum,
              })(
                  <Select style={{ width: 120 }}>
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="4">4</Option>
                      <Option value="5">5</Option>
                  </Select>
          )}
        </FormItem>
        <div style={{width:"100%",height:"1px",visibility:"hidden"}}></div>
        <FormItem
          label="交班后打印"
          style={{display:"inline-block"}}>
          {getFieldDecorator('exchangePrint', {
              initialValue: this.state.exchangePrint,
          })(
              <RadioGroup>
                  <Radio value={'1'}>是</Radio>
                  <Radio value={'0'}>否</Radio>
              </RadioGroup>
          )}
        </FormItem>
        <FormItem
          className="page-count"
          label="小票份数"
          style={{display:"inline-block"}}
          labelCol={{span:3}}
          wrapperCol={{span:15}}>
            {getFieldDecorator('exchangePrintNum', {
                    initialValue:this.state.exchangePrintNum,
                })(
                    <Select style={{ width: 120 }}>
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                        <Option value="4">4</Option>
                        <Option value="5">5</Option>
                    </Select>
            )}
        </FormItem>
        <div style={{width:"100%",height:"1px",visibility:"hidden"}}></div>
        <FormItem
          label="调拨后打印"
          style={{display:"inline-block"}}>
          {getFieldDecorator('allocationPrint', {
              initialValue: this.state.allocationPrint,
          })(
              <RadioGroup>
                  <Radio value={'1'}>是</Radio>
                  <Radio value={'0'}>否</Radio>
              </RadioGroup>
          )}
        </FormItem>
        <FormItem
            className="page-count"
            label="小票份数"
            style={{display:"inline-block"}}
            labelCol={{span:3}}
            wrapperCol={{span:15}}>
          {getFieldDecorator('allocationPrintNum', {
                  initialValue:this.state.allocationPrintNum,
              })(
                  <Select style={{ width: 120 }}>
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="4">4</Option>
                      <Option value="5">5</Option>
                  </Select>
          )}
        </FormItem>
        <div style={{width:"100%",height:"1px",visibility:"hidden"}}></div>
        <FormItem>
          <Button type="primary" onClick={this.handleSubmit.bind(this)} loading={loading}>确定</Button>
          {/* <div onClick={this.handleSubmit.bind(this)} className='submitform account-subbtn'>确定</div> */}
        </FormItem>
      </Form>
    );
  }
}
const Infrastructureform = Form.create()(App);
// tag组件
class Tags extends React.Component {
  state={
      tabBarExtraContent:true
  }
  callback=(key)=>{
      if(key=='1'){
          this.setState({
              tabBarExtraContent:true
          })
      }
      if(key=='2'){
          this.setState({
              tabBarExtraContent:false
          })
      }
  }
  showInfomodel=(text,account,password)=>{
      const showInfomodel=this.refs.Infomodel.showModal
      showInfomodel(text,account,password)
  }
  render() {
    return (
      <div className='posion account-tab-style'>
        <Tabs onChange={this.callback.bind(this)} type="card" tabBarStyle={{height:'54px'}} tabBarExtraContent={ this.state.tabBarExtraContent?<Modelforms record={{role:'3',status:'1'}} text='新增账号'texts='新增账号' width='450' dispatch={this.props.dispatch} type={true} showInfomodel={this.showInfomodel.bind(this)}/>:null}>
           <TabPane tab="账号管理" key="1">
             <div className="count-table-style">
                 <EditableTable users={this.props.users} dispatch={this.props.dispatch}/>
             </div>
           </TabPane>
           <TabPane tab="基础设置" key="2"><Infrastructureform/></TabPane>
        </Tabs>
        <Infomodel ref='Infomodel'/>
      </div>
    )
  }
}
//主页面
function Account({users,dispatch, spinLoad}) {
  return (
    <div className="common-pages-wrap">
      <Spin tip='加载中，请稍后...'  spinning={spinLoad.loading}>
        <Header type={false} color={true}/>
        <div className='counters'>
          <Tags users={users} dispatch={dispatch}/>
        </div>
      </Spin>
    </div>
  )
}
function mapStateToProps(state) {
  const { spinLoad } = state;
  const {users} = state.account;
  return {users, spinLoad};
}
export default connect(mapStateToProps)(Account);
