import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm,Modal,Form,Select,Radio,Switch} from 'antd';
import Header from '../components/header/Header';
import Searchinput from '../components/Searchinput/Searchinput';
import {LocalizedModal,Buttonico} from '../components/Button/Button';


// css
const inputwidth={
  width:'340px',
  height:'40px'
}
const addaccountspan={
  marginRight:'10px',
  fontSize:'16px',
  color: '#74777F'
}
const dividingline={
  width: '2px',
  height: '15px',
  background:'#E7E8EC',
  margin:'0 auto',
  marginTop:'12px'
}


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
//宝宝生日组件
class EditableTablebaby extends React.Component {
  constructor(props) {
    super(props);
    this.state={
       
    }


    this.columns = [{
      title: 'name',
      dataIndex: 'name',
      width: '30%',
      render: (text, record, index) => (
        <div>
            <Select defaultValue="lucy" style={{ width: 60 }} onChange={this.handleChange.bind(this)}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
            <span>年</span>
        </div>
      ),
    }, {
      title: 'age',
      dataIndex: 'age',
      width: '30%',
      render: (text, record, index) => (
        <div>
            <Select defaultValue="lucy" style={{ width: 60 }} onChange={this.handleChange.bind(this)}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
            <span>月</span>
        </div>
      )
    }, {
      title: 'address',
      dataIndex: 'address',
      width: '30%',
      render: (text, record, index) => (
         <div>
            <Select defaultValue="lucy" style={{ width: 60 }} onChange={this.handleChange.bind(this)}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
            <span>日</span>
        </div>
      )
    }];

    this.state = {
      dataSource: [{
        key: '0',
        name: 'Edward King 0',
        age: '32',
        address: 'London, Park Lane no. 0',
      }],
      count: 2,
    };
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
  SwitchChange=(checked)=>{
    console.log(checked)
  }

  handleChange=(value)=>{
    console.log(`selected ${value}`)
  }

  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <div className='clearfix'>
        <div className='fl' style={{width:'250px'}}><Table bordered dataSource={dataSource} columns={columns} pagination={false} showHeader={false} bordered={false}/></div>
        <div className='fl clearfix' style={{width:'90px'}}>
            <div style={{width:'16px',height:'16px',borderRadius:'50%',border: '1px solid #E7E8EC',float:'left',margin:'10px'}} onClick={this.handleAdd}><i style={{position:'relative',top:'-10px',left:'2px',color:'#35bab0'}}>+</i></div>
            <div className='fl' style={{width:'54px'}}><Switch checkedChildren="公历" unCheckedChildren="农历" onChange={this.SwitchChange.bind(this)}/></div>
        </div>
      </div>
    );
  }
}



//table组件
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: 'name',
      dataIndex: 'name',
      width: '30%',
      render: (text, record, index) => (
       <span>{text}</span>
      ),
    }, {
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
          this.state.dataSource.length > 0 ?
          (
            <span onClick={this.showModal.bind(this)} className='themecolor'>修改</span>
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
      visible: false
    };
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }
  handleOk = () => {
   this.setState({ visible: false });
  }
  handsearch=()=>{
    console.log(1)
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  hideModal = () => {
    // console.log(this)
    // const handleSubmit=this.refs.wrappedApps.handleSubmit
    // handleSubmit()
    this.setState({
      visible: false,
    });
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
        <Table bordered dataSource={dataSource} columns={columns} rowClassName={this.rowClassName.bind(this)}/>
        <Modal
          title='会员修改'
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          width={450}
          okText="确认"
          cancelText="取消"
          closable={false}
          footer={[
              <div className='fl tc' style={{width:'219px',fontSize: '14px',height:'40px',lineHeight:'40px'}} key='back' onClick={this.handleCancel.bind(this)}>取消</div>,
              <div className='fl tc' style={{width:'219px',fontSize: '14px',color:'#35BAB0',height:'40px',lineHeight:'40px'}} key='submit' onClick={this.handleOk.bind(this)}>确定</div>,
              <div style={dividingline} key='line'></div>
          ]}
        >
         <WrappedApps ref='wrappedApps'/>
        </Modal>
      </div>
    );
  }
}

//弹窗中form
class App extends React.Component {
  state = {
    value: 1,
  }
  handleSubmit = (e) => {
    console.log(111)
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  handleSelectChange = (value) => {
    console.log(value);
    this.props.form.setFieldsValue({
      note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    });
  }

  HindonChange=(e)=>{
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
         <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <div><span style={addaccountspan}>会员姓名</span><Input placeholder="请输入1-5位会员姓名" style={inputwidth}/></div>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <div><span style={addaccountspan}>会员电话</span><Input placeholder="请输入1-5位会员姓名" style={inputwidth}/></div>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <div><span style={addaccountspan}>会员卡号</span><Input placeholder="请输入1-5位会员姓名" style={inputwidth}/></div>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <div className='birthday clearfix'><span style={addaccountspan} className='fl'>宝宝生日</span> <EditableTablebaby className='fl'/></div>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <div><span style={addaccountspan}>会员级别</span>
                <RadioGroup onChange={this.HindonChange} value={this.state.value}>
                  <Radio value={1}>A</Radio>
                  <Radio value={2}>B</Radio>
                  <Radio value={3}>C</Radio>
            </RadioGroup>
            </div>
          )}
        </FormItem>
      </Form>
    );
  }
}

const WrappedApp = Form.create({ withRef: true })(App);


class WrappedApps extends React.Component {
  handleSubmit=()=>{
    const handleSubmit=this.refs.wrappedApp.refs.wrappedComponent.refs.formWrappedComponent.handleSubmit
    handleSubmit()
  }
  render() {
    return (
      <div>
          <WrappedApp ref="wrappedApp"/>
      </div>
    );
  }
}

//搜索区
function Searchcomponent() {
  return (
    <div className='clearfix'>
      <div className='m30 btn fl'><LocalizedModal text='新增会员' width='450' content={<WrappedApps/>}/></div>
      <div className='fr' style={{marginRight:'30px'}}>
          <Searchinput text='请输入会员姓名、手机、会员卡号、级别'/>
      </div>
    </div>
  );
}

//index
function Member({data}) {
  return (
    <div>
     <Header type={false} data={data} color={true}/>
     <div style={{marginBottom:'10px'}}><Searchcomponent/></div>
     <div style={{padding:'0 30px',background:'#fff'}}><EditableTable/></div>
    </div>
  );
}

function mapStateToProps(state) {
  console.log(state)
  const {data}=state.header
  return {data};
}

export default connect(mapStateToProps)(Member);
