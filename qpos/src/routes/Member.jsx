import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm,Modal,Form,Select,Radio,Switch} from 'antd';
import Header from '../components/header/Header';

//宝宝生日组件
class EditableTablebaby extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: 'name',
      dataIndex: 'name',
      width: '30%',
      render: (text, record, index) => (
        <div><Input style={{width: '50%'}}/><span>年</span></div>
      ),
    }, {
      title: 'age',
      dataIndex: 'age',
      width: '30%',
      render: (text, record, index) => (
        <div><Input style={{width: '50%'}}/><span>月</span></div>
      )
    }, {
      title: 'address',
      dataIndex: 'address',
      width: '30%',
      render: (text, record, index) => (
         <div><Input style={{width: '50%'}}/><span>日</span></div>
      )
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
  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <div>
        <Button className="editable-add-btn" onClick={this.handleAdd}>Add</Button>
        <Switch checkedChildren="公历" unCheckedChildren="农历" onChange={this.SwitchChange.bind(this)}/>
        <Table bordered dataSource={dataSource} columns={columns} pagination={false} showHeader={false} bordered={false}/>
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
            <span onClick={this.showModal.bind(this)}>修改</span>
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

  handsearch=()=>{
    console.log(1)
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  hideModal = () => {
    console.log(this)
    const handleSubmit=this.refs.wrappedApps.handleSubmit
    handleSubmit()
    this.setState({
      visible: false,
    });
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
        <Button className="editable-add-btn" onClick={this.showModal.bind(this)}>新增会员</Button>
        <Input placeholder="Basic usage"  style={{ width: 200 }}/><Button  onClick={this.handsearch.bind(this)}>搜索</Button>
        <Table bordered dataSource={dataSource} columns={columns} />
        <Modal
          title="Modal"
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
         <WrappedApps ref='wrappedApps'/>
        </Modal>
      </div>
    );
  }
}

//弹窗中form
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


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
        <FormItem
          label="会员姓名"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
        >
          {getFieldDecorator('note', {
            rules: [{ required: true, message: 'Please input your note!' }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="会员电话"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
        >
          {getFieldDecorator('note', {
            rules: [{ required: true, message: 'Please input your note!' }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="会员卡号"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
        >
          {getFieldDecorator('note', {
            rules: [{ required: true, message: 'Please input your note!' }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="宝宝生日"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
        >
          {getFieldDecorator('note', {
            rules: [{ required: true, message: 'Please input your note!' }],
          })(
            <EditableTablebaby/>
          )}
        </FormItem>
        <FormItem
          label="会员级别"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
        >
          {getFieldDecorator('note', {
            rules: [{ required: true, message: 'Please input your note!' }],
          })(
            <RadioGroup onChange={this.HindonChange} value={this.state.value}>
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
              <Radio value={3}>C</Radio>
            </RadioGroup>
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







//index
function Member({data}) {
  return (
    <div>
     <Header type={false} data={data} color={true}/>
     <EditableTable/>
    </div>
  );
}

function mapStateToProps(state) {
  console.log(state)
  const {data}=state.header
  return {data};
}

export default connect(mapStateToProps)(Member);
