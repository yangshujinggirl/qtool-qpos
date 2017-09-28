import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,message} from 'antd';
import Operation from '../components/Operation/Operationcaster.jsx';
import Header from '../components/header/Header';
import Pay from '../components/Pay/Pay';
import {LocalizedModal,Buttonico} from '../components/Button/Button';
import {GetServerData} from '../services/services';

const inputwidth={width:'80%',height:'30px',border:'1px solid #E7E8EC',background: '#FFF',textAlign:'center'}


class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '序号',
            dataIndex: 'index',
            width:'5%',
            render: (text, record, index) => {
                return (
                    this.state.dataSource.length > 0
                    ?
                      (
                        <div>{index+1}</div>
                      ) 
                    : null
                )
            }
        }, {
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
            width:'10%',
            dataIndex: 'discount',
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
            width:'10%',
            dataIndex: 'payPrice',
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
            integertotalamount:0//总金额取整
        };
    }




    //页面数据初始化
    initdata=()=>{
        this.setState({
            dataSource:[],
            index:0,
            quantity:0,//数量
            totalamount:0,//总金额
            integertotalamount:0//总金额取整
        },function(){
             const revisedata=this.props.revisedata
            let messages={
                type:1,
                data:this.state.dataSource
            }
            revisedata(messages)
            const dataSources=this.state.dataSource
            var quantity=0
            var totalamount=0
            var integertotalamount=0
            for(var i=0;i<dataSources.length;i++){
                quantity=quantity+Number(dataSources[i].qty)
                totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
            }
            integertotalamount=Math.round(totalamount) //四舍五入取整
            totalamount=totalamount.toFixed(2)//取两位小数，字符串
            this.props.clearingdata(quantity,totalamount)
            this.props.clearingdatal(integertotalamount)
        })
    }

    //下键
    rowchange=()=>{
        let index=this.state.index
        console.log(index)
        if(index==this.state.dataSource.length-1){
             this.setState({
                index:0
            })
        }else{
            this.setState({
                index:index+1
            })
        }   
    }
    //上缉键
    onrowchange=()=>{
        let index=this.state.index
       console.log(index)
        if(index==0){
            this.setState({
                index:this.state.dataSource.length-1
            })
        }else{
            this.setState({
                index:index-1
            })
        }
    }

    qtyonchange=(index,e)=>{
        var str=e.target.value.replace(/\s+/g,"");  
        let changedataSource=this.state.dataSource
        changedataSource[index].qty=str
        this.setState({
            dataSource:changedataSource
        },function(){
            const revisedata=this.props.revisedata
            let messages={
                type:1,
                data:this.state.dataSource

            }
            revisedata(messages)
           

        })
    }
    qtyblur=(index)=>{
        //里面的正整数
        var r = /^\+?[1-9][0-9]*$/;
        let changedataSource=this.state.dataSource
        if(Number(changedataSource[index].qty)<=Number(changedataSource[index].inventory)){
            //判断是否为正整数
            if(r.test(Number(changedataSource[index].qty))){
                changedataSource[index].payPrice=this.payPrice(changedataSource[index].toCPrice,changedataSource[index].qty,changedataSource[index].discount)
            this.setState({
                dataSource:changedataSource
            },function(){
                const revisedata=this.props.revisedata
            let messages={
                type:1,
                data:this.state.dataSource
            }
            revisedata(messages)
                const dataSources=this.state.dataSource
                var quantity=0
                var totalamount=0
                var integertotalamount=0
                for(var i=0;i<dataSources.length;i++){
                    quantity=quantity+Number(dataSources[i].qty)
                    totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
                }
                integertotalamount=Math.round(totalamount) //四舍五入取整
                totalamount=totalamount.toFixed(2)//取两位小数，字符串
                this.props.clearingdata(quantity,totalamount)
                this.props.clearingdatal(integertotalamount)
            })

            }else{
                changedataSource[index].qty=1
                changedataSource[index].payPrice=this.payPrice(changedataSource[index].toCPrice,changedataSource[index].qty,changedataSource[index].discount)
                this.setState({
                    dataSource:changedataSource
                },function(){
                const revisedata=this.props.revisedata
                let messages={
                    type:1,
                    data:this.state.dataSource
                }
                revisedata(messages)
                const dataSources=this.state.dataSo
                var quantity=0
                var totalamount=0
                var integertotalamount=0
                    for(var i=0;i<dataSources.length;i++){
                        quantity=quantity+Number(dataSources[i].qty)
                        totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
                    }
                    integertotalamount=Math.round(totalamount) //四舍五入取整
                    totalamount=totalamount.toFixed(2)//取两位小数，字符串
                    this.props.clearingdata(quantity,totalamount)
                    this.props.clearingdatal(integertotalamount)
                })
                message.warning('数量智能是大于等于0的整数')

            }
        }else{
            //大于库存
            changedataSource[index].qty=changedataSource[index].inventory
                changedataSource[index].payPrice=this.payPrice(changedataSource[index].toCPrice,changedataSource[index].qty,changedataSource[index].discount)
            this.setState({
                dataSource:changedataSource
            },function(){
                const revisedata=this.props.revisedata
            let messages={
                type:1,
                data:this.state.dataSource
            }
            revisedata(messages)
                const dataSources=this.state.dataSource
                var quantity=0
                var totalamount=0
                var integertotalamount=0
                for(var i=0;i<dataSources.length;i++){
                    quantity=quantity+Number(dataSources[i].qty)
                    totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
                }
                integertotalamount=Math.round(totalamount) //四舍五入取整
                totalamount=totalamount.toFixed(2)//取两位小数，字符串
                this.props.clearingdata(quantity,totalamount)
                this.props.clearingdatal(integertotalamount)
            })
            message.warning('库存不够')
        }
    }
    discountonchange=(index,e)=>{
        var str=e.target.value.replace(/\s+/g,"");  
        let changedataSource=this.state.dataSource
        changedataSource[index].discount=str
        this.setState({
            dataSource:changedataSource
        },function(){
            const revisedata=this.props.revisedata
            let messages={
                type:1,
                data:this.state.dataSource
            }
            revisedata(messages)
           


        }) 
    }
    discountblur=(index)=>{
        let changedataSource=this.state.dataSource
        let role=sessionStorage.getItem('role');
        console.log(role)
        if(role=='2'||role=='1'){
            if(changedataSource[index].discount<8){
                changedataSource[index].discount=8
                changedataSource[index].payPrice=this.payPrice(changedataSource[index].toCPrice,changedataSource[index].qty,changedataSource[index].discount)
                this.setState({
                    dataSource:changedataSource
                },function(){
                    const revisedata=this.props.revisedata
            let messages={
                type:1,
                data:this.state.dataSource
            }
            revisedata(messages)
           
                    const dataSources=this.state.dataSource
                    var quantity=0
                    var totalamount=0
                    var integertotalamount=0
                    for(var i=0;i<dataSources.length;i++){
                        quantity=quantity+Number(dataSources[i].qty)
                        totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
                    }
                    integertotalamount=Math.round(totalamount) //四舍五入取整
                    totalamount=totalamount.toFixed(2)//取两位小数，字符串
                    this.props.clearingdata(quantity,totalamount)
                    this.props.clearingdatal(integertotalamount)
                    message.error('折扣超出权限，已自动修复')
                })
            }else{
                changedataSource[index].payPrice=this.payPrice(changedataSource[index].toCPrice,changedataSource[index].qty,changedataSource[index].discount)
                this.setState({
                    dataSource:changedataSource
                },function(){
                    const revisedata=this.props.revisedata
            let messages={
                type:1,
                data:this.state.dataSource
            }
            revisedata(messages)
           
                    const dataSources=this.state.dataSource
                    var quantity=0
                    var totalamount=0
                    var integertotalamount=0
                    for(var i=0;i<dataSources.length;i++){
                        quantity=quantity+Number(dataSources[i].qty)
                        totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
                    }
                    integertotalamount=Math.round(totalamount) //四舍五入取整
                    totalamount=totalamount.toFixed(2)//取两位小数，字符串
                    this.props.clearingdata(quantity,totalamount)
                    this.props.clearingdatal(integertotalamount)
                })
            }
        }
        if(role=='3'){
            if(changedataSource[index].discount<9){
                changedataSource[index].discount=9
                changedataSource[index].payPrice=this.payPrice(changedataSource[index].toCPrice,changedataSource[index].qty,changedataSource[index].discount)
                this.setState({
                    dataSource:changedataSource
                },function(){
                    const revisedata=this.props.revisedata
            let messages={
                type:1,
                data:this.state.dataSource
            }
            revisedata(messages)
           
                    const dataSources=this.state.dataSource
                    var quantity=0
                    var totalamount=0
                    var integertotalamount=0
                    for(var i=0;i<dataSources.length;i++){
                        quantity=quantity+Number(dataSources[i].qty)
                        totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
                    }
                    integertotalamount=Math.round(totalamount) //四舍五入取整
                    totalamount=totalamount.toFixed(2)//取两位小数，字符串
                    this.props.clearingdata(quantity,totalamount)
                    this.props.clearingdatal(integertotalamount)
                    message.error('折扣超出权限，已自动修复')
                })
            }else{
                changedataSource[index].payPrice=this.payPrice(changedataSource[index].toCPrice,changedataSource[index].qty,changedataSource[index].discount)
                this.setState({
                    dataSource:changedataSource
                },function(){
                    const revisedata=this.props.revisedata
            let messages={
                type:1,
                data:this.state.dataSource
            }
            revisedata(messages)
           
                    const dataSources=this.state.dataSource
                    var quantity=0
                    var totalamount=0
                    var integertotalamount=0
                    for(var i=0;i<dataSources.length;i++){
                        quantity=quantity+Number(dataSources[i].qty)
                        totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
                    }
                    integertotalamount=Math.round(totalamount) //四舍五入取整
                    totalamount=totalamount.toFixed(2)//取两位小数，字符串
                    this.props.clearingdata(quantity,totalamount)
                    this.props.clearingdatal(integertotalamount)
                })
            }
        }
    }
    payPriceonchange=(index,e)=>{
        var str=e.target.value.replace(/\s+/g,"");  
        let changedataSource=this.state.dataSource
        changedataSource[index].payPrice=str
        this.setState({
            dataSource:changedataSource
        },function(){
            const revisedata=this.props.revisedata
            let messages={
                type:1,
                data:this.state.dataSource
            }
            revisedata(messages)
            this.props.revisedata(messages)
        })
    }
    payPriceblur=(index)=>{
        let changedataSource=this.state.dataSource
        changedataSource[index].discount=this.discount(changedataSource[index].toCPrice,changedataSource[index].qty,changedataSource[index].payPrice)
        let role=sessionStorage.getItem('role');
        if(role=='2'|| role=='1'){
            if(changedataSource[index].discount<8){
                changedataSource[index].discount=8
                changedataSource[index].payPrice=this.payPrice(changedataSource[index].toCPrice,changedataSource[index].qty,changedataSource[index].discount)
                this.setState({
                    dataSource:changedataSource
                },function(){
                    const revisedata=this.props.revisedata
            let messages={
                type:1,
                data:this.state.dataSource
            }
            revisedata(messages)
                    const dataSources=this.state.dataSource
                    var quantity=0
                    var totalamount=0
                    var integertotalamount=0
                    for(var i=0;i<dataSources.length;i++){
                        quantity=quantity+Number(dataSources[i].qty)
                        totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
                    }
                    integertotalamount=Math.round(totalamount) //四舍五入取整
                    totalamount=totalamount.toFixed(2)//取两位小数，字符串
                    this.props.clearingdata(quantity,totalamount)
                    this.props.clearingdatal(integertotalamount)
                    message.error('折扣超出权限，已自动修复')
                })
            }else{
                this.setState({
                    dataSource:changedataSource
                },function(){
                    const revisedata=this.props.revisedata
            let messages={
                type:1,
                data:this.state.dataSource
            }
            revisedata(messages)
           
                    const dataSources=this.state.dataSource
                    var quantity=0
                    var totalamount=0
                    var integertotalamount=0
                    for(var i=0;i<dataSources.length;i++){
                        quantity=quantity+Number(dataSources[i].qty)
                        totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
                    }
                    integertotalamount=Math.round(totalamount) //四舍五入取整
                    totalamount=totalamount.toFixed(2)//取两位小数，字符串
                    this.props.clearingdata(quantity,totalamount)
                    this.props.clearingdatal(integertotalamount)
                })
            }
        }
        if(role=='3'){
             if(changedataSource[index].discount<9){
                changedataSource[index].discount=9
                changedataSource[index].payPrice=this.payPrice(changedataSource[index].toCPrice,changedataSource[index].qty,changedataSource[index].discount)
                this.setState({
                    dataSource:changedataSource
                },function(){
                    const revisedata=this.props.revisedata
            let messages={
                type:1,
                data:this.state.dataSource
            }
            revisedata(messages)
           

                     const dataSources=this.state.dataSource
                            var quantity=0
                            var totalamount=0
                            var integertotalamount=0
                            for(var i=0;i<dataSources.length;i++){
                                quantity=quantity+Number(dataSources[i].qty)
                                totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
                            }
                            integertotalamount=Math.round(totalamount) //四舍五入取整
                            totalamount=totalamount.toFixed(2)//取两位小数，字符串
                            this.props.clearingdata(quantity,totalamount)
                            this.props.clearingdatal(integertotalamount)
                    message.error('折扣超出权限，已自动修复')
                })
            }else{
                this.setState({
                    dataSource:changedataSource
                },function(){
                    const revisedata=this.props.revisedata
            let messages={
                type:1,
                data:this.state.dataSource
            }
            revisedata(messages)
           
                    const dataSources=this.state.dataSource
                    var quantity=0
                    var totalamount=0
                    var integertotalamount=0
                    for(var i=0;i<dataSources.length;i++){
                        quantity=quantity+Number(dataSources[i].qty)
                        totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
                    }
                    integertotalamount=Math.round(totalamount) //四舍五入取整
                    totalamount=totalamount.toFixed(2)//取两位小数，字符串
                    this.props.clearingdata(quantity,totalamount)
                    this.props.clearingdatal(integertotalamount)
                })
            }
        }
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
    onDelete = () => {
        const onDeleteindex=Number(this.state.index)
        const dataSource = [...this.state.dataSource];
        dataSource.splice(onDeleteindex, 1);
        this.setState({
            dataSource:dataSource
        },function(){
            const revisedata=this.props.revisedata
            let messages={
                type:1,
                data:this.state.dataSource
            }
            revisedata(messages)
           
            const dataSources=this.state.dataSource
            var quantity=0
            var totalamount=0
            var integertotalamount=0
            for(var i=0;i<dataSources.length;i++){
                quantity=quantity+Number(dataSources[i].qty)
                totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
            }
            integertotalamount=Math.round(totalamount) //四舍五入取整
            totalamount=totalamount.toFixed(2)//取两位小数，字符串
            this.props.clearingdata(quantity,totalamount)
            this.props.clearingdatal(integertotalamount)
        })
    }
    takeout=()=>{
        const dataSources=this.state.dataSource
        sessionStorage.setItem('CashierDatasource',JSON.stringify(dataSources));
        this.setState({
            dataSource:[],
            index:0
        },function(){
            const revisedata=this.props.revisedata
            let messages={
                type:1,
                data:this.state.dataSource
            }
            revisedata(messages)
           

            const dataSources=this.state.dataSource
            var quantity=0
            var totalamount=0
            var integertotalamount=0
            for(var i=0;i<dataSources.length;i++){
                quantity=quantity+Number(dataSources[i].qty)
                totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
            }
            integertotalamount=Math.round(totalamount) //四舍五入取整
            totalamount=totalamount.toFixed(2)//取两位小数，字符串
            this.props.clearingdata(quantity,totalamount)
            this.props.clearingdatal(integertotalamount)
         })
    }
    takein=()=>{
        console.log(sessionStorage)
        if(sessionStorage.CashierDatasource){
            let CashierDatasources=eval('('+sessionStorage.CashierDatasource+')')
        this.setState({
            dataSource:CashierDatasources,
            index:0
        },function(){
            const revisedata=this.props.revisedata
            let messages={
                type:1,
                data:this.state.dataSource
            }
            revisedata(messages)
           
            const dataSources=this.state.dataSource
            var quantity=0
            var totalamount=0
            var integertotalamount=0
            for(var i=0;i<dataSources.length;i++){
                quantity=quantity+Number(dataSources[i].qty)
                totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
            }
            integertotalamount=Math.round(totalamount) //四舍五入取整
            totalamount=totalamount.toFixed(2)//取两位小数，字符串
            this.props.clearingdata(quantity,totalamount)
            this.props.clearingdatal(integertotalamount)
            sessionStorage.removeItem("CashierDatasource");
        })
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


    //js判断元素是否在数组中
    
    isInArray=(arr,value)=>{
        for(var i = 0; i < arr.length; i++){
        if(value == arr[i].barcode){
            return i;
        }
    }
    return false;
    }

   


    //计算table中datasouce
    barcodesetdatasoce=(messages)=>{
        console.log(messages)
        let datasouces=this.state.dataSource
        console.log(datasouces)
        if(datasouces.length>0){
            var i=this.isInArray(datasouces,messages.barCode)
            console.log(i)
            if(i===false){
                    //没匹配到,请求数据，插入第一行，并高亮
                    const result=GetServerData('qerp.pos.pd.spu.find',messages)
                    result.then((res) => {
                        return res;
                    }).then((json) => {
                        console.log(json)
                        if(json.code=='0'){
                            json.pdSpu.qty=1
                            //库存判断
                            if(json.pdSpu.qty<json.pdSpu.inventory || json.pdSpu.qty==json.pdSpu.inventory){
                                json.pdSpu.key=this.state.count
                                json.pdSpu.discount=10
                                json.pdSpu.payPrice=this.payPrice(json.pdSpu.toCPrice,json.pdSpu.qty,json.pdSpu.discount)
                                datasouces.unshift(json.pdSpu)
                                this.setState({
                                    index:0,
                                    dataSource:datasouces,
                                    count:this.state.count+1
                                },function(){
                                    const revisedata=this.props.revisedata
                                    let messages={
                                        type:1,
                                        data:this.state.dataSource
                                    }
                                    revisedata(messages)
                                   
                                    const dataSources=this.state.dataSource
                                    
                                    var quantity=0
                                    var totalamount=0
                                    var integertotalamount=0
                                    for(var i=0;i<dataSources.length;i++){
                                        quantity=quantity+Number(dataSources[i].qty)
                                        totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
                                    }
                                    integertotalamount=Math.round(totalamount) //四舍五入取整
                                    totalamount=totalamount.toFixed(2)//取两位小数，字符串
                                    this.props.clearingdata(quantity,totalamount)
                                    this.props.clearingdatal(integertotalamount)
                                })
                            }else{
                                message.error('该条码无库存')
                            }   
                        }else{  
                            message.warning(json.message)
                        }
                    })
            }else{
                    //匹配到了
                    datasouces[i].qty=Number(datasouces[i].qty)+1
                    //库存判断
                    if(datasouces[i].qty<datasouces[i].inventory || datasouces[i].qty==datasouces[i].inventory){
                        datasouces[i].payPrice=this.payPrice(datasouces[i].toCPrice,datasouces[i].qty,datasouces[i].discount)
                        let str = datasouces.splice(i,1); //删除当前
                        datasouces.unshift(str[0]); //把这个元素添加到开头
                        this.setState({
                            index:0,
                            dataSource:datasouces
                        },function(){
                            const revisedata=this.props.revisedata
                            let messages={
                                type:1,
                                data:this.state.dataSource
                            }
                            revisedata(messages)
                           
                            const dataSources=this.state.dataSource
       
                            var quantity=0
                            var totalamount=0
                            var integertotalamount=0
                            for(var i=0;i<dataSources.length;i++){
                                quantity=quantity+Number(dataSources[i].qty)
                                totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
                            }
                            integertotalamount=Math.round(totalamount) //四舍五入取整
                            totalamount=totalamount.toFixed(2)//取两位小数，字符串
                            this.props.clearingdata(quantity,totalamount)
                            this.props.clearingdatal(integertotalamount)
                        })
                    }else{
                        datasouces[i].qty=Number(datasouces[i].qty)-1
                        datasouces[i].payPrice=this.payPrice(datasouces[i].toCPrice,datasouces[i].qty,datasouces[i].discount)
                        let str = datasouces.splice(i,1); //删除当前
                        datasouces.unshift(str[0]); //把这个元素添加到开头
                        this.setState({
                            index:0,
                            dataSource:datasouces
                        },function(){
                            const revisedata=this.props.revisedata
                            let messages={
                                type:1,
                                data:this.state.dataSource
                            }
                            revisedata(messages)
                           
                            const dataSources=this.state.dataSource
       
                            var quantity=0
                            var totalamount=0
                            var integertotalamount=0
                            for(var i=0;i<dataSources.length;i++){
                                quantity=quantity+Number(dataSources[i].qty)
                                totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
                            }
                            integertotalamount=Math.round(totalamount) //四舍五入取整
                            totalamount=totalamount.toFixed(2)//取两位小数，字符串
                            this.props.clearingdata(quantity,totalamount)
                            this.props.clearingdatal(integertotalamount)
                        })


                        message.error('库存不够')


                    } 
            }   
        }else{
            console.log(33)
            //表中数据为空，匹配不到，请求数据，在table中添加一条数据，   
            const result=GetServerData('qerp.pos.pd.spu.find',messages)
                    result.then((res) => {
                        return res;
                    }).then((json) => {
                        console.log(json)
                        if(json.code=='0'){
                            json.pdSpu.qty=1
                            //库存判断
                            if(json.pdSpu.qty<json.pdSpu.inventory || json.pdSpu.qty==json.pdSpu.inventory){
                                json.pdSpu.key=0
                                json.pdSpu.discount=10
                                json.pdSpu.payPrice=this.payPrice(json.pdSpu.toCPrice,json.pdSpu.qty,json.pdSpu.discount)
                                datasouces.unshift(json.pdSpu)
                                this.setState({
                                    index:0,
                                    dataSource:datasouces
                                },function(){
                                    console.log('我数到了')
                                    const dataSources=this.state.dataSource
                                    console.log(dataSources)
               
                                    var quantity=0
                                    var totalamount=0
                                    var integertotalamount=0
                                    for(var i=0;i<dataSources.length;i++){
                                        quantity=quantity+Number(dataSources[i].qty)
                                        totalamount=totalamount+parseFloat(dataSources[i].payPrice) //计算出来的真实值，number
                                    }
                                    integertotalamount=Math.round(totalamount) //四舍五入取整
                                    totalamount=totalamount.toFixed(2)//取两位小数，字符串
                                    this.props.clearingdata(quantity,totalamount)
                                    this.props.clearingdatal(integertotalamount)
                                    const revisedata=this.props.revisedata
                                    let messages={
                                        type:1,
                                        data:this.state.dataSource
                                    }
                                    revisedata(messages)
                                   

                                })
                            }else{
                                message.error('库存不够')
                            }
                        }else{  
                            message.warning(json.message) 
                        }
                    })
        }
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
                scroll={{ y: 300 }}
                onRowClick={this.rowclick.bind(this)}
                rowClassName={this.rowClassName.bind(this)}
            />
        </div>
    );
  }
}


// 按钮
class Btncashier extends React.Component {
    rowonDelete=()=>{
        const rowonDelete=this.props.rowonDelete
        rowonDelete()
    }
    takeout=()=>{
        const takeout=this.props.takeout
        takeout()
    }
    takein=()=>{
        const takein=this.props.takein
        takein()
    }
	render() {
	 	return(
	 		<div className='clearfix' style={{padding:'0 30px'}}>
	 			<div className='btn fr ml20' onClick={this.rowonDelete.bind(this)}><Buttonico text='移除商品F3' fw={true}/></div>
	 			<div className='btn fr ml20' onClick={this.takein.bind(this)}><Buttonico text='取单F2' fw={true}/></div>
	 			<div className='btn fr' onClick={this.takeout.bind(this)}><Buttonico text='挂单F1' fw={true}/></div>
	 		</div>
	 	)
	 }
}
class Cashier extends React.Component {
    constructor(props) {
        super(props);
        this.memberinfo=null,
        this.integral=null,
        this.totalamount=0
    }


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
    Backmemberinfo=(memberinfo,integral)=>{
        this.memberinfo=memberinfo
        this.integral=integral
    }
    Backemoney=(totalamount)=>{
        this.totalamount=totalamount
    }

     //精确除法计算
    accDivs=(arg1,arg2)=>{
        var t1=0,t2=0,r1,r2;
        try{t1=arg1.toString().split(".")[1].length}catch(e){}
        try{t2=arg2.toString().split(".")[1].length}catch(e){}
        r1=Number(arg1.toString().replace(".",""))
        r2=Number(arg2.toString().replace(".",""))
        return (r1/r2)*Math.pow(10,t2-t1);
    }



    //出结算弹窗
    showpops=()=>{
         var totalamount=this.totalamount
           var integral=this.integral
           var memberinfo=this.memberinfo
           if(totalamount==0 || totalamount<0){
                message.warning('商品数量为0，不能结算')
           }else{
                    //判断是否是会员
                    if((integral==null && memberinfo==null) || (integral==0 && memberinfo==0)){
                        //不是会员 或是会员但是会员和积分都是0
                        console.log(this)
                        const showModal=this.refs.pay.showModal
                        showModal(5,totalamount)
                    }else{
                        integral=parseFloat(this.accDivs(integral,100).toFixed(2))
                        memberinfo=parseFloat(memberinfo)
                        totalamount=parseFloat(totalamount)
        
                        //是会员,有会员值且大于等于结算金额, type:1
                        if(memberinfo>0 && memberinfo>totalamount){
                            const showModal=this.refs.pay.showModal
                            let data={
                                totalamount:totalamount.toFixed(2),
                                memberinfo:memberinfo.toFixed(2),
                            }
                            console.log(data)
                             showModal(1,data)
                            }

                        }
                        //是会员,有会员值小于结算金额, type:2
                        if(memberinfo>0 && memberinfo<totalamount){
                            let data={
                                totalamount:totalamount.toFixed(2),
                                memberinfo:memberinfo.toFixed(2),
                            }
                            const showModal=this.refs.pay.showModal
                            showModal(2,data)

                        }
                        //是会员，会员值为0，有积分值，且大于等于结算金额，这里要换算 type:3
                        if(memberinfo==0 && integral>0 && integral>totalamount){
                            const showModal=this.refs.pay.showModal
                            let data={
                                totalamount:totalamount.toFixed(2),
                                integral:integral.toFixed(2),
                            }
                            showModal(3,data)

                        }
                        //是会员，会员值为0，有积分值，小于结算金额，这里要换算 type:4
                        if(memberinfo==0 && integral>0 && integral<totalamount){
                            const showModal=this.refs.pay.showModal
                            let data={
                                totalamount:totalamount.toFixed(2),
                                integral:integral.toFixed(2),
                            }
                            showModal(4,data)

                        }
                    }


            



    }


    handleokent=(e)=>{
        console.log(e.keyCode)
        console.log(this)
        console.log(this.refs.pay.state.visible)
        if(e.keyCode=='32'){
            const visible=this.refs.pay.state.visible
            //回焦点
            const focustap=this.refs.opera.focustap
            focustap()
            if(visible){
                //结算按钮
               const hindpayclick=this.refs.pay.hindpayclick
               hindpayclick()
            }else{
                //出弹窗
               this.showpops()
        }
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
        //上箭头
        if(e.keyCode==38){
            const onrowchange=this.refs.table.onrowchange
            onrowchange()

        }
        //下箭头
        if(e.keyCode==40){  
            const rowchange=this.refs.table.rowchange
            rowchange()

        }




    }
    clearingdata=(messages,totalamount)=>{
        console.log(messages)
        console.log(totalamount)
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


    revisedata=(message)=>{
        const revisedata=this.refs.pay.revisedata
        revisedata(message)
    }

    initdata=()=>{
        const initdata=this.refs.table.initdata
        initdata()
        const initdatar=this.refs.opera.initdatar
        initdatar()

    }
    render() {
        return(
            <div>
                <Header type={true} color={true}/>
                <div className='counter'>
                    <EditableTable ref='table' clearingdata={this.clearingdata.bind(this)} 
                        clearingdatal={this.clearingdatal.bind(this)} 
                        dispatch={this.props.dispatch}
                        revisedata={this.revisedata.bind(this)} 
                       
                    />
                </div>
                <div className='mt30 footer'>
                    <div><Btncashier rowonDelete={this.rowonDelete.bind(this)} takein={this.takein.bind(this)} takeout={this.takeout.bind(this)}/></div>
                    <div className='mt20'>
                        <Operation 
                            color={true} 
                            type={false} 
                            index={true} 
                            cashrevisetabledatasouce={this.cashrevisetabledatasouce.bind(this)} 
                            userplace='1' 
                            ref='opera' 
                            setonblue={this.setonblue.bind(this)} 
                            Backemoney={this.Backemoney.bind(this)}
                            Backmemberinfo={this.Backmemberinfo.bind(this)}
                            revisedata={this.revisedata.bind(this)}
                            showpops={this.showpops.bind(this)}
                        />
                    </div>
                </div>
                <div><Pay ref='pay' initdata={this.initdata.bind(this)}/></div>
                
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
        console.log(state)
        const {datasouce}=state.cashier

  	 return {datasouce};
    }

export default connect(mapStateToProps)(Cashier);













