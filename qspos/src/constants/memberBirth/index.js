import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,Switch} from 'antd';
import Searchinput from '../../components/Searchinput/Searchinput';
import Qpagination from '../../components/Qpagination';
import Qtable from '../../components/Qtable';
import Header from '../../components/header/Header';
import { GetServerData } from '../../services/services';
import FilterForm from './components/FilterForm';
import './index.less'
const Search = Input.Search;
const Option = Select.Option;

const formatDate=(value)=> {
  value = moment(value).format('MM-DD');
  let newVal = value.split('-');
  newVal = `${newVal[0]}月${newVal[1]}日`;
  return newVal;
}

const columns=[{
    title: '宝宝生日',
    dataIndex: 'birthDate',
    key: 'birthDate',
    render:(text,record,index)=> {
      return <span className="birthdate-col">
              {formatDate(record.birthDate)}
              {record.type==2&&<span className="lit-month">农历</span>}
            </span>
    }
  },{
    title: '生日倒计时',
    dataIndex: 'backDate',
    key: 'backDate',
    render:(text,record,index)=> {
      return <span
              className={record.backDays<=3?'latest-birth':''}>
              {record.backDate}
            </span>
    }
  },{
    title: '宝宝岁数',
    dataIndex: 'babyAge',
    key: 'babyAge',
  },{
    title: '会员姓名',
    dataIndex: 'name',
    key: 'name',
  },{
    title: '会员电话',
    dataIndex: 'mobile',
    key: 'mobile',
  },{
    title: '会员级别',
    dataIndex: 'levelStr',
    key: 'levelStr',
  },{
    title: '账户余额',
    dataIndex: 'amount',
    key: 'amount',
  },{
    title: '消费次数',
    dataIndex: 'payCount',
    key: 'payCount',
  },{
    title: '消费总金额',
    dataIndex: 'amountSum',
    key: 'amountSum',
  }]

class MemberBirth extends Component {
  constructor(props) {
    super(props);
    this.state={
      fields: {
         keyWords:'',
         backDays:7
       },
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type:'memberBirth/fetchList',
      payload:{...this.state.fields}
    })
  }
  //双向绑定表单
  handleFormChange = (changedFields) => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  }
  changePage = (currentPage) => {
    currentPage--;
    const { fields } = this.state;
    const paramsObj ={...{currentPage},...fields}
    this.props.dispatch({
      type:'memberBirth/fetchList',
      payload: paramsObj
    });
  }
  //修改pageSize
  changePageSize =(values)=> {
    this.props.dispatch({
      type:'memberBirth/fetchList',
      payload: values
    });
  }
  //搜索
  handelSearch =(values)=> {
    this.props.dispatch({
      type:'memberBirth/fetchList',
      payload: values
    });
  }
  render() {
    const { fields } =this.state;
    const { dataSource, data, mbinfo } =this.props.memberBirth;
    console.log(fields)
    return (
      <div className="member-birthday-pages">
        <Header type={false} color={true} linkRoute="member"/>
        <div className="main-content">
          <div className='top-action clearfix'>
            <p className="part-l">
              当前日期：
              {
                mbinfo.currentDate&&(moment(mbinfo.currentDate).format('YYYY-MM-DD'))
              }
            <span className="lit-date">（{mbinfo.cuCalDate}）</span>
          </p>
            <div className="part-r">
              <FilterForm
                {...fields}
                handelSearch={this.handelSearch.bind(this)}
                onValuesChange={this.handleFormChange.bind(this)}/>
            </div>
          </div>
          <Qtable
            columns={columns}
            dataSource={dataSource}/>
            {
              dataSource.length>0&&
              <Qpagination
                sizeOptions="2"
                onShowSizeChange={this.changePageSize.bind(this)}
                onChange={this.changePage.bind(this)}
                data={data}/>
            }
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
    const { memberBirth } = state;
    return { memberBirth };
}

export default connect(mapStateToProps)(MemberBirth);
