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
import moment from 'moment';

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
    const { startDate, endDate } =this.props;
    return(
        <Form className="qtools-condition-form">
          <div className="search-form-wrap">
              <FormItem label='退货时间'>
                 {getFieldDecorator('createrTime',{
                   initialValue:[moment(startDate,'YYYY-MM-DD'),moment(endDate,'YYYY-MM-DD')]
                 })(
                   <RangePicker showTime />
                 )}
               </FormItem>
               <FormItem label='订单状态'>
                  {getFieldDecorator('returnType',{
                    initialValue:0
                  })(
                    <Select placeholder="请选择订单状态">
                        <Option value={0} key={0}>全部</Option>
                        <Option value={1} key={1}>退货中</Option>
                        <Option value={2} key={2}>已退货</Option>
                    </Select>
                  )}
                </FormItem>
               <FormItem label='订单号'>
                  {getFieldDecorator('asnNo')(
                    <Input autoComplete="off" placeholder="请输入退货单号/门店单号"/>
                  )}
                </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.handleSubmit}><Icon type="search" />搜索</Button>
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
