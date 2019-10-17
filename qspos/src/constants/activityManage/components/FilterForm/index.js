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
import  { activityStatusOption, activityTypeOption } from '../../optionMap';

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
                   {
                     activityTypeOption.map((el)=> (
                       <Option value={el.key} key={el.key}>{el.value}</Option>
                     ))
                   }
                 </Select>
               )}
             </FormItem>
             <FormItem label='活动状态'>
                {getFieldDecorator('activityStatus',{
                  initialValue:0
                })(
                  <Select allowClear={false} placeholder="请选择订单状态">
                    {
                      activityStatusOption.map((el)=> (
                        <Option value={el.key} key={el.key}>{el.value}</Option>
                      ))
                    }
                  </Select>
                )}
            </FormItem>
            <FormItem label='商品条码'>
              {getFieldDecorator('pdCode')(
                <Input placeholder="请输入商品条码" autoComplete="off"/>
              )}
             </FormItem>
             <FormItem label=''>
                <QsearchInput
                 name="activityName"
                 form={this.props.form}
                 placeholder="活动名称"
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
