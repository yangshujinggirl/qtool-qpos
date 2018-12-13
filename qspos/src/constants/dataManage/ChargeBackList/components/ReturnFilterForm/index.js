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
                 {getFieldDecorator('createrTime')(
                   <RangePicker showTime allowClear={false}/>
                 )}
               </FormItem>
               <FormItem label='订单状态'>
                  {getFieldDecorator('type',{
                    initialValue:'-1'
                  })(
                    <Select placeholder="请选择订单状态">
                        <Option value="-1" key="-1">全部</Option>
                        <Option value="10" key="10">待收货</Option>
                        <Option value="20" key="20">收货中</Option>
                        <Option value="30" key="30">已收货</Option>
                        <Option value="40" key="40">已撤销</Option>
                    </Select>
                  )}
                </FormItem>
               <FormItem label='订单号'>
                  {getFieldDecorator('orderNo')(
                    <Input autoComplete="off" placeholder="请输入订单号"/>
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
