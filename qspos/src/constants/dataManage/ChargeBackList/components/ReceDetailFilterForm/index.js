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
             <FormItem label='商品名称／条形码'>
                {getFieldDecorator('orderNo')(
                  <Input autoComplete="off" placeholder="请输入商品名称／条形码"/>
                )}
              </FormItem>
              <FormItem label='操作时间'>
                 {getFieldDecorator('createrTime')(
                   <RangePicker showTime allowClear={false}/>
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
