import React ,{ Component } from 'react';
import { Pagination, Select } from 'antd';
import './index.less';

const Option = Select.Option;

class Qpagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectVal:"10"
    }
  }
  onShowSizeChange(currentPage, pageSize) {
    currentPage = 0;
    let params = {
      currentPage,
      limit:pageSize
    }
    this.props.onShowSizeChange&&this.props.onShowSizeChange(params)
  }

  render() {
    let { total, limit, currentPage } = this.props.data;
    total=Number(total);
    // limit=Number(limit);
    currentPage=Number(currentPage);
    currentPage++;
    const { selectVal } =this.state;
    return(
      <div className="order-manage-components">
        <Pagination
          simple
          total={total}
          pageSize={Number(limit)}
          current={currentPage}
          onChange={this.props.onChange}
          hideOnSinglePage={false}/>
        <Select value={limit} onChange={this.props.onShowSizeChange}>
          <Option key="10" value="10">10条/页</Option>
          <Option key="12" value="12">12条/页</Option>
          <Option key="15" value="15">15条/页</Option>
          <Option key="17" value="17">17条/页</Option>
          <Option key="20" value="20">20条/页</Option>
          <Option key="50" value="50">50条/页</Option>
          <Option key="100" value="100">100条/页</Option>
          <Option key="200" value="200">200条/页</Option>
        </Select>
      </div>
    )
  }
}

export default Qpagination;
