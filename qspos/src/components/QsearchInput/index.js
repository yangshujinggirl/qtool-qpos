import React , { Component } from 'react';
import { Input, Button, Icon } from 'antd';
import './index.less';

const Search = Input.Search;

function QsearchInput({placeholder, handleSearch, form, name}) {
  return(
    <div className="search-input-components">
      {form.getFieldDecorator(name)(
         <div className="components-wrap">
           <Input placeholder={placeholder}/>
           <Button type="primary" onClick={handleSearch}>
             <Icon type="search" />
             搜索
           </Button>
         </div>
      )}
    </div>
  )
}

export default QsearchInput;
