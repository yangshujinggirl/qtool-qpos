import React , { Componet } from 'react';
import { connect } from 'dva';
import { Card,Row, Col, Table  } from 'antd';
import { RechargeColumns, OrderColumns, ReturnOdColumns } from '../columns';
import {
  BusinessTypeMap,
  OrderStatusMap,
  DeliveryMap
} from '../MapData';
import './index.less';

const colans = {
        xs:24,
        sm:24,
        md:12,
        lg:6,
        xl:6
      }
const colans2 = {
        xs:24,
        sm:24,
        md:24,
        lg:22,
        xl:16
      }
const colans3 = {
        xs:24,
        sm:24,
        md:12,
        lg:8,
        xl:8
      }

const data = [{
  code:'0',
  name:'0',
  gg:'0',
  num:'0',
  price:'0',
  dis:'0',
  total:'0',
}]
//充值订单
function RechargeDetailMod({detailInfo}) {
  const { cardMoneyChargeInfo, mbCard, businessType } = detailInfo;
  let rechargeList=[{
        beforeAmount:cardMoneyChargeInfo.beforeAmount,
        afterAmount:cardMoneyChargeInfo.afterAmount,
        amount:cardMoneyChargeInfo.amount,
        key:0
      }]
  return (
    <div className="order-detail-info-wrap">
      <Card title="订单信息">
        <div className="row-wrap">
          <div className="row">充值单号：<span className="field">{cardMoneyChargeInfo.chargeNo}</span></div>
          <div className="row">充值时间：<span className="field">{cardMoneyChargeInfo.createTime}</span></div>
          <div className="row">收银员：<span className="field">{cardMoneyChargeInfo.nickname}</span></div>
          <div className="row">业务类型：<span className="field">{BusinessTypeMap[businessType]}</span></div>
          <div className="row">订单状态：<span className="field">已完成</span></div>
        </div>
      </Card>
      <Card title="充值信息">
        <Table
          className="goods-table"
          pagination={false}
          columns={RechargeColumns}
          dataSource={rechargeList}
          bordered/>
      </Card>
      <Card title="结算信息">
        <div className="row-wrap">
          <div className="row">
            结算收银：<span className="field">{cardMoneyChargeInfo.amount}</span>「{cardMoneyChargeInfo.typeStr}」
          </div>
        </div>
      </Card>
      <Card title="会员信息">
        <div className="row-wrap">
          <div className="row" className="row">会员姓名：<span className="field">{mbCard.name}</span></div>
          <div className="row" className="row">会员手机号：<span className="field">{mbCard.mobile}</span></div>
          <div className="row" className="row">会员等级：<span className="field">{mbCard.levelStr}</span></div>
        </div>
      </Card>
    </div>
  )
}
//pos销售订单
function PosDetailMod({detailInfo}) {
  let { odOrder, orderDetails, orOrderPay, mbCard } =detailInfo;
  orderDetails.length>0&&orderDetails.map((el,index) => el.key = `${el.pdSpuId}_${el.pdSkuId}_${index}`);
  return (
    <div className="order-detail-info-wrap">
      <Card title="订单信息">
        <div className="row-wrap">
          <div className="row" className="row">销售订单：<span className="field">{odOrder.orderNo}</span></div>
          <div className="row" className="row">销售时间：<span className="field">{odOrder.saleTime}</span></div>
          <div className="row" className="row">收银员：<span className="field">{odOrder.nickname}</span></div>
          <div className="row" className="row">业务类型：<span className="field">{BusinessTypeMap[odOrder.businessType]}</span></div>
          <div className="row" className="row">订单状态：<span className="field">{OrderStatusMap[odOrder.orderStatus]}</span></div>
          {
            odOrder.returnOrderNo&&
            <div className="row return-goods">
              此订单退货{odOrder.returnQty}次，退货单号：
              {
                odOrder.returnOrderNo.map((el,index) =>(
                  <span className="field" key={index}>
                    {el}{((odOrder.returnOrderNo.length-1)!=index&&odOrder.returnOrderNo.length>1)&&<span>，</span>}
                  </span>
                ))
              }
            </div>
          }
        </div>
      </Card>
      <Card title="商品信息">
        <Table
          className="goods-table"
          pagination={false}
          columns={OrderColumns}
          dataSource={orderDetails}
          bordered/>
      </Card>
      <Card title="结算信息">
        <div>
          <div className="row">
            商品总价：
            <span className="field">{odOrder.totalAmount}</span>
            「零售总价：{odOrder.retailTotalPrice}，折扣优惠：{odOrder.discountAmount}，抹零优惠：{odOrder.cutAmount}」
          </div>
          <div className="row return-goods">结算收银：
            <span className="field">{odOrder.totalAmount}</span>
            「{
              orOrderPay.map((el,index) =>(
                <span key={index}>
                  {el.typeStr}：{el.amount}{(index==0&&orOrderPay.length>1)&&<span>，</span>}
                </span>
              ))
            }」
          </div>
        </div>
      </Card>
      {
        mbCard&&
        <Card title="会员信息">
          <div className="row-wrap">
            <div className="row">
              会员姓名：<span className="field">{mbCard.name}</span>
              {mbCard.isLocalShopStr=='异店'&&<span className="vip-label">{mbCard.isLocalShopStr}</span>}
            </div>
            <div className="row">会员手机号：<span className="field">{mbCard.mobile}</span></div>
            <div className="row">本次积分：<span className="field">{mbCard.point}</span></div>
          </div>
        </Card>
      }
    </div>
  )
}
//App销售订单
function AppDetailMod({detailInfo}) {
  const { odOrder, orderDetails, orOrderPay, mbCard } =detailInfo;
  orderDetails.length>0&&orderDetails.map((el,index) => el.key = `${el.pdSpuId}_${el.pdSkuId}_${index}`);
  const brandPro=()=>{
    let mod;
    switch(odOrder.deliveryType) {
      case '2'://同城配送
        if(odOrder.skusType=='2') {
          mod = <label>「品牌直供，免配送费」</label>
        } else {
          mod = <labe></labe>
        }
      break;
      case '3'://门店邮寄
        if(odOrder.skusType=='2') {
          mod = <label>「品牌直供，免配送费」</label>
        } else if(odOrder.expressType == '3'){
          mod = <label>「用户到付」</label>
        } else {
          mod = <labe></labe>
        }
        break;
      default:
        mod = <labe></labe>
    }
    return mod;
  }
  return (
    <div className="order-detail-info-wrap">
      <Card title="订单信息">
        <div className="row-wrap">
          <div className="row">销售单号：<span className="field">{odOrder.orderNo}</span></div>
          <div className="row">接单时间：<span className="field">{odOrder.createTime}</span></div>
          <div className="row">接单员：<span className="field">{odOrder.nickname}</span></div>
          <div className="row">业务类型：<span className="field">{BusinessTypeMap[odOrder.businessType]}</span></div>
          <div className="row">订单状态：<span className="field">{OrderStatusMap[odOrder.orderStatus]}</span></div>
          <div className="row">配送方式：<span className="field">{DeliveryMap[odOrder.deliveryType]}</span></div>
          <div className="row">订单金额：<span className="field">{odOrder.amount}</span></div>
          <div className="row">退款金额：<span className="field">{odOrder.refundAmount}</span></div>
          <div className="row">实际订单金额：<span className="field">{odOrder.actualOrderAmount}</span></div>
          {
            odOrder.orderStatus=='3'&&
            <div className="row">完成时间：<span className="field">{odOrder.completeTime}</span></div>
          }
          {
            odOrder.returnOrderNo&&
            <div className="row return-goods">
              此订单退货{odOrder.returnQty}次，退货单号：
              {
                odOrder.returnOrderNo.map((el,index)=>(
                  <span className="field" key={index}>
                    {el}{((odOrder.returnOrderNo.length-1)!=index&&odOrder.returnOrderNo.length>1)&&<span>，</span>}
                  </span>
                ))
              }
            </div>
          }
        </div>
      </Card>
      <Card title="商品信息">
          {
            odOrder.orderStatus=='4'?
            <p className="closed-goods">此订单商品已全部取消发货</p>
            :
            <Table
              className="goods-table"
              pagination={false}
              columns={OrderColumns}
              dataSource={orderDetails}
              bordered/>
          }
      </Card>
      <Card title="结算信息">
        <div>
          <div className="row-wrap">
            <div className="row">
              商品总价：<span className="field">{odOrder.totalAmount}</span>
              「零售总价：{odOrder.retailTotalPrice}，折扣优惠：{odOrder.discountAmount}」
            </div>
            <div className="row">
              配送费：<span className="field">{odOrder.deliveryCost}</span>
              { brandPro() }
            </div>
          </div>
          <div className="row return-goods">
            结算收银：<span className="field">{odOrder.payAmount}</span>
            「{
              orOrderPay.map((el,index)=>(
                <span key={index}>{el.typeStr}：{el.amount}{(index==0&&orOrderPay.length>1)&&<span>，</span>}</span>
              ))
            }」
          </div>
        </div>
      </Card>
      {
        mbCard&&
        <Card title="会员信息">
          <div className="row-wrap">
            <div className="row">会员姓名：<span className="field">{mbCard.name}</span></div>
            <div className="row">会员手机号：<span className="field">{mbCard.mobile}</span></div>
            <div className="row">本次积分：<span className="field">{mbCard.point}</span></div>
          </div>
        </Card>
      }
      {/*同城配送,门店邮寄 配送信息*/}
      {
        odOrder.deliveryType!=1&&
        <Card title="配送信息">
          <div className="row-wrap">
            <div className="row">配送序号：<span className="field">{odOrder.orderNum}</span></div>
            <div className="row">收件人：<span className="field">{odOrder.receiver}</span></div>
            <div className="row">收件人电话：<span className="field">{odOrder.phoneNo}</span></div>
            <div className="row">收件地址：
              <span className="field">
                {odOrder.address}
              </span>
            </div>
          </div>
        </Card>
      }
    </div>
  )
}
//仓库，保税销售订单
function OtherDetailMod({detailInfo}) {
  const { odOrder, orderDetails, mbCard } =detailInfo;
  orderDetails.length>0&&orderDetails.map((el,index) => el.key = `${el.pdSpuId}_${el.pdSkuId}_${index}`);
  const brandPro=()=>{
    let mod;
    if(odOrder.businessType != '3') {
      mod = <labe></labe>
    };
    if(odOrder.skusType=='2') {
      mod = <label>「品牌直供，免配送费」</label>
    } else if(odOrder.expressType == '3'){
      mod = <label>「用户到付」</label>
    } else {
      mod = <label>「用户支付配送费：{odOrder.userActualDeliveryFee}，订单实际配送费：{odOrder.orderActualDeliveryFee}」</label>
    }
    return mod;
  }
  return (
    <div className="order-detail-info-wrap">
      <Card title="订单信息">
        <div className="row-wrap">
          <div className="row">销售单号：<span className="field">{odOrder.orderNo}</span></div>
          <div className="row">销售时间：<span className="field">{odOrder.saleTime}</span></div>
          <div className="row">业务类型：<span className="field">{BusinessTypeMap[odOrder.businessType]}</span></div>
          <div className="row">订单状态：<span className="field">{OrderStatusMap[odOrder.orderStatus]}</span></div>
          {
            odOrder.returnOrderNo&&
            <div className="row return-goods">
              此订单退货{odOrder.returnQty}次，退货单号：
              {
                odOrder.returnOrderNo.map((el,index)=> (
                  <span className="field" key={index}>
                    {el}{((odOrder.returnOrderNo.length-1)!=index&&odOrder.returnOrderNo.length>1)&&<span>，</span>}
                  </span>
                ))
              }
            </div>
          }
        </div>
      </Card>
      <Card title="商品信息">
        <Table
          className="goods-table"
          pagination={false}
          columns={OrderColumns}
          dataSource={orderDetails}
          bordered/>
      </Card>
      <Card title="结算信息">
        <div>
          <div className="row">
            商品总价：<span className="field">{odOrder.totalAmount}</span>
            「零售总价：{odOrder.retailTotalPrice}，折扣优惠：{odOrder.discountAmount}」
          </div>
          <div className="row-wrap return-goods">
            <div className="row">销售利润：<span className="field">{odOrder.salesProfit}</span></div>
            <div className="row">
              配送费差价：<span className="field">{odOrder.deliverPayDifference}</span>
              {
                brandPro()
              }
            </div>
          </div>
          <div className="row return-goods">
            结算分成：<span className="field">{odOrder.billingSplit}</span>
        </div>
      </div>
      </Card>
      {
        mbCard&&
        <Card title="会员信息">
          <div className="row-wrap">
            <div className="row">会员姓名：<span className="field">{mbCard.name}</span></div>
            <div className="row">会员手机号：<span className="field">{mbCard.mobile}</span></div>
            <div className="row">本次积分：<span className="field">{mbCard.point}</span></div>
          </div>
        </Card>
      }
      <Card title="配送信息">
        <div className="row-wrap">
          <div className="row">收件人：<span className="field">{odOrder.receiver}</span></div>
          <div className="row">收件人电话：<span className="field">{odOrder.phoneNo}</span></div>
          <div className="row">收件地址：
            <span className="field">
              {odOrder.address}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
//退货订单
function ReturnSalesMod({detailInfo}) {
  const { odReturn, returnOrderDetails, mbCard } =detailInfo;
  returnOrderDetails&&returnOrderDetails.map((el,index) =>el.key = index)
  return (
    <div className="order-detail-info-wrap">
      <Card title="订单信息">
        <div className="row-wrap">
          <div className="row">退货单号：<span className="field">{odReturn.returnNo}</span></div>
          <div className="row">退货时间：<span className="field">{odReturn.createTime}</span></div>
          {/*仓库，保税订单没有退货员*/}
          <div className="row">退货员：<span className="field">{odReturn.nickname}</span></div>
          <div className="row">
            关联订单：<span className="field">{odReturn.orderNo}<span className="remark">「{BusinessTypeMap[odReturn.businessType]}」</span></span>
        </div>
          <div className="row">业务类型：<span className="field">{BusinessTypeMap[odReturn.businessType]}</span></div>
          <div className="row">订单状态：<span className="field">{OrderStatusMap[odReturn.orderStatus]}</span></div>
        </div>
      </Card>
      <Card title="商品信息">
        <Table
          className="goods-table"
          pagination={false}
          columns={ReturnOdColumns}
          dataSource={returnOrderDetails}
          bordered/>
      </Card>
      <Card title="结算信息">
        <div>
          <div className="row">
            实退总价：<span className="field">{odReturn.realRefundTotalAmount}</span>
            {
              odReturn.businessType=='1'&&
              <span>「退货总价：{odReturn.refundTotalAmount}，抹零金额：{odReturn.cutAmount}」</span>
            }
          </div>
          {
            (odReturn.businessType=='1'||odReturn.businessType=='2')?
            <div className="row return-goods">
              结算退款：<span className="field">{odReturn.billingRefundAmount}</span>
              「{odReturn.businessType=='1'?odReturn.typeStr:'APP支付'}」
            </div>
            :
            <div className="row return-goods">
              分成扣减：<span className="field">{odReturn.deductionAmount}</span>
            </div>
          }
        </div>
      </Card>
      {
        mbCard&&
        <Card title="会员信息">
          <div className="row-wrap">
            <div className="row">会员姓名：<span className="field">{mbCard.name}</span></div>
            <div className="row">会员手机号：<span className="field">{mbCard.mobile}</span></div>
            <div className="row">扣减积分：<span className="field">{mbCard.point}</span></div>
          </div>
        </Card>
      }
    </div>
  )
}

function DetailMod({ orderManage }) {
  const { orderCategory, businessType } =orderManage.detailInfo;
  if(!orderCategory) {
    return <span>业务类型错误</span>;
  }
  let Mod;
  //businessType 1：pos,2:app,3:仓库，4：保税
  //orderCategory:1:销售，2充值，3退货
  switch(orderCategory) {
    case "1":
      if(businessType == '1') {
        Mod = PosDetailMod;
      } else if (businessType == '2'){
        Mod = AppDetailMod;
      }else{
        Mod = OtherDetailMod;
      }
      break;
    case "2":
      Mod = RechargeDetailMod;
      break;
    case "3":
      Mod = ReturnSalesMod;
      break;
    default:
      Mod = <span>业务类型错误</span>
      break;
  }
  return <Mod detailInfo={orderManage.detailInfo}/>
}
function mapStateToProps(state){
  const { orderManage } = state;
  return { orderManage };
}
export default connect(mapStateToProps)(DetailMod);
