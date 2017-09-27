import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,message} from 'antd';
import Operation from '../components/Operation/Operation.jsx';
import Header from '../components/header/Header';
import Pay from '../components/Pay/Pay';
import {LocalizedModal,Buttonico} from '../components/Button/Button';
import {GetServerData} from '../services/services';
import OperationRe from '../components/Operation/OperationRe.jsx';

const inputwidth={width:'80%',height:'30px',border:'1px solid #E7E8EC',background: '#FFF',textAlign:'center'}


class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '商品条码',
            width:'10%',
            dataIndex: 'barcode'
        }, {
            title: '商品名称',
            width:'20%',
            dataIndex: 'name'
        },{
            title: '规格',
            width:'10%',
            dataIndex: 'displayName'
        },{
            title: '零售价',
            width:'10%',
            dataIndex: 'toCPrice'
        },{
            title: '数量',
            width:'10%',
            dataIndex: 'qty',
            render: (text, record, index) => {
                return (
                    this.state.dataSource.length > 0 
                    ?
                        (
                            <Input style={inputwidth} 
                                onKeyDown={this.onKeydown.bind(this)} 
                                value={this.state.dataSource[index].qty} 
                                onBlur={this.qtyblur.bind(this,index)}
                                onChange={this.qtyonchange.bind(this,index)}/>
                        ) 
                    : null
                )
            }
        },{
            title: '折扣',
            dataIndex: 'discount',
            width:'10%',
            render: (text, record, index) => {
                return (
                    this.state.dataSource.length > 0 
                    ?
                        (
                            <Input style={inputwidth} 
                                onKeyDown={this.onKeydown.bind(this)} 
                                value={this.state.dataSource[index].discount}
                                onChange={this.discountonchange.bind(this,index)}
                                onBlur={this.discountblur.bind(this,index)}
                            />
                        ) 
                    : null
                )
            }
        },{
            title: '折后价',
            dataIndex: 'payPrice',
            width:'10%',
            render: (text, record, index) => {
                return (
                    this.state.dataSource.length > 0 
                    ?
                        (
                            <Input style={inputwidth} 
                                onKeyDown={this.onKeydown.bind(this)} 
                                value={this.state.dataSource[index].payPrice}
                                onChange={this.payPriceonchange.bind(this,index)}
                                onBlur={this.payPriceblur.bind(this,index)}
                            />
                        ) 
                    : null
                )
            }
        }];
        this.state = {
            dataSource: [],
            count: 1,
            index:0,
            quantity:0,//数量
            totalamount:0,//总金额
            integertotalamount:0,//总金额取整,
            selectedRows:[],
            ismbCard:false,
            isdataSource:[],
            mbCard:null

        };
       this.rowSelection = {
		  onSelect:(record,selected,selectedRows)=>{
            console.log(selectedRows)
		  	//高亮
		  	if(selected){
		  		this.setState({
		  			index:Number(record.key),
		  			selectedRows:selectedRows,
                    isdataSource:selectedRows
		  		},function(){
                     if(this.state.ismbCard){
                        this.props.revisedata({type:6,data:this.state.isdataSource,mbCardId:this.state.mbCard.mbCardId})
                    }else{
                        this.props.revisedata({type:6,data:this.state.isdataSource,mbCardId: null})
                    }
		  			this.uptotaldata()
		  		})
		  	}else{
		  		this.setState({
		  			selectedRows:selectedRows,
                    isdataSource:selectedRows
		  		},function(){
                    if(this.state.ismbCard){
                            this.props.revisedata({type:6,data:this.state.isdataSource,mbCardId:this.state.mbCard.mbCardId})
                    }else{
                            this.props.revisedata({type:6,data:this.state.isdataSource,mbCardId: null})
                    }
		  			this.uptotaldata()

		  		})
		  	}
		  	
		  }
		};
    }

    // 初始化
    reinitdata=()=>{
        this.setState({
            dataSource: [],
            count: 1,
            index:0,
            quantity:0,//数量
            totalamount:0,//总金额
            integertotalamount:0,//总金额取整,
            selectedRows:[],
            ismbCard:false
        })

    }
    //数据更新到操作区函数
    uptotaldata=()=>{
    	const selectedRows=this.state.selectedRows
    	var quantity=0
		var totalamount=0
		var integertotalamount=0
	    for(var i=0;i<selectedRows.length;i++){
	    	quantity=quantity+Number(selectedRows[i].qty)
	    	totalamount=totalamount+parseFloat(selectedRows[i].payPrice)
	    }

        totalamount=totalamount.toFixed(2)
        this.setState({
            totalamount:totalamount
        })
	    this.props.clearingdata(quantity,totalamount)
	    //积分:取整数部分
	    integertotalamount=Math.round(totalamount) //四舍五入取整
	    this.props.updateintegertotalamount(totalamount)
    }


    //空格结算
    jiesuan=()=>{
         const isdataSource=this.state.isdataSource
         if(isdataSource.length>0){
            const selectedRows=this.state.selectedRows
            if(selectedRows.length==0){
                message.warning('退货数量为0，不能退货')
            }else{
                if(this.state.ismbCard){
                    //是会员
                    const showModal=this.props.showModal
                    let data={
                        totolamount:this.state.totalamount
                     }
                    showModal(8,data)
                }else{
                    const showModal=this.props.showModal
                    //不是会员
                     let data={
                        totolamount:this.state.totalamount
                     }
                     showModal(7,data)
                }
            }
         }else{
            message.warning('退货数量为0，不能退货')

         }
    }

    qtyonchange=(index,e)=>{
        let changedataSource=this.state.dataSource
        changedataSource[index].qty=e.target.value
        this.setState({
            dataSource:changedataSource
        })
    }
    qtyblur=(index)=>{
        let changedataSource=this.state.dataSource
        console.log(changedataSource)
        if(Number(changedataSource[index].qty)<Number(changedataSource[index].inventory) || changedataSource[index].qty==changedataSource[index].inventory){
            changedataSource[index].payPrice=this.payPrice(changedataSource[index].toCPrice,changedataSource[index].qty,changedataSource[index].discount)
            this.setState({
                dataSource:changedataSource
            },function(){
            	this.uptotaldata()
                if(this.state.ismbCard){
                            this.props.revisedata({type:6,data:this.state.isdataSource,mbCardId:this.state.mbCard.mbCardId})
                }else{
                            this.props.revisedata({type:6,data:this.state.isdataSource,mbCardId: null})
                }
            })
        }else{
            message.error('库存不够')
        }
    }
    discountonchange=(index,e)=>{
        let changedataSource=this.state.dataSource
        changedataSource[index].discount=e.target.value
        this.setState({
            dataSource:changedataSource
        }) 
    }
    discountblur=(index)=>{
    	let changedataSource=this.state.dataSource
    	if(changedataSource[index].discount>0 || changedataSource[index].discount==0){
    		changedataSource[index].payPrice=this.payPrice(changedataSource[index].toCPrice,changedataSource[index].qty,changedataSource[index].discount)
    		this.setState({
    			dataSource:changedataSource
    		},function(){
    			this.uptotaldata()
                if(this.state.ismbCard){
                        this.props.revisedata({type:6,data:this.state.isdataSource,mbCardId:this.state.mbCard.mbCardId})
                }else{
                        this.props.revisedata({type:6,data:this.state.isdataSource,mbCardId: null})
                }
    		})
    	}else{
    		changedataSource[index].discount=0
    		changedataSource[index].payPrice=this.payPrice(changedataSource[index].toCPrice,changedataSource[index].qty,changedataSource[index].discount)
    		this.setState({
    			dataSource:changedataSource
    		},function(){
    			this.uptotaldata()
    			message.error('最低折扣不小于0')
    		})
    	}  
    }
    payPriceonchange=(index,e)=>{
        let changedataSource=this.state.dataSource
        changedataSource[index].payPrice=e.target.value
        this.setState({
            dataSource:changedataSource
        })
    }
    payPriceblur=(index)=>{
    	let changedataSource=this.state.dataSource
        console.log(changedataSource)
        if(parseFloat(changedataSource[index].payPrice)<0){
            changedataSource[index].payPrice=0 
        }
    	changedataSource[index].discount=this.discount(changedataSource[index].toCPrice,changedataSource[index].qty,changedataSource[index].payPrice)
    	changedataSource[index].payPrice=parseFloat(changedataSource[index].payPrice).toFixed(2)
    		this.setState({
    			dataSource:changedataSource
    		},function(){
    			this.uptotaldata()
                if(this.state.ismbCard){
                    this.props.revisedata({type:6,data:this.state.isdataSource,mbCardId:this.state.mbCard.mbCardId})
                }else{
                    this.props.revisedata({type:6,data:this.state.isdataSource,mbCardId: null})
                }

                
    		})
    }
    rowClassName=(record, index)=>{
        if(index==this.state.index){
            return 'table_theme'
        }
    }
    onKeydown=(e)=>{
        if(e.keyCode==9){
            e.preventDefault()
        } 
    }
   

   //可操作区计算公式,a为零售价，b为数量，c为折扣，d为折后价
   //折扣计算
    discount=(a,b,d)=>{
        var dx10=this.accMuls(d,10)
        var discountdata=this.accDiv(dx10,a)
        var discountda=this.accDiv(discountdata,b) //计算原始数据
        //目标四舍五入保留一位小数
        var strcount=discountda.toFixed(1)+'5'//取小数后两位字符串
        var numbercount=parseFloat(strcount)
        var count;
        if(discountda-numbercount>0 || discountda-numbercount==0){
            count=parseFloat(discountda.toFixed(1))+0.1
        }else{
            count=parseFloat(discountda.toFixed(1))
        }
        return count
   }
   //折后价计算
    payPrice=(a,b,c)=>{ 
        var payPricedatas=this.accMul(a,b,c)//实际结果却10
        var payPricedata=this.accDiv(payPricedatas,10) //实际结果
        var payPriceda=parseFloat(payPricedata.toFixed(2))//取小数后两位
        var payPrice;
        if(payPricedata-payPriceda>0){
            payPrice=payPriceda+0.01
            payPrice=payPrice.toFixed(2)
        }else{
            payPrice=payPriceda
            payPrice=payPrice.toFixed(2)
        }
        return payPrice  
    }
    rowclick=(record,index,event)=>{
        this.rowClassName(record,index)
        this.setState({
            index:index
        })
    }
   //精确乘法计算（三位）
    accMul=(arg1, arg2,arg3)=> {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString(),s3 = arg3.toString();
        try {
            m += s1.split(".")[1].length;
        }
        catch (e) {
        }
        try {
            m += s2.split(".")[1].length;
        }
        catch (e) {
        }
        try {
            m += s3.split(".")[1].length;
        }
        catch (e) {
        }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", ""))  * Number(s3.replace(".", "")) / Math.pow(10, m);
    }
   //精确乘法计算(两位)
    accMuls=(arg1, arg2)=> {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length;
        }
        catch (e) {
        }
        try {
            m += s2.split(".")[1].length;
        }
        catch (e) {
        }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", ""))/ Math.pow(10, m);
    }
    //精确除法计算
    accDiv=(arg1,arg2)=>{
        var t1=0,t2=0,r1,r2;
        try{t1=arg1.toString().split(".")[1].length}catch(e){}
        try{t2=arg2.toString().split(".")[1].length}catch(e){}
        r1=Number(arg1.toString().replace(".",""))
        r2=Number(arg2.toString().replace(".",""))
        return (r1/r2)*Math.pow(10,t2-t1);
    }
    barcodesetdatasoce=(messages)=>{
        console.log(messages)
        let datasouces=this.state.dataSource
        console.log(datasouces)
         const result=GetServerData('qerp.web.qpos.od.return.query',messages)
                    result.then((res) => {
                        return res;
                    }).then((json) => {
                        console.log(json)
                        if(json.code=='0'){
                        	const odOrderDetails=json.odOrderDetails
                        	for(var i=0;i<odOrderDetails.length;i++){
                        		odOrderDetails[i].key=i
                        		odOrderDetails[i].inventory=odOrderDetails[i].qty	
                        	}
                            if(json.mbCard==null || json.mbCard==undefined || json.mbCard=={} || json.mbCard==''){
                                this.setState({
                                    dataSource:odOrderDetails,
                                    mbCard:json.mbCard,
                                    ismbCard:false
                                },function(){
                                    this.props.clearingdatal(this.state.mbCard)
                                
                                })
                            }else{
                                this.setState({
                                    dataSource:odOrderDetails,
                                    mbCard:json.mbCard,
                                    ismbCard:true
                                },function(){
                                this.props.clearingdatal(this.state.mbCard)
                                
                                })
                            }

                        	
                        }else{  
                            console.log(json.message)   
                        }
                    })

              }
    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        return (
        <div className='bgf'>
            <Table bordered 
                dataSource={dataSource} 
                columns={columns} 
                pagination={false} 
                scroll={{ y: 240 }}
                onRowClick={this.rowclick.bind(this)}
                rowClassName={this.rowClassName.bind(this)}
                rowSelection={this.rowSelection}
                scroll={{ y: 300 }}
            />
        </div>
    );
  }
}



class Returngoods extends React.Component {
    state={
        onBlur:false
    }
    cashrevisetabledatasouce=(messages)=>{
        const barcodesetdatasoce=this.refs.table.barcodesetdatasoce
        barcodesetdatasoce(messages)
    }
    inputclick=()=>{
        var x = document.activeElement.tagName;
        if(x=='BODY'){
            const focustap=this.refs.opera.focustap
            focustap()
        }
    }
    setonblue=(messages)=>{
        this.setState({
            onBlur:messages
        })
    }
    handleokent=(e)=>{
        console.log(e.keyCode)
        //空格
        if(e.keyCode=='32'){
            console.log(this)
            const jiesuan=this.refs.table.jiesuan
            jiesuan()
        }
        // tap
        if(e.keyCode==9 && this.state.onBlur==false){
           const focustap=this.refs.opera.focustap
            focustap()
        }

        if(e.keyCode==81){
            this.takeout()
        }
        if(e.keyCode==87){
            this.takein()

        }
        if(e.keyCode==69){
            this.rowonDelete()

        }

    }
    clearingdata=(messages,totalamount)=>{
        const clearingdatas=this.refs.opera.clearingdatas
        clearingdatas(messages,totalamount)
    }
    clearingdatal=(integertotalamount)=>{
        const clearingdatasl=this.refs.opera.clearingdatasl
        clearingdatasl(integertotalamount)
    }
    rowonDelete=()=>{
        const rowonDelete=this.refs.table.onDelete
        rowonDelete()
    }
    takeout=()=>{
        const takeout=this.refs.table.takeout
        takeout()
    }
    takein=()=>{
        const takein=this.refs.table.takein
        takein()
    }

    updateintegertotalamount=(messages)=>{
    	const updateintegertotalamount=this.refs.opera.updateintegertotalamount
    	updateintegertotalamount(messages)
    }
    showModals=(type,messages)=>{
        const showModal=this.refs.pay.showModal
        showModal(type,messages)
    }

    revisedata=(message)=>{
        const revisedata=this.refs.pay.revisedata
        revisedata(message)
    }

    reinitdata=()=>{
        const reinitdata=this.refs.table.reinitdata
        reinitdata()
    }
    
    useinitdata=()=>{
        const initdata=this.refs.opera.initdata
        initdata()
    }


    render() {
        return(
            <div>
               <Header type={false} color={false}/>
                <div className='counter'>
                    <EditableTable 
                        ref='table'
                        clearingdata={this.clearingdata.bind(this)} 
                        clearingdatal={this.clearingdatal.bind(this)} 
                        updateintegertotalamount={this.updateintegertotalamount.bind(this)}
                        showModal={this.showModals.bind(this)}
                        revisedata={this.revisedata.bind(this)}
                        />
                    </div>
                <div><Pay ref='pay' reinitdata={this.reinitdata.bind(this)} useinitdata={this.useinitdata.bind(this)}/></div>
                <div className='mt30 footers'>
                    <div className='mt20'>
                        <OperationRe 
                            color={false} 
                            type={false} 
                            index={true} 
                            cashrevisetabledatasouce={this.cashrevisetabledatasouce.bind(this)} 
                            userplace='1' 
                            ref='opera' 
                            setonblue={this.setonblue.bind(this)}
                            revisedata={this.revisedata.bind(this)}
                        />
                        </div>
                </div>
                
             </div> 
            )
    }
    componentDidMount(){
        window.addEventListener('click', this.inputclick,true);
        window.addEventListener('keyup', this.handleokent,true);    
    }
    componentWillUnmount(){
        window.removeEventListener('click', this.inputclick,true);
        window.removeEventListener('keyup', this.handleokent,true);
    }
}


    function mapStateToProps(state) {
     return {};
    }

export default connect(mapStateToProps)(Returngoods);






































