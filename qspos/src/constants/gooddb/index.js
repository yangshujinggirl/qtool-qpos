import React from 'react';
import { connect } from 'dva';
import Header from '../../components/header/Header';
import Searchinput from './search';
import {LocalizedModal,Buttonico} from '../../components/Button/Button';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Upload,AutoComplete} from 'antd';
import {GetServerData} from '../../services/services';
import { Link } from 'dva/router';
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
                            onBlur={this.hindBlur.bind(this,index)}
                            value={this.state.dataSource[index].exchangePrice}
                            autoComplete="off"
                    />
                )
            }
        }];
	    this.state = {
	      	dataSource: [],
	      	count: 2,
          inputvalue:'',
            total:0,
            page:1,
            windowHeight:'',
            dataSources:[],
            shopId:null
        };
        this._isMounted = false;
    }

    onSelect=(value)=>{
       let dataSources = this.state.dataSources
       let shopId
       for(let i=0;i<dataSources.length;i++){
         if(dataSources[i].name == value){
           shopId = dataSources[i].spShopId
         }
       }
       this.setState({
         shopId:shopId
       })

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
                    dataSources:dataSources
                })
            }
        })
    }

    setdatasouce=(messages,total,shopId)=>{
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
            dataSource[index].exchangeQty=values
            this.setState({
                dataSource:dataSource
            },function(){
                this.props.getNewData(this.state.dataSource)
            })
        }
    }

    qtyhindBlur=(record,index,e)=>{
        if(e.target.value){
            const qtyvalue=e.target.value
            if(Number(qtyvalue)>Number(record.invQty)){
                const dataSource=this.state.dataSource.slice(0)
                dataSource[index].qty=record.invQty
                this.setState({
                    dataSource:dataSource
                },function(){
                    this.props.getNewData(this.state.dataSource)
                })
            }
        }
    }

    hindchange=(index,e)=>{
      const values=e.target.value
		  const re=/^([0-9]*)+((\.)|.[0-9]{1,2})?$/
      const str=re.test(values)
      console.log(str)
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

    hindBlur = (index,e) =>{
        var values=parseFloat(e.target.value)
        const datasouce=this.state.dataSource.splice(0)
        datasouce[index].exchangePrice=values
        this.setState({
            dataSource:datasouce
        },function(){
            this.props.getNewData(this.state.dataSource)
        })

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
      const pdSpus=this.props.pdSpus
    	return (
      		<div className='bgf gooddbcon' ref="tableWrapper">
              <div style={{marginLeft:"30px",marginBottom:'20px',marginTop:"30px"}}>
                <span className='spidsh'>门店名称</span>
                <AutoComplete
                    dataSource={this.state.dataSources}
                    onSelect={this.onSelect.bind(this)}
                    onSearch={this.handleSearch.bind(this)}
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
                    <EditableTable dispatch={this.props.dispatch} ref='adjust' getNewData={this.getNewData.bind(this)}/>
                </div>
            </div>
        )
    }

}

export default connect()(Gooddb);
