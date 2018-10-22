import React from 'react';
import {
  Table,
  Input, Icon,Row, Col,
  Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,DatePicker,Tooltip,Pagination} from 'antd';
import moment from 'moment';
import {timeForMats} from '../../utils/commonFc';
import {GetServerData} from '../../services/services';
import './IntegralStatements.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker  } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

const columns = [{
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
  }, {
    title: '结算积分',
    dataIndex: 'pointAmount',
    key: 'pointAmount',
  }, {
    title: '积分类型',
    dataIndex: 'pointType',
    key: 'pointType',
  },{
    title: '会员卡号',
    dataIndex: 'cardNo',
    key: 'cardNo',
  },{
    title: '会员类型',
    dataIndex: 'isLocalShopStr',
    key: 'isLocalShopStr',
  },{
    title: '订单时间',
    dataIndex: 'orderTime',
    key: 'orderTime',
  }];

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exchangeTimeStart:'',
      exchangeTimeEnd:''
    }
  }
  componentDidMount() {
    this.getNowFormatDate()
  }
  //获取当前时间
  getNowFormatDate = () =>{
      let startRpDate=timeForMats(30).t2;
      let endRpDate=timeForMats(30).t1;
      this.setState({
          exchangeTimeStart:startRpDate,
          exchangeTimeEnd:endRpDate
      })
      this.props.handleSearch('0',startRpDate,endRpDate)
  }
  changeDate(date,dateString) {
    this.setState({
        exchangeTimeStart:dateString[0],
        exchangeTimeEnd:dateString[1]
    })
  }
  search() {
    this.props.form.validateFields((err,values) => {
      this.props.handleSearch(values)
    })

  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { exchangeTimeStart, exchangeTimeEnd } =this.state;
    return(
      <div className="search-form point-forms">
        <Form>
              <FormItem label="订单时间" labelCol={{ span: 5 }} wrapperCol={{span: 10}}>
                {
                  getFieldDecorator('orderTime',{
                    initialValue:[moment(exchangeTimeStart, dateFormat), moment(exchangeTimeEnd, dateFormat)],
                    onChange:this.changeDate
                  })(
                    <RangePicker />
                  )
                }
              </FormItem>
              <FormItem label="订单分类" labelCol={{ span: 5 }} wrapperCol={{span: 10}}>
                {
                  getFieldDecorator('pointType',{
                    initialValue:'0'
                  })(
                    <Select>
                      <Option value="0" key="0">全部</Option>
                      <Option value="1" key="1">消费赠送</Option>
                      <Option value="4" key="4">现金抵值</Option>
                      <Option value="3" key="3">退货抵扣</Option>
                    </Select>
                  )
                }
              </FormItem>
              <FormItem>
                  <Button type="primary" icon="search" onClick={this.search.bind(this)}>搜索</Button>
              </FormItem>
        </Form>
      </div>
    )
  }
}

class IntegralStatements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deductPoints:0,
      toDeductTotalPoints:12,
      allocatePoints:33
    }
  }
  componentDidMount() {

  }
  getList(pointType,orderST,orderET) {
    let values = {
      pointType:pointType||0,
      orderST,
      orderET
    }
    GetServerData('qerp.qpos.rp.mbcard.point.page',values)
    .then((res) => {
      console.log(res)
    },(err) => {
      console.log(err)
    })
  }
  rowClassName=(record, index)=>{
    if (index % 2) {
        return 'table_gray'
    }else{
        return 'table_white'
    }
  }
  render() {
    const {
      deductPoints,
      toDeductTotalPoints,
      allocatePoints
    } = this.state;
    return(
      <div className="integral-statements-pages">
        <div className="total-data-action">
          <div className="data-list">
            <div className="item-wrap">
              <p className="nums">￥<span className="big-size">{allocatePoints}</span><span>00</span></p>
              <p className="label">
                <Tooltip title="期初库存总成本+进货总成本-销售总成本-损益总成本">
                    发放积分数&nbsp;<Icon type="exclamation-circle-o"/>
                </Tooltip>
              </p>
            </div>
            <div className="item-wrap">
              <p className="nums">￥<span className="big-size">{deductPoints}</span><span>00</span></p>
              <p className="label">
                <Tooltip title="期初库存总成本+进货总成本-销售总成本-损益总成本">
                    抵扣积分数&nbsp;<Icon type="exclamation-circle-o"/>
                </Tooltip>
              </p>
            </div>
            <div className="item-wrap">
              <p className="nums">￥<span className="big-size">{toDeductTotalPoints}</span><span>00</span></p>
              <p className="label">
                <Tooltip title="期初库存总成本+进货总成本-销售总成本-损益总成本">
                  积分池待抵扣总积分&nbsp;<Icon type="exclamation-circle-o"/>
                </Tooltip>
              </p>
            </div>
          </div>
        </div>
        <SearchFilter handleSearch={this.getList}/>
        <Table
          bordered
          dataSource={[]}
          columns={columns}
          rowClassName={this.rowClassName.bind(this)}/>
      </div>
    )
  }
}

const SearchFilter = Form.create()(SearchForm);

export default IntegralStatements;
