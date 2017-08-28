import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message} from 'antd';
import Header from '../components/header/Header';
import Buttonico from '../components/Button/Button';
import Modelform from '../components/Modelform/Modelform.jsx';
import {GetServerData} from '../services/services';


//css
const btn={
  position:'absolute',
  right:'0',
 'top':'0'
}
const inputwidth={
  width:'340px',
  height:'40px'
}

const addaccountspan={
  marginRight:'10px',
  fontSize:'14px',
  color: '#74777F'
}

const modelfooters={
  height:'20px',
  lineHeight:'20px',
  marginTop:'20px'

}
const hrefshift_box={
  'width':'224px',
  'fontSize': '14px'
}

const hrefshift_boxs={
  'width':'224px',
  'fontSize': '14px',
   color:'#35BAB0'
}
const dividingline={
  width: '2px',
  height: '15px',
  background:'#E7E8EC',
  margin:'0 auto',
  marginTop: '3px'
}


const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


// tag组件
class Tags extends React.Component {
  state={
    tabBarExtraContent:true
  }
	callback=(key)=>{
        console.log(this)
		 console.log(key);
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

  render() {
    return (
      <div className='count'>
        <div className='posion'>
          <Tabs onChange={this.callback.bind(this)} type="card" tabBarStyle={{height:'54px'}} tabBarExtraContent={ this.state.tabBarExtraContent?<Modelform record={{}} text='新增账号' width='450' dispatch={this.props.dispatch}/>:null}>
  		    	<TabPane tab="账号管理" key="1"><EditableTable users={this.props.users}/></TabPane>
  		    	<TabPane tab="基础设置" key="2"><Infrastructureform/></TabPane>
   			  </Tabs>
        </div>
      </div>
    )
  }
}











//修改账号
class NormalLoginForms extends React.Component {
    state = {
    value: 1,
  }
   onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <div><span style={addaccountspan}>账号名称</span><Input placeholder="请输入1-5位会员姓名" style={inputwidth}/></div>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <div><span style={addaccountspan}>账号电话</span><Input placeholder="请输入11位手机号" style={inputwidth}/></div>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password2', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <div><span style={addaccountspan}>会员权限</span><RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={1}>店主</Radio>
                <Radio value={2}>店员</Radio>
            </RadioGroup>
          </div>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('passwords', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <div><span style={addaccountspan}>账号状态</span><RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={1}>启用</Radio>
                <Radio value={2}>禁用</Radio>
            </RadioGroup>
            </div>
          )}
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForms = Form.create()(NormalLoginForms);



//table组件：账号设置
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '姓名',
      dataIndex: 'nickname',
      width: '30%',
      render: (text, record, index) => (
        <span>{text}</span>
      ),
    }, {
      title: '账号手机',
      dataIndex: 'username',
    }, {
      title: '账号权限',
      dataIndex: 'roleStr',
    },{
      title: '账号状态',
      dataIndex: 'statusStr',
    },{
      title: '更新时间',
      dataIndex: 'discountLeast',
    },{
      title: '操作',
      dataIndex: 'operation',
      render: (text, record, index) => {
        return (
          this.state.dataSource.length > 0 ?
          (
          <div onClick={this.showModal.bind(this)} className='themecolor'>修改</div>
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
        name: 'Edward King 1',
        age: '32',
        address: 'London, Park Lane no. 1',
      }],
      count: 2,
      visible: false
    };
  }

  showModal = () => {
    console.log(1)
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {

     this.setState({ visible: false });
  }
  handleCancel = () => {
    this.setState({ visible: false });
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
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  }
  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <div>
        <Table bordered dataSource={this.props.users} columns={columns} rowClassName={this.rowClassName.bind(this)}/>
        <Modal
          title='账号修改'
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleOk}
          width={450}
          closable={false}
          footer={[
              <div className='fl tc' style={{width:'175px',fontSize: '14px',height:'40px',lineHeight:'40px'}} key='back' onClick={this.handleCancel.bind(this)}>取消</div>,
              <div className='fr tc' style={{width:'175px',fontSize: '14px',color:'#35BAB0',height:'40px',lineHeight:'40px'}} key='submit' onClick={this.handleOk.bind(this)}>确定</div>,
              <div style={{width:'100px',fontSize: '14px',height:'40px',lineHeight:'40px',margin:'0 auto',textAlign:'center'}} key='cz'>重置密码</div>
          ]}
        >
            <WrappedNormalLoginForms/>
        </Modal>
      </div>
    );
  }
}






//基础设置组件
class App extends React.Component {
  state={
     value: 1
  }
  handleSubmit = (e) => {
    console.log(1)
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
          message.success('This is a message of success',1,this.callback());

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

  handleSelectChange = (value) => {
    console.log(value);
    
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className='p30' style={{marginTop:'50px'}}>
        <FormItem>
          {getFieldDecorator('passwords', {
            // rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <div><span style={addaccountspan}>选择打印机</span><Select
              placeholder="请选择"
              onChange={this.handleSelectChange}
              style={{width:'175px'}}
            >
              <Option value="male">male</Option>
              <Option value="female">female</Option>
            </Select>
            </div>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('passwords', {
            // rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <div><span style={addaccountspan}>纸张大小</span><RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={1}>80mm</Radio>
                <Radio value={2}>58mm</Radio>
            </RadioGroup>
            </div>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('passwords', {
            // rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <div><span style={addaccountspan}>计算后打印</span><RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
            </RadioGroup>
            </div>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('passwords', {
            // rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <div><span style={addaccountspan}>充值后打印</span><RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
            </RadioGroup>
            </div>
          )}
        </FormItem>
         <FormItem
        >
          <div onClick={this.handleSubmit.bind(this)} className='btn'><Buttonico text='确定'/></div>
        </FormItem>
      </Form>
    );
  }
}

const Infrastructureform = Form.create()(App);








//主页面
function Account({users,dispatch}) {
  return (
    <div>
      <Header type={false} color={true}/>
      <Tags users={users} dispatch={dispatch}/>
    </div>
  );
}

function mapStateToProps(state) {
  console.log(state)
	 const {users} = state.account;
     return {users};
}

export default connect(mapStateToProps)(Account);
