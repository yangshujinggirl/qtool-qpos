import React, { Component } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Icon,
  Select ,
  DatePicker
} from 'antd';
import QsearchInput from '../../../../components/QsearchInput/index';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option =  Select.Option;
const Search = Input.Search;

class NormalForm extends Component {
  constructor(props){
    super(props)
    this.state={
      categoryList2:[]
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.props.submit && this.props.submit(values)
    });
  }
  //分类发生变化
  onChange=(value)=>{
    if(!value){
      this.setState({
        categoryList2:[]
      });
      this.props.form.resetFields(["pdCategory2Id"])
    };
  }
  //一级分类选中
  onSelect=(value)=>{
    this.props.form.resetFields(["pdCategory2Id"]);
    getCategoryApi({level:2,parentId:value,status:1})
    .then(res=>{
      if(res.code == "0" ){
        this.setState({
          categoryList2:res.pdCategory
        })
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { type } =this.props;
    return(
        <Form className="qtools-condition-form">
          <div className="search-form-wrap">
            <FormItem label='订单时间'>
               {getFieldDecorator('time')(
                 <RangePicker showTime/>
               )}
             </FormItem>
             {
               (type=='1'||type=='0')&&
               <FormItem label='订单分类'>
                  {getFieldDecorator('type')(
                    <Select placeholder="请选择订单分类">
                      <Option value={0} key={0}>全部</Option>
                      <Option value={1} key={1}>销售订单</Option>
                      <Option value={2} key={2}>充值订单</Option>
                      <Option value={3} key={3}>退货订单</Option>
                    </Select>
                  )}
                </FormItem>
             }
             {
               (type=='3'||type=='4')&&
               <FormItem label='订单分类'>
                  {getFieldDecorator('type')(
                    <Select placeholder="请选择订单分类">
                      <Option value={0} key={0}>全部</Option>
                      <Option value={1} key={1}>销售订单</Option>
                      <Option value={3} key={3}>退货订单</Option>
                    </Select>
                  )}
                </FormItem>
             }
             {
               (type=='0'||type=='2')&&
               <FormItem label='订单状态'>
                  {getFieldDecorator('orderStatus')(
                    <Select allowClear={true} placeholder="请选择订单状态">
                      <Option value={0} key={0}>全部</Option>
                      <Option value={1} key={1}>已接单</Option>
                      <Option value={2} key={2}>进行中</Option>
                      <Option value={3} key={3}>已完成</Option>
                      <Option value={4} key={4}>已关闭</Option>
                      <Option value={5} key={5}>已退货</Option>
                    </Select>
                  )}
                </FormItem>
             }
             {
               type=='2'&&
               <FormItem label='配送方式：'>
                  {getFieldDecorator('deliverType')(
                    <Select allowClear={true} placeholder="请选择配送方式">
                      <Option value={0} key={0}>全部</Option>
                      <Option value={1} key={1}>门店自提</Option>
                      <Option value={2} key={2}>同城配送</Option>
                      <Option value={3} key={3}>门店邮寄</Option>
                    </Select>
                  )}
                </FormItem>
             }
            <FormItem label=''>
               <QsearchInput
                name="keywords"
                form={this.props.form}
                placeholder="请输入商品条码、名称、订单号"
                handleSearch={this.handleSubmit}/>
             </FormItem>
           </div>
        </Form>
    )
  }
}
const FilterForm = Form.create({
  onValuesChange:(props, changedValues, allValues) => {
    props.onValuesChange(allValues);
  }
})(NormalForm);

export default FilterForm;
