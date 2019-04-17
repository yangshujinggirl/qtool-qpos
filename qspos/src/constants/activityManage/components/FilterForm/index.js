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
  render() {
    const { getFieldDecorator } = this.props.form;
    return(
        <Form className="qtools-condition-form">
          <div className="search-form-wrap">
            <FormItem label='活动类型'>
               {getFieldDecorator('activityType',{
                 initialValue:0
               })(
                 <Select placeholder="请选择订单分类" allowClear={false}>
                   <Option value={0} key={0}>全部</Option>
                   <Option value={1} key={1}>b端限时直降</Option>
                   <Option value={2} key={2}>b端活动进价</Option>
                   <Option value={3} key={3}>c端限时直降</Option>
                 </Select>
               )}
             </FormItem>
             <FormItem label='活动状态'>
                {getFieldDecorator('activityStatus',{
                  initialValue:9
                })(
                  <Select allowClear={false} placeholder="请选择订单状态">
                    <Option value={9} key={9}>全部</Option>
                    <Option value={1} key={1}>未开始</Option>
                    <Option value={2} key={2}>进行中</Option>
                    <Option value={3} key={3}>已结束</Option>
                  </Select>
                )}
            </FormItem>
            <FormItem label=''>
               <QsearchInput
                name="searchCondition"
                form={this.props.form}
                placeholder="请输入商品条码、商品名称、活动名称"
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
