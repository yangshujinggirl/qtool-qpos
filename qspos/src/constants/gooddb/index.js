import React from 'react';
import { connect } from 'dva';
import Header from '../../components/header/Header';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Upload,AutoComplete} from 'antd';
import {GetServerData} from '../../services/services';
import "./gooddb.css";

import Searchcomponent from './search'


//在adjust组件中
class EditableTable extends React.Component {
  	constructor(props) {
    	super(props);
    	this.columns = [{
            title: '商品条码',
            dataIndex: 'barcode',
            width:"12%"
        },{
            title: '商品名称',
            dataIndex: 'name',
            width:"12%"
        },{
            title: '规格',
            dataIndex: 'displayName',
            width:"12%"
        }, {
      		title: '库存数量',
              dataIndex: 'inventory',
              width:"8%"
    	}, {
      		title: '调拨数量',
            dataIndex: 'exchangeQty',
            width:"8%",
      		render: (text, record, index) => {
            return (
            <Input className="adjust-inputwidth" onChange={this.qtyhindchange.bind(this,index)}
                   onBlur={this.qtyhindBlur.bind(this,record,index)}
                   value={this.state.dataSource[index].exchangeQty}
                    autoComplete="off"
            />
        		)
      		}
    	},{
            title: '进货单价',
            dataIndex: 'toBPrice',
            width:"8%"
        },{
            title: '零售单价',
            dataIndex: 'toCPrice',
            width:"8%"
        },{
            title: '调拨总价',
            dataIndex: 'exchangePrice',
            width:"8%",
            render: (text, record, index) => {
                return (
                    <Input className="adjust-inputwidth" onChange={this.hindchange.bind(this,index)}
                            onBlur={this.hindBlur.bind(this,record,index)}
                            onFocus={this.hindFous.bind(this,record,index)}
                            value={this.state.dataSource[index].exchangePrice}
                            autoComplete="off"
                    />
                )
            }
        }];
	    this.state = {
	      	dataSource: [], //元数据
	      	count: 2,
          inputvalue:'',
          total:0,
          page:1,
          windowHeight:'',
          dataSources:[],  //需求门店的数据源
          shopList:[],   //需求门店
          shopId:null
        };
        this._isMounted = false;
    }

    onSelect=(value)=>{
       let shopList = this.state.shopList
       let shopId
       for(let i=0;i<shopList.length;i++){
         if(shopList[i].name == value){
           shopId = shopList[i].spShopId
         }
       }
       this.setState({
         shopId:shopId
       })
       this.props.getShopId(shopId)
    }

     handleChange=(value)=>{
       if(value == ''){
         this.setState({
           shopId:null
         })
         this.props.getShopId(null)
       }
     }

    handleSearch = (value) => {
        let data={name:value};
        const result=GetServerData('qerp.qpos.pd.exchange.shop.list',data);
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                let shopList=json.shops;
                let dataSources=[];
                for(let i=0;i<shopList.length;i++){
                    dataSources.push(shopList[i].name)
                }
                this.setState({
                    shopList:shopList,
                    dataSources:dataSources
                })
            }
        })
    }

    setdatasouce=(messages,total)=>{
        //设置dataSource和total
        this.setState({
            dataSource:messages,
            total:total,
            page:1
        },function(){
            this.props.getNewData(this.state.dataSource)
        })
    }

    //在改变调拨数量时
    qtyhindchange=(index,e)=>{
        const values=e.target.value
        const dataSource=this.state.dataSource.slice(0)
        const re=/^[0-9]*$/
        const str=re.test(values)
        if(str){
            dataSource[index].exchangeQty = values
            let price = String(values*dataSource[index].toBPrice)
            if(price.indexOf('.') == -1){
              price = price + '.00'
            }
            dataSource[index].exchangePrice = price
            this.setState({
                dataSource:dataSource
            },function(){
                this.props.getNewData(this.state.dataSource)
            })
        }
    }

  /**
   * 调拨数量失去焦点
   * @param record
   * @param index
   * @param e
     */
    qtyhindBlur=(record,index,e)=>{
        const dataSource=this.state.dataSource
        const qtyvalue=e.target.value
        let price = dataSource[index].exchangePrice
        let bPrice = dataSource[index].toBPrice
        let cPrice = dataSource[index].toCPrice
        if(qtyvalue != ''){
          if(dataSource[index].exchangeQty == undefined && price == null){  //用户先点击调拨数量,后点击调拨总价
            if(qtyvalue){
              if(Number(qtyvalue)<Number(record.inventory)){
                dataSource[index].exchangeQty=qtyvalue
                this.setState({
                  dataSource:dataSource
                })
              }else{
                message.error('第'+ (index+1) + '行商品调拨数量填写错误。调拨数量不得大于商品库存数量',1.5)
              }
            }
          }else{
            if(Number(qtyvalue) < Number(record.inventory)){  //数量符合,后校验钱
              if(price != null){
                if(price > parseFloat(cPrice*qtyvalue)){  //不正常
                  message.error('第'+ (index+1) +'行商品调拨总价填写错误。调拨总价不得大于商品零售总价',1.5)
                }else if(price < parseFloat(bPrice*qtyvalue)){
                  message.error('第'+ (index+1) +'行商品调拨总价填写错误。调拨总价不得小于商品进货总价',1.5)
                }else{
                  dataSource[index].exchangeQty=qtyvalue
                  this.setState({
                    dataSource:dataSource
                  })
                }
              }
            }else{
              message.error('第'+ (index+1) + '行商品调拨数量填写错误。调拨数量不得大于商品库存数量',1.5)
            }
          }
        }else{
          dataSource[index].exchangeQty = undefined
          this.setState({
            dataSource:dataSource
          })
        }
    }

    hindchange=(index,e)=>{
      const values=e.target.value
		  const re=/^([0-9]*)+((\.)|.[0-9]{1,2})?$/
      const str=re.test(values)
		if(str){
			const datasouce=this.state.dataSource.splice(0)
			datasouce[index].exchangePrice=values
			this.setState({
                dataSource:datasouce
            },function(){
                this.props.getNewData(this.state.dataSource)
            })
		}
    }

  /**
   * 调拨总价获得焦点
   * @param record
   * @param index
   * @param e
     */
    hindFous=(record,index,e)=>{
      const dataSource=this.state.dataSource
      if(dataSource[index].exchangeQty == undefined){
        message.error('请先输入调拨数量',1.5)
      }else{
        dataSource[index].exchangePrice = undefined
        this.setState({
          dataSource:dataSource
        })
      }
    }

    /**
     * 调拨总价失去焦点
     * @param record
     * @param index
     * @param e
       */
    hindBlur = (record,index,e) =>{
        const dataSource=this.state.dataSource
        let price = e.target.value
        let bPrice = dataSource[index].toBPrice
        let cPrice = dataSource[index].toCPrice
        if(price != ''){
          if(dataSource[index].exchangeQty != undefined){  //用户先点击调拨数量,后点击调拨总价
            let qty = dataSource[index].exchangeQty
            if(price > parseFloat(cPrice*qty)){  //不正常
              message.error('第'+ (index+1) +'行商品调拨总价填写错误。调拨总价不得大于商品零售总价',1.5)
            }else if(price < parseFloat(bPrice*qty)){
              message.error('第'+ (index+1) +'行商品调拨总价填写错误。调拨总价不得小于商品进货总价',1.5)
            }else{
              dataSource[index].exchangePrice=parseFloat(e.target.value)
              this.setState({
                dataSource:dataSource
              })
            }
          }
        }
    }

  	rowClassName=(record, index)=>{
    	if (index % 2) {
      		return 'table_gray'
    	}else{
      		return 'table_white'
    	}
  	}

    pagechange=(page)=>{
        this.setState({
            page:page.current
        })
    }

    windowResize = () =>{
        if(!this.refs.tableWrapper){
            return
        }else{
            if(document.body.offsetWidth>800){
                this.setState({
                     windowHeight:document.body.offsetHeight-300,
                });
            }else{
               this.setState({
                    windowHeight:document.body.offsetHeight-270,
                });
            }
        }
    }

  	render() {
    	const columns = this.columns;
    	return (
      		<div className='bgf gooddbcon' ref="tableWrapper">
              <div style={{marginLeft:"30px",marginBottom:'20px',marginTop:"30px"}}>
                <span className='spidsh'>门店名称</span>
                <AutoComplete
                    dataSource={this.state.dataSources}
                    onSelect={this.onSelect.bind(this)}
                    onSearch={this.handleSearch.bind(this)}
                    onChange={this.handleChange.bind(this)}
                    placeholder='请选择门店名称'
                />
                </div>
        		    <Table bordered
                    dataSource={this.state.dataSource}
                    columns={columns}
                    rowClassName={this.rowClassName.bind(this)}
                    pagination={{'showQuickJumper':true,'total':Number(this.state.total)}}
                    onChange={this.pagechange.bind(this)}
                    scroll={{y:this.state.windowHeight}}
                />
      		</div>
    	);
    }

    componentDidMount(){
        this._isMounted = true;
        if(this._isMounted){
            if(document.body.offsetWidth>800){
                this.setState({
                   windowHeight:document.body.offsetHeight-300,
                 });
            }else{
                this.setState({
                    windowHeight:document.body.offsetHeight-270,
                });
            }
        }
        window.addEventListener('resize', this.windowResize);
    }

    componentWillUnmount(){
        this._isMounted = false;
        window.removeEventListener('resize', this.windowResize);
    }
}


class Gooddb extends React.Component {
    constructor(props) {
    	super(props);
	    this.state = {
            datasouce:[],
            inShopId:null
        };
    }
    setdayasouce=(messages,total)=>{
        const setdatasouce=this.refs.adjust.setdatasouce
        setdatasouce(messages,total)
    }
    //获取最新的数据，传递给search
    getNewData=(data)=>{
        this.setState({
            datasouce:data
        })
    }

    getShopId=(shopId)=>{
        this.setState({
          inShopId:shopId
        })
    }

    render(){
        return(
            <div>
                <Header type={false} color={true} linkRoute="goods"/>
                <div className='counters'>
                    <Searchcomponent
                        dispatch={this.props.dispatch}
                        setdayasouce={this.setdayasouce.bind(this)}
                        datasouce={this.state.datasouce}
                        inShopId={this.state.inShopId}
                        ref='search'/>
                    <EditableTable dispatch={this.props.dispatch} ref='adjust' getNewData={this.getNewData.bind(this)} getShopId={this.getShopId.bind(this)}/>
                </div>
            </div>
        )
    }

}

export default connect()(Gooddb);
