import { Popover } from 'antd';
import React from 'react';

const renderCol = (record, text) => {
  const popverContent = <span>【{record.promotionTypeStr}】{record.activityName}(参与平台{record.activityPlat})</span>;
  let Mod;
  if (record.isShowActivity == '1') {
    Mod = <Popover content={popverContent} placement="bottom">
            <span className="pover-text">
              {text}
            </span>
          </Popover >
  } else {
    Mod = <span> { text }</span>;
  }
  return Mod;
}
const columns = [{
      title: '商品条码',
      width: '15%',
      dataIndex: 'barcode',
      render: (text, record, index) => {
        return <div className="td-wrap">
          {renderCol(record, text)}
          {(record.isShowActivity== '1')&&<span className="activity-mark"></span>}
        </div>
      }
    }, {
      title: '商品名称',
      dataIndex: 'name',
      width: '15%',
      render: (text, record, index) => {
        return renderCol(record, text)
      },
    }, {
      title: '规格',
      width: '15%',
      dataIndex: 'displayName',
      render: (text, record, index) => {
        return renderCol(record, text)
      },
    }, {
      title: '库存数量',
      width: '8%',
      dataIndex: 'inventory',
      render: (text, record, index) => {
        return renderCol(record, text)
      },
    }, {
      title: '可用库存数',
      width: '8%',
      dataIndex: 'qtyLeft',
      render: (text, record, index) => {
        return renderCol(record, text)
      },
    }, {
      title: '占用库存数',
      width: '8%',
      dataIndex: 'qtyAllocated',
      render:(text, record) => {
        let role = sessionStorage.getItem('role');
        const content = (
          <div className="inventory-popover-content">
            { role!=3&&
              <p>APP占用：{record.qtyAppAllocated}</p>
            }
            <p>退货占用：{record.qtyReturnAllocated}</p>
            <p>收银占用：{record.qtyScanAllocated}</p>
          </div>
        )
        if(record.qtyAllocated>0) {
          return <Popover content={content} placement="rightTop">
            <span style={{cursor:'pointer',color:'#35bab0'}}>{record.qtyAllocated}</span>
            </Popover >
        } else {
          return record.qtyAllocated
        }
      },
    }, {
      title: '零售价',
      width: '12%',
      dataIndex: 'toCPrice',
      render: (text, record, index) => {
        return renderCol(record, text)
      },
    }, {
      title: '活动信息',
      width: '12%',
      dataIndex: 'specialPrice',
      render: (text, record, index) => {
        let infoContent;
        if(record.promotionType=="11") {
          return <div>
                  {
                    record.activityContent&&record.activityContent.map((el,index)=>(
                      <span key={index}>满{el.leastQty}赠{el.giftQty}</span>
                    ))
                  }
                </div>
        }
        return <span>活动价：{record.specialPrice}</span>
      },
    }, {
      title: '成本价',
      width: '12%',
      dataIndex: 'averageRecPrice',
      render: (text, record, index) => {
        return renderCol(record, text)
      },
    }];
const columnsClerk = [
  {
    title: '商品条码',
    width: '15%',
    dataIndex: 'barcode',
    render: (text, record, index) => {
      return <div className="td-wrap">
        {renderCol(record, text)}
        {(record.isShowActivity== '1')&&<span className="activity-mark"></span>}
      </div>
    },
  }, {
    title: '商品名称',
    dataIndex: 'name',
    width: '15%',
    render: (text, record, index) => {
      return renderCol(record, text)
    },
  }, {
    title: '规格',
    width: '15%',
    dataIndex: 'displayName',
    render: (text, record, index) => {
      return renderCol(record, text)
    },
  }, {
    title: '库存数量',
    width: '8%',
    dataIndex: 'inventory',
    render: (text, record, index) => {
      return renderCol(record, text)
    },
  }, {
    title: '可用库存数',
    width: '8%',
    dataIndex: 'qtyLeft',
    render: (text, record, index) => {
      return renderCol(record, text)
    },
  }, {
    title: '占用库存数',
    width: '8%',
    dataIndex: 'qtyAppAllocated',
    render:(text,record)=>{
      let role = sessionStorage.getItem('role');
      const content = (
        <div className="inventory-popover-content">
          { role!=3&&
            <p>APP占用：{record.qtyAppAllocated}</p>
          }
          <p>退货占用：{record.qtyReturnAllocated}</p>
          <p>收银占用：{record.qtyScanAllocated}</p>
        </div>
      )
      if (record.qtyAppAllocated > 0) {
        return <Popover content={content} placement="rightTop">
                <span style={{ cursor: 'pointer', color: '#35bab0' }}>
                  { record.qtyAppAllocated }
                </span>
              </Popover >
      } else {
        return record.qtyAppAllocated
      }
    },
  }, {
    title: '零售价',
    width: '12%',
    dataIndex: 'toCPrice',
    render: (text, record, index) => {
      return renderCol(record, text)
    },
  },{
    title: '活动信息',
    width: '12%',
    dataIndex: 'specialPrice',
    render: (text, record, index) => {
      let infoContent;
      if(record.promotionType=="11") {
        return <div>
                {
                  record.activityContent&&record.activityContent.map((el,index)=>(
                    <span key={index}>满{el.leastQty}赠{el.giftQty}</span>
                  ))
                }
              </div>
      }
      return <span>活动价：{record.specialPrice}</span>
    },
  }];
export default{ columnsClerk, columns }
