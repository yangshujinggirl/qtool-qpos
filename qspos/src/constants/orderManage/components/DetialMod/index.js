import React , { Componet } from 'react';
import { Card,Row, Col, Table  } from 'antd';
import { RechargeColumns, OrderColumns } from '../columns';
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
function RechargeDetailMod() {
  return (
    <div className="order-detail-info-wrap">
      <Card title="订单信息">
        <Row wrap>
          <Col {...colans3} className="row">充值单号：<span className="field">XS6728738933334</span></Col>
          <Col {...colans3} className="row">充值时间：<span className="field">2018-07-30 12:22:13</span></Col>
          <Col {...colans3} className="row">收银员：<span className="field">XS6728738933334</span></Col>
          <Col {...colans3} className="row">业务类型：<span className="field">门店POS订单</span></Col>
          <Col {...colans3} className="row">订单状态：<span className="field">已完成</span></Col>
        </Row>
      </Card>
      <Card title="充值信息">
        <Table
          className="goods-table"
          pagination={false}
          columns={RechargeColumns}
          dataSource={data}
          bordered/>
      </Card>
      <Card title="结算信息">
        <Row wrap>
          <Col span={24} className="row">结算收银：<span className="field">10003</span>「微信扫码」</Col>
        </Row>
      </Card>
      <Card title="会员信息">
        <Row wrap>
          <Col {...colans3} className="row">会员姓名：<span className="field">XS6728738933334</span></Col>
          <Col {...colans3} className="row">会员手机号：<span className="field">XS6728738933334</span></Col>
          <Col {...colans3} className="row">本次积分：<span className="field">18210086011</span></Col>
        </Row>
      </Card>
    </div>
  )
}
//pos订单
function PosDetailMod() {
  return (
    <div className="order-detail-info-wrap">
      <Card title="订单信息">
        <Row wrap>
          <Col {...colans} className="row">销售订单：<span className="field">XS6728738933334</span></Col>
          <Col {...colans} className="row">销售时间：<span className="field">XS6728738933334</span></Col>
          <Col {...colans} className="row">收银员：<span className="field">XS6728738933334</span></Col>
          <Col {...colans} className="row">业务类型：<span className="field">XS6728738933334</span></Col>
          <Col {...colans} className="row">订单状态：<span className="field">门店POS订单</span></Col>
          <Col span={24} className="row return-goods">此订单退货2次，退货单号：<span className="field">XS6728738933334</span></Col>
        </Row>
      </Card>
      <Card title="商品信息">
        <Table
          className="goods-table"
          pagination={false}
          columns={OrderColumns}
          dataSource={data}
          bordered/>
      </Card>
      <Card title="结算信息">
        <Row wrap>
          <Col {...colans2} className="row">
            商品总价：<span className="field">229.00</span>「零售总价：480.00，折扣优惠：-43.50，抹零优惠：-0.50」
          </Col>
          <Col span={24} className="row return-goods">结算收银：<span className="field">10003</span>「微信扫码」</Col>
        </Row>
      </Card>
      <Card title="会员信息">
        <Row wrap>
          <Col {...colans} className="row">会员姓名：<span className="field">XS6728738933334</span></Col>
          <Col {...colans} className="row">会员手机号：<span className="field">XS6728738933334</span></Col>
          <Col {...colans} className="row">本次积分：<span className="field">18210086011</span></Col>
        </Row>
      </Card>
    </div>
  )
}
//App订单
function AppDetailMod() {
  return (
    <div className="order-detail-info-wrap">
      <Card title="订单信息">
        <Row wrap>
          <Col {...colans} className="row">销售单号：<span className="field">XS6728738933334</span></Col>
          <Col {...colans} className="row">接单时间：<span className="field">2018-07-30 12:22:13</span></Col>
          <Col {...colans} className="row">接单员：<span className="field">XS6728738933334</span></Col>
          <Col {...colans} className="row">业务类型：<span className="field">门店APP订单</span></Col>
          <Col {...colans} className="row">订单状态：<span className="field">已接单</span></Col>
          <Col {...colans} className="row">配送方式：<span className="field">门店自提</span></Col>
          <Col {...colans} className="row">订单金额：<span className="field">434.00</span></Col>
          <Col {...colans} className="row">退款金额：<span className="field">0.00</span></Col>
          <Col {...colans} className="row">实际订单金额：<span className="field">434.00</span></Col>
          <Col {...colans} className="row">完成时间：<span className="field">门店POS订单</span></Col>
          <Col span={24} className="row return-goods">此订单退货2次，退货单号：<span className="field">XS6728738933334</span></Col>
        </Row>
      </Card>
      <Card title="商品信息">
        <Table
          className="goods-table"
          pagination={false}
          columns={OrderColumns}
          dataSource={data}
          bordered/>
          {/* 已关闭状态<span>此订单商品已全部取消发货</span> */}
      </Card>
      <Card title="结算信息">
        <Row wrap>
          <Col {...colans2} className="row">
            商品总价：<span className="field">229.00</span>「零售总价：480.00，折扣优惠：-43.50，抹零优惠：-0.50」
          </Col>
          <Col {...colans} className="row">配送费：<span className="field">0.00</span></Col>
          <Col span={24} className="row return-goods">
            结算收银：<span className="field">10003</span>「微信扫码」
          </Col>
        </Row>
      </Card>
      <Card title="会员信息">
        <Row wrap>
          <Col {...colans} className="row">会员姓名：<span className="field">张三丰</span></Col>
          <Col {...colans} className="row">会员手机号：<span className="field">18210086011</span></Col>
          <Col {...colans} className="row">本次积分：<span className="field">434</span></Col>
        </Row>
      </Card>
      {/*同城配送,门店邮寄 配送信息*/}
      <Card title="配送信息">
        <Row wrap>
          <Col {...colans3} className="row">配送序号：<span className="field">XS6728738933334</span></Col>
          <Col {...colans3} className="row">收件人：<span className="field">XS6728738933334</span></Col>
          <Col {...colans3} className="row">收件人电话：<span className="field">18210086011</span></Col>
          <Col {...colans3} className="row">收件地址：
            <span className="field address-wrap">
              <span className="address">上海市闵行区上海时尚园1718号3号楼3层上海市闵行区上海时尚园1718号3号楼3层</span>
            </span>
            </Col>
        </Row>
      </Card>
    </div>
  )
}
//退货订单
function ReturnSalesMod() {
  return (
    <div className="order-detail-info-wrap">
      <Card title="订单信息">
        <Row wrap>
          <Col {...colans3} className="row">退货单号：<span className="field">XS6728738933334</span></Col>
          <Col {...colans3} className="row">退货时间：<span className="field">2018-07-30 12:22:13</span></Col>
          <Col {...colans3} className="row">退货员：<span className="field">XS6728738933334</span></Col>
          <Col {...colans3} className="row">关联订单：<span className="field">XS92837123222223<span className="remark">「门店APP订单」</span></span></Col>
          <Col {...colans3} className="row">业务类型：<span className="field">门店APP订单</span></Col>
          <Col {...colans3} className="row">订单状态：<span className="field">已退货</span></Col>
        </Row>
      </Card>
      <Card title="商品信息">
        <Table
          className="goods-table"
          pagination={false}
          columns={OrderColumns}
          dataSource={data}
          bordered/>
          {/* 已关闭状态<span>此订单商品已全部取消发货</span> */}
      </Card>
      <Card title="结算信息">
        <Row wrap>
          <Col span={24} className="row">
            实退总价：<span className="field">229.00</span>
          </Col>
          <Col span={24} className="row return-goods">
            结算退款：<span className="field">10003</span>「微信扫码」
          </Col>
        </Row>
      </Card>
      <Card title="会员信息">
        <Row wrap>
          <Col {...colans} className="row">会员姓名：<span className="field">张三丰</span></Col>
          <Col {...colans} className="row">会员手机号：<span className="field">18210086011</span></Col>
          <Col {...colans} className="row">本次积分：<span className="field">434</span></Col>
        </Row>
      </Card>
    </div>
  )
}

export default {
  PosDetailMod,
  AppDetailMod,
  ReturnSalesMod,
  RechargeDetailMod
};
