import React ,{ Component } from 'react';
import { Pagination } from 'antd';
import './index.css';

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
  initPageSize() {
    const { sizeOptions } =this.state;
    if(sizeOptions == '1') {
      return ['15','30','50','100','200','500']
    } else {
      return ['10','12','15','17','20','50','100','200']
    }
  }

  render() {
    let { total, limit, currentPage } = this.props.data;
    total=Number(total);
    limit=Number(limit);
    currentPage=Number(currentPage);
    currentPage++;
    return(
      <div className="common-pagination-components">
        <Pagination
          showSizeChanger
          total={total}
          pageSize={limit}
          current={currentPage}
          pageSizeOptions={this.initPageSize()}
          onChange={this.props.onChange}
          onShowSizeChange={this.onShowSizeChange.bind(this)}
          hideOnSinglePage={false}/>
      </div>
    )
  }
}

export default Qpagination;
