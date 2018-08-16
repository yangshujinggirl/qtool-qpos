import React ,{ Component } from 'react';
import { Pagination } from 'antd';
import './index.css';

class Qpagination extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { total, limit, currentPage } = this.props.data;
    total = Number(total);
    limit = Number(limit);
    currentPage = Number(currentPage);
    currentPage++;
    return(
      <div className="common-pagination-components">
        <Pagination
          showQuickJumper
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
