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
const widthmeth={
    width:'100px',
    height:'40px',
    background:'#FFF',
    border: '1px solid #E7E8EC',
    borderRadius: '3px',
    color: '#35BAB0',
    fontSize: '14px',
    textAlign:'center',
    lineHeight:'40px',
    cursor: 'pointer'
}

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


//table组件：账号设置
class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '姓名',
            dataIndex: 'nickname'
        }, {
            title: '账号手机',
            dataIndex: 'username'
        }, {
            title: '账号权限',
            dataIndex: 'roleStr'
        },{
            title: '账号状态',
            dataIndex: 'statusStr'
        },{
            title: '更新时间',
            dataIndex: 'discountLeast'
        },{
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) => {
                return (
                    this.props.users.length > 0 ?
                    (
                        <Modelform  record={record} text='修改' width='450' dispatch={this.props.dispatch} type={false}/>
                    ) : null
                )
            },
        }];
    }
    rowClassName=(record, index)=>{
        if (index % 2) {
            return 'table_gray'
        }else{
            return 'table_white'
        }
    }
    render() {
        const columns = this.columns;
        return (
            <div>
                <Table bordered dataSource={this.props.users} columns={columns} rowClassName={this.rowClassName.bind(this)}/>
            </div>
        )
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
                const result=GetServerData('qerp.pos.sy.config.save',values)
                result.then((res) => {
                  return res;
                }).then((json) => {
                    console.log(json)
                    if(json.code=='0'){
                       // this.context.router.push('/cashier')
                    }else{  
                       
                    }
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
        return (
        <Form onSubmit={this.handleSubmit} className='p30' style={{marginTop:'50px',padding:'30px'}} className='formdis'>
            <FormItem
                label="选择打印机"
            >
                {getFieldDecorator('printDevice', {
                })(
                    <Select
                    placeholder="请选择"
                    onChange={this.handleSelectChange}
                    style={{width:'175px'}}
                    >
                        <Option value="male">male</Option>
                        <Option value="female">female</Option>
                    </Select>
                    
                )}
            </FormItem>
            <FormItem
                label="纸张大小"
                >
                {getFieldDecorator('paperSize', {
                    initialValue: 80,
                })(
                    <RadioGroup onChange={this.paperSizeonChange}>
                        <Radio value={80}>80mm</Radio>
                        <Radio value={58}>58mm</Radio>
                    </RadioGroup>
                    
                )}
            </FormItem>
            <FormItem
                label="计算后打印"
            >
                {getFieldDecorator('submitPrint', {
                    initialValue: 1,
                })(
                    <RadioGroup onChange={this.onChange}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </RadioGroup>
                    
                )}
            </FormItem>
            <FormItem
                label="充值后打印"
            >
            {getFieldDecorator('rechargePrint', { 
                initialValue: 1,
            })(
                <RadioGroup onChange={this.onChange}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                </RadioGroup>
               
            )}
            </FormItem>
            <FormItem>
                <div onClick={this.handleSubmit.bind(this)} style={widthmeth}>确定</div>
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
                    <Tabs onChange={this.callback.bind(this)} type="card" tabBarStyle={{height:'54px'}} tabBarExtraContent={ this.state.tabBarExtraContent?<Modelform record={{role:'1',status:'1'}} text='新增账号' width='450' dispatch={this.props.dispatch} type={true}/>:null}>
  		    	       <TabPane tab="账号管理" key="1"><EditableTable users={this.props.users} dispatch={this.props.dispatch}/></TabPane>
  		    	       <TabPane tab="基础设置" key="2"><Infrastructureform/></TabPane>
   			        </Tabs>
                </div>
            </div>
        )
    }
}



//主页面
function Account({users,dispatch}) {
    return (
        <div>
            <Header type={false} color={true}/>
            <Tags users={users} dispatch={dispatch}/>
        </div>
    )
}

function mapStateToProps(state) {
    console.log(state)
	const {users} = state.account;
    return {users};
}

export default connect(mapStateToProps)(Account);
