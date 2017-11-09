import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm,message } from 'antd';
import Operation from '../components/Operation/Operationsh.jsx';
import Header from '../components/header/Header';
import {LocalizedModal,Buttonico} from '../components/Button/Button';
import {GetServerData} from '../services/services';

const inputwidth={
    width:'90px',
    height:'30px',
    border:'1px solid #E7E8EC',
    background: '#FFF'
}
class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '序号',
            dataIndex: 'index',
             width:'8%',
            render: (text, record, index) => {
                return (
                    this.state.dataSource.length > 0 
                    ?
                        (
                            <div>{index+1}</div>
                        ) 
                    : null
                );
            }
        }, {
            title: '商品条码',
            dataIndex: 'barcode'
        }, {
            title: '商品名称',
            dataIndex: 'name'
        },{
            title: '规格',
            dataIndex: 'displayName'
        },{
            title: '待收数量',
            dataIndex: 'unReceiveQty'
        },{
            title: '本次数量',
            dataIndex: 'receiveQty',
            width:'12%',
            render: (text, record, index) => {
                return (
                    this.state.dataSource.length > 0 
                        ?
                            (
                                <Input 
                                    style={inputwidth} 
                                    value={this.state.dataSource[(Number(this.state.page)-1)*5+Number(index)].receiveQty} 
                                    onChange={this.setqtys.bind(this,index)}
                                    onBlur={this.discountblur.bind(this,index)}
                                    className='tc'
                                />
                            ) 
                        : null
                );
            }
        },{
            title: '零售价',
            dataIndex: 'toCPrice'
        }];
        this.state = {
            dataSource:[],
            ispdOrder:false,
            index:0,
            pdOrderId:null,
            spu:0,
            number:0,
            total:0,
            page:1,
            windowHeight:''
        };
        this.firstclick=true
    }
    //在datasouce中index计算法则
    // 实际index=(所在页数1开始-1）*5+在当前页的index
    zindex=(index)=>{
       var zindexs=(Number(this.state.page)-1)*5+Number(index)
       return zindexs
    }
    setqtys=(index,e)=>{
        var str=e.target.value.replace(/\s+/g,"");
        console.log(str)  
        var zindex=this.zindex(index)
        console.log(zindex)
        const dataSources=this.state.dataSource
        dataSources[zindex].receiveQty=str
        this.setState({
            dataSource:dataSources
        })      
    }

    //数量失去焦点
    discountblur=(index,e)=>{
        var r = /^\+?[1-9][0-9]*$/;
        var zindex=this.zindex(index)
        const dataSources=this.state.dataSource
        if(r.test(Number(dataSources[zindex].receiveQty))){
             //判断ispdOrder是true还是false false 没扫描过配货单
        console.log(this.state.ispdOrder)
        if(this.state.ispdOrder){
            //扫描过配货单
            var zindex=this.zindex(index)
            const dataSources=this.state.dataSource
            if(Number(dataSources[zindex].receiveQty)<=Number(dataSources[zindex].unReceiveQty)){
                this.setState({
                    dataSource:dataSources
                },function(){
                    const clearingdatas=this.props.clearingdatas
                    const dataSources=this.state.dataSource
                    var numberdata=0;
                    for(var i=0;i<dataSources.length;i++){
                        numberdata=numberdata+Number(dataSources[i].receiveQty)
                    }
                    clearingdatas(dataSources.length,numberdata)
                })
            }else{
                 dataSources[zindex].receiveQty=dataSources[zindex].unReceiveQty
                 this.setState({
                    dataSource:dataSources
                },function(){
                    const clearingdatas=this.props.clearingdatas
                    const dataSources=this.state.dataSource
                    var numberdata=0;
                    for(var i=0;i<dataSources.length;i++){
                        numberdata=numberdata+Number(dataSources[i].receiveQty)
                    }
                    clearingdatas(dataSources.length,numberdata)
                    message.warning('超出应收数量，默认为总数');
                })
            }
        }else{
            //没扫描过配货单
            console.log(index)
            var zindex=this.zindex(index)
            console.log(zindex)
            const dataSources=this.state.dataSource
            dataSources[zindex].receiveQty=e.target.value
            this.setState({
                dataSource:dataSources
            },function(){
                const clearingdatas=this.props.clearingdatas
                const dataSources=this.state.dataSource
                var numberdata=0;
                for(var i=0;i<dataSources.length;i++){
                    numberdata=numberdata+Number(dataSources[i].receiveQty)
                }
                clearingdatas(dataSources.length,numberdata)
            })
        }
        }else{
             message.warning('数量只能为大于等于0的整数')
        }


       
    }
    rowClassName=(record, index)=>{
        if(index==this.state.index){
            return 'themebgcolor'
        }else{
            if (index % 2) {
                return 'table_white'
            }else{
                return 'table_gray'
            }
        }
    }
  
    //js判断是否在数组中
    isInArray=(arr,value)=>{
        for(var i = 0; i < arr.length; i++){
            if(value == arr[i].barcode){
                return i;
            }
        }
        return false;
    }
    //下键
    rowchange=()=>{
        let index=this.state.index
        var zindex=this.zindex(index) //高亮实际index
        if(index==4 || zindex==this.state.dataSource.length-1){
            this.setState({
                index:0
            })
        }else{
            this.setState({
                index:index+1
            })
        }   
    }
    //上键
    onrowchange=()=>{
        let index=this.state.index
        if(index==0){
            this.setState({
                index:4
            })
        }else{
            this.setState({
                index:index-1
            })
        }
    } 
    //行点击 
    rowclick=(record,index,event)=>{
        this.rowClassName(record,index)
        this.setState({
            index:index
        })
    }
    //配货单号请求数据生成datasouce
    revisedata=(messages)=>{
        const result=GetServerData('qerp.pos.pd.phorder.info',messages)
        result.then((res) => {
            return res;
        }).then((json) => {
            console.log(json)
            if(json.code=='0'){
                const pdOrderDetails=json.pdOrderDetails
                for(var i=0;i<pdOrderDetails.length;i++){
                    pdOrderDetails[i].receiveQty=0
                    pdOrderDetails[i].key=pdOrderDetails[i].barcode
                }
                this.setState({
                    dataSource:pdOrderDetails,
                    ispdOrder:true,
                    index:0,
                    pdOrderId:json.pdOrderId,
                   
                },function(){
                    //光标跳转到条形码输入框
                    this.props.onfocuse()
                    const clearingdatas=this.props.clearingdatas
                    const dataSources=this.state.dataSource
                    var numberdata=0;
                    for(var i=0;i<dataSources.length;i++){
                        numberdata=numberdata+dataSources[i].receiveQty
                    }
                    clearingdatas(dataSources.length,numberdata)
                })
            }else{  
               message.error(json.message)
            }
        })

    }
    //条码请求数据生成datasouce
    barcoderevisedata=(messages)=>{
        //判断ispdOrders是true还是false,如果是true,说明已经扫描过配货单，如果是false，说明没扫描过配货单
        const ispdOrders=this.state.ispdOrder
        console.log(ispdOrders)
        if(ispdOrders){
            let datasouces=this.state.dataSource
            var i=this.isInArray(datasouces,messages.barCode)
            if(i===false){
                 message.warning('条码不在配货单中')
            }else{
                if(Number(datasouces[i].receiveQty)<Number(datasouces[i].unReceiveQty)){
                    datasouces[i].receiveQty=Number(datasouces[i].receiveQty)+1
                    let str = datasouces.splice(i,1); //删除当前
                    datasouces.unshift(str[0]); //把这个元素添加到开头
                    this.setState({
                        dataSource:datasouces,
                        index:0
                    },function(){
                        const clearingdatas=this.props.clearingdatas
                        const dataSources=this.state.dataSource
                        var numberdata=0;
                        for(var i=0;i<dataSources.length;i++){
                            numberdata=numberdata+Number(dataSources[i].receiveQty)
                        }
                        clearingdatas(dataSources.length,numberdata)
                    })
                }else{
                    message.error('这个条码已经收满')
                }
            }     
        }else{
            //没有扫描过配货单，判断barCode是否在datasouce中，如果不在则代收数量为空，本次数量为1
            let datasouces=this.state.dataSource
            var i=this.isInArray(datasouces,messages.barCode)
            if(i===false){
                const result=GetServerData('qerp.pos.pd.spu.find',messages)
                result.then((res) => {
                    return res;
                }).then((json) => {
                    if(json.code=='0'){
                        const pdSpus=json.pdSpu
                        pdSpus.receiveQty=1
                        pdSpus.key=pdSpus.barcode
                        pdSpus.unReceiveQty=null
                        datasouces.unshift(pdSpus);
                        this.setState({
                            dataSource:datasouces,
                            index:0
                        },function(){
                            const clearingdatas=this.props.clearingdatas
                            const dataSources=this.state.dataSource
                            var numberdata=0;
                            for(var i=0;i<dataSources.length;i++){
                                numberdata=numberdata+Number(dataSources[i].receiveQty)
                            }
                            clearingdatas(dataSources.length,numberdata)
                        })

                }else{  
                    message.error(json.message) 
                }
            })

            }else{
                datasouces[i].receiveQty=Number(datasouces[i].receiveQty)+1
                let str = datasouces.splice(i,1); //删除当前
                datasouces.unshift(str[0]); //把这个元素添加到开头
                this.setState({
                    dataSource:datasouces,
                    index:0
                },function(){
                        const clearingdatas=this.props.clearingdatas
                        const dataSources=this.state.dataSource
                        var numberdata=0;
                        for(var i=0;i<dataSources.length;i++){
                            numberdata=numberdata+Number(dataSources[i].receiveQty)
                        }
                        clearingdatas(dataSources.length,numberdata)
                })
            
        }
        }
    }
    //获取商品和数量
    receivenumber=(spu,number)=>{
        this.setState({
            spu:spu,
            number:number
        })
    }


    
    //收货
    receiveQty=()=>{
        console.log(this.firstclick)
        if(this.firstclick){
            //可以执行
            this.firstclick=false

        }else{
            //不可以执行
            return
        }
        const datasouces=this.state.dataSource
        if(datasouces.length>0 && Number(this.state.spu)>0 && Number(this.state.number)>0){
            var pdOrderReceives=this.state.dataSource
            pdOrderReceives=pdOrderReceives.filter(item => item.receiveQty!=0) 
            //判断有没有配货单号id
            let value={
                pdOrderId:this.state.pdOrderId,
                pdOrderReceives:pdOrderReceives
            }
            const result=GetServerData('qerp.pos.pd.order.receive',value)
             result.then((res) => {
                      return res;
                    }).then((json) => {
                        console.log(json)
                        if(json.code==0){
                            message.success('收货成功',1)
                            this.firstclick=true
                            this.initdata()
                        }else{
                            message.error(json.message)
                            this.firstclick=true
                        }
                    })
        }else{
            message.warning('收货数量为0，不能结算')
            this.firstclick=true
        }
    }

    pagechange=(page)=>{
        console.log(page)
        this.setState({
            page:page.current
        })

    }


    //初始化
    initdata=()=>{
        this.setState({
            dataSource: [],
            ispdOrder:false,
            index:0,
            pdOrderId:null,
            spu:0,
            number:0
        },function(){
            this.props.initdata()
        })
    }

    windowResize = () =>{
       this.setState({
        windowHeight:document.body.offsetHeight-495
       });
    }

    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        return (
            <div className='bgf'>
                <Table 
                    bordered 
                    dataSource={dataSource} 
                    columns={columns} 
                    rowClassName={this.rowClassName.bind(this)}  
                    pagination={false}
                    onRowClick={this.rowclick.bind(this)}
                    onChange={this.pagechange.bind(this)}
                    scroll={{ y: this.state.windowHeight }}
                />
          </div>
        );
    }

    componentDidMount(){
        this.setState({
           windowHeight:document.body.offsetHeight-495
         });
        window.addEventListener('resize', this.windowResize);    
    }
    componentWillUnmount(){   
        window.removeEventListener('resize', this.windowResize);
    }
}

class Receivegoods extends React.Component {
    tabledataset=(messages)=>{
        const revisedata=this.refs.table.revisedata
        revisedata(messages)
    }
    barcoderevisedata=(messages)=>{
        const revisedata=this.refs.table.barcoderevisedata
        revisedata(messages)
    }
    onfocuse=()=>{
        const focustap=this.refs.shuse.focustap
        focustap()
    }
    handleokent=(e)=>{
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
        //空格
        if(e.keyCode=='32'){  
            console.log('12345678')
            //判断datasouce有没有数据
            const receiveQty=this.refs.table.receiveQty
            receiveQty()
        }
    }
    //更新商品和数量数据到操作区
    clearingdatas=(messages,totalamount)=>{
        const clearingdatas=this.refs.shuse.clearingdatas
        clearingdatas(messages,totalamount)
    }
    //接收商品和数量
    receivenumber=(spu,number)=>{
        const receivenumber=this.refs.table.receivenumber
        receivenumber(spu,number)
    }
   //接收配货单数据
    revisedata=(messages)=>{
        const revisedata=this.refs.table.revisedata
        revisedata(messages)
    }
    initdata=()=>{
        const initdata=this.refs.shuse.initdata
        initdata()
    }

    showpops=()=>{
        console.log(1)
        const receiveQty=this.refs.table.receiveQty
        receiveQty()
    }
    render(){
        return(
                <div>
                    <Header type={false} color={true}/>
                    
                    <div className='counter'>
                        <EditableTable ref='table' 
                        onfocuse={this.onfocuse.bind(this)}
                        clearingdatas={this.clearingdatas.bind(this)}
                        initdata={this.initdata.bind(this)}
                        />    
                    </div>  
                    <div className='mt30 footers'>        
                        <div className='mt20'>
                            <Operation color={true} 
                                type={true} 
                                index={false} 
                                tabledataset={this.tabledataset.bind(this)} 
                                barcoderevisedata={this.barcoderevisedata.bind(this)}
                                ref='shuse'
                                receivenumber={this.receivenumber.bind(this)}
                                revisedata={this.revisedata.bind(this)}
                                showpops={this.showpops.bind(this)}
                                />
                        </div> 
                    </div>
                </div> 
            )
    }
    componentDidMount(){
        window.addEventListener('keyup', this.handleokent,true);    
    }
    componentWillUnmount(){   
        window.removeEventListener('keyup', this.handleokent,true);
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(Receivegoods);



















