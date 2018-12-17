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
            <FormItem label='订单完成时间'>
               {getFieldDecorator('createrTime',{
                 initialValue:[moment(startDate,'YYYY-MM-DD'),moment(endDate,'YYYY-MM-DD')]
               })(
                 <RangePicker showTime allowClear={false}/>
               )}
             </FormItem>
             <FormItem label='业务类型'>
                {getFieldDecorator('orderType',{
                  initialValue:0
                })(
                  <Select placeholder="请选择业务类型">
                    <Option value={0} key={0}>全部</Option>
                    <Option value={4} key={4}>仓库直邮订单</Option>
                    <Option value={5} key={5}>保税订单</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label='订单分类'>
                 {getFieldDecorator('shareType',{
                   initialValue:0
                 })(
                   <Select placeholder="请选择订单分类">
                     <Option value={0} key={0}>全部</Option>
                     <Option value={1} key={1}>销售订单</Option>
                     <Option value={2} key={2}>退货订单</Option>
                   </Select>
                 )}
               </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.handleSubmit}><Icon type="search" />搜索</Button>
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.props.exportData}>导出数据</Button>
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
