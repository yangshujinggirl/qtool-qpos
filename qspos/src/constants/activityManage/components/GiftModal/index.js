import { Modal, Table } from 'antd';
import './index.less';

const columns = [
  {
    title: '商品条码',
    dataIndex: 'pdCode',
    render: text => <a>{text}</a>,
  },
  {
    title: '商品名称',
    dataIndex: 'pdName',
  },
  {
    title: '规格',
    dataIndex: 'pdType1Val',
  },
  {
    title: '零售价',
    dataIndex: 'sailPrice',
  },
];
const GiftModal=({...props})=> {
  return (
    <Modal
      title="赠品明细"
      className="gift-modal-wrap"
      visible={props.visible}
      onOk={props.onOk}
      onCancel={props.onCancel}
      footer={null}>
      <div className="gift-list-content">
        {
          props.dataSource&&props.dataSource.map((el,index)=> {
            let isYuan = el.activityType=='20'?true:false;
            el.gifts&&el.gifts.map((item,idx)=> item.key =idx)
            return <Table
                    className="gift-table-list-wrap"
                    key={index}
                    columns={columns}
                    dataSource={el.gifts}
                    bordered
                    pagination={false}
                    title={() => {
                      return <span>{`阶梯${++index}：满${isYuan?el.rule.leastAmount:el.rule.leastQty}${isYuan?'元':'件'}可得如下赠品：`}</span>
                    }
                  }/>
          })
        }
      </div>
    </Modal>
  )
}
export default GiftModal;
