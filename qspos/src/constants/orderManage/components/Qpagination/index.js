import React ,{ Component } from 'react';
import { Pagination } from 'antd';
import './index.less';

class Qpagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sizeOptions:this.props.sizeOptions||'1',
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
    limit=Number(limit);
    currentPage=Number(currentPage);
    currentPage++;
    return(
      <div className="order-manage-components">
        <Pagination
          total={total}
          pageSize={limit}
          current={currentPage}
          onChange={this.props.onChange}
          hideOnSinglePage={false}/>
      </div>
    )
  }
}

export default Qpagination;
