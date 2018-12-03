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
const FormItem = Form.Item;
const Option =  Select.Option;
const Search = Input.Search;

class NormalForm extends Component {

  handelSearch=(e)=> {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err,values) => {
      this.props.handelSearch(values)
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const SearchBtn=()=>(
      <label onClick={this.handelSearch}>
        <Icon type="search" />
        <label className="search-text">搜索</label>
      </label>
    )
    return(
      <Form className="qpos-conditon-form">
        <div className="form-wrap">
          <FormItem label="生日倒计时">
            {getFieldDecorator('backDays',{
              initialValue:7
            })(
              <Select allowClear>
                <Option value={7} key={7}>7天内</Option>
                <Option value={15} key={15}>15天内</Option>
                <Option value={30} key={30}>30天内</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="">
            {getFieldDecorator('keyWords')(
              <Search
                placeholder="请输入会员姓名，手机号"
                autoComplete="off"
                className="search-input"
                enterButton={SearchBtn()}/>
            )}
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
