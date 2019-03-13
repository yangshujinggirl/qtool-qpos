
import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Tooltip, Icon ,Card} from 'antd';
import { Link } from 'dva/router'
import {GetServerData} from '../../../services/services';

function Cardlist({ cardlist }) {
  return (
    <div className='mbindocard'>
     <Card title="会员基本信息">
        <div className='cardlist clearfix'>
            {
              cardlist.map((item,index)=>(
                item.tips?
                <div className='cardlist_item' key={index}>
                  <label>{item.lable}：</label>
                  <Tooltip title={item.tips}>
                      <span>{item.text?item.text:0}&nbsp;<Icon type="exclamation-circle-o"/></span>
                  </Tooltip>
                </div>
                :
                <div className='cardlist_item' key={index}>
                  <label>{item.lable}：</label><span>{item.text?item.text:0}</span>
                </div>
              ))
            }
        </div>
      </Card>
    </div>
  )
}

export default Cardlist;
