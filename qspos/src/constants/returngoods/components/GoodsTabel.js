import React from 'react';
import { Table, Input, Icon, Button, Popconfirm ,message,Checkbox} from 'antd';
import {GetServerData} from '../../../services/services';


const inputwidth={
  width:'80%',
  height:'30px',
  border:'1px solid #E7E8EC',
  background: '#FFF',textAlign:'center'
}
class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
              title: '选择',
              width:'10%',
              dataIndex: 'check',
              render:(text, record, index)=>{
                  return (
                      <Checkbox onChange={this.checkonChange.bind(this,record,index)} checked={this.state.dataSource[index].check}></Checkbox>
                  )
              }
          },{
              title: '商品条码',
              width:'10%',
              dataIndex: 'code'
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
              dataIndex: 'price'
          },{
              title: '可退数量',
              width:'10%',
              dataIndex: 'canReturnQty'
          },{
              title: '数量',
              width:'10%',
              dataIndex: 'newQty',
              render: (text, record, index) => {
                  return (
                      this.state.dataSource.length > 0
                      ?
                          (
                              <Input style={inputwidth}
                              autoComplete="off"
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
                              autoComplete="off"
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
                              autoComplete="off"
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
            dataSource: this.props.dataSource,//所有的table数据
            count: 1,
            index:0,
            quantity:0,//数量
            totalamount:0,//总金额
            integertotalamount:0,//总金额取整,
            selectedRows:[],
            ismbCard:this.props.ismbCard,
            isdataSource:[],//选中的table数据
            mbCard:this.props.mbCard,
            selectedRowKeys:[]
        };
    }
    componentWillReceiveProps(props) {
      this.setState({
        dataSource: props.dataSource,
        ismbCard: props.ismbCard,
        mbCard: props.mbCard,
      })
    }
    componentDidMount(){
      if(document.body.offsetWidth>800){
        this.setState({
          windowHeight:document.body.offsetHeight-495,
        });
      }else{
        this.setState({
          windowHeight:document.body.offsetHeight-295,
        });
      }
      window.addEventListener('resize', this.windowResize);
    }
    componentWillUnmount(){
     window.removeEventListener('resize', this.windowResize);
    }
    checkonChange=(record,index,e)=>{
        const changedataSource=this.state.dataSource
        changedataSource[index].check=e.target.checked
        this.setState({
            dataSource:changedataSource
        },function(){
            var isdataSource=[]
            for(var i=0;i<this.state.dataSource.length;i++){
                if(this.state.dataSource[i].check){
                    isdataSource.push(this.state.dataSource[i])
                }
            }
            //光标移动
            this.props.focuser()
            this.setState({
                isdataSource:isdataSource
            },function(){
                this.props.revisedata({type:6,data:isdataSource})
                this.uptotaldata()
            })
        })
    }
    clearselect=()=>{
        const datasoucess=this.state.dataSource
        for(var i=0;i<datasoucess.length;i++){
            datasoucess[i].check=false
        }
        this.setState({
            dataSource:datasoucess
        })
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
            ismbCard:false,
            windowHeight:''
        },function(){
            this.clearselect()
        })
    }
    //数据更新到操作区函数
    uptotaldata=()=>{
    	const selectedRows=this.state.isdataSource
    	var quantity=0
  		var totalamount=0
  		var integertotalamount=0
	    for(var i=0;i<selectedRows.length;i++){
	    	quantity=quantity+Number(selectedRows[i].qty)
	    	totalamount=totalamount+parseFloat(selectedRows[i].payPrice)
	    }
      totalamount=totalamount.toFixed(2)
      integertotalamount=Math.round(totalamount) //四舍五入取整
      //更新积分和树龄总额到展示区
      this.props.clearingdata(quantity,totalamount)
      if(this.state.ismbCard){
          this.props.updateintegertotalamount(integertotalamount)
      }
      this.setState({
          totalamount:totalamount
      })
    }
    //空格结算
    jiesuan=()=>{
         const isdataSource=this.state.isdataSource
         console.log(this.state)
         console.log(isdataSource)
         if(isdataSource.length>0){
                if(this.state.ismbCard&&this.state.mbCard.isLocalShop=='true'){
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
         }else{
            message.warning('退货数量为0，不能退货')
         }
    }
    qtyonchange=(index,e)=>{
        var str=e.target.value.replace(/\s+/g,"");
        let changedataSource=this.state.dataSource
        changedataSource[index].qty=str
        this.setState({
            dataSource:changedataSource
        })
    }
    qtyblur=(index)=>{
        var r = /^\+?[1-9][0-9]*$/;
        let changedataSource=this.state.dataSource
        console.log(changedataSource)
        if(Number(changedataSource[index].qty)<=Number(changedataSource[index].canReturnQty)){
            if(r.test(Number(changedataSource[index].qty))){
              //如果是正整数
              changedataSource[index].payPrice=this.payPrice(changedataSource[index].price,changedataSource[index].qty,changedataSource[index].discount)
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
                //如果非整数
                changedataSource[index].qty=1
                changedataSource[index].payPrice=this.payPrice(changedataSource[index].price,changedataSource[index].qty,changedataSource[index].discount)
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
                    message.warning('数量只能是大于等于0的整数')
            }
        }else{
            changedataSource[index].qty=changedataSource[index].canReturnQty
            changedataSource[index].payPrice=this.payPrice(changedataSource[index].price,changedataSource[index].qty,changedataSource[index].discount)
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
            message.warning('退货数量不可大于可退数量')
        }
    }
    discountonchange=(index,e)=>{
        var str=e.target.value.replace(/\s+/g,"");
        let changedataSource=this.state.dataSource
        changedataSource[index].discount=str
        this.setState({
            dataSource:changedataSource
        })
    }
    discountblur=(index)=>{
    	let changedataSource=this.state.dataSource
    	if(changedataSource[index].discount>0 || changedataSource[index].discount==0){
    		changedataSource[index].payPrice=this.payPrice(changedataSource[index].price,changedataSource[index].qty,changedataSource[index].discount)
    		this.setState({
    			dataSource:changedataSource
    		},function(){
    			this.uptotaldata()
                if(this.state.ismbCard){
                        console.log(this.state.isdataSource)
                        this.props.revisedata({type:6,data:this.state.isdataSource,mbCardId:this.state.mbCard.mbCardId})
                }else{
                        this.props.revisedata({type:6,data:this.state.isdataSource,mbCardId: null})
                }
    		})
    	}else{
    		changedataSource[index].discount=0
    		changedataSource[index].payPrice=this.payPrice(changedataSource[index].price,changedataSource[index].qty,changedataSource[index].discount)
    		this.setState({
    			dataSource:changedataSource
    		},function(){
    			this.uptotaldata()
    			message.error('最低折扣不小于0')
    		})
    	}
    }
    payPriceonchange=(index,e)=>{
        var str=e.target.value.replace(/\s+/g,"");
        let changedataSource=this.state.dataSource
        changedataSource[index].payPrice=str
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
    	changedataSource[index].discount=this.discount(changedataSource[index].price,changedataSource[index].qty,changedataSource[index].payPrice)
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
            return 'onetypecolor'
        }else{
            if (index % 2) {
                return 'table_white'
            }else{
                return 'table_gray'
            }
        }
    }
    onKeydown=(e)=>{
        if(e.keyCode==9){
            e.preventDefault()
        }
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
        // if(payPricedata-payPriceda>0){
        //     payPrice=NP.plus(payPriceda, 0.01);
        //     console.log(payPrice)
        //     payPrice=payPrice.toFixed(2)
        // }else{
        //     payPrice=payPriceda
        //     console.log(payPrice)
        //     payPrice=payPrice.toFixed(2)
        // }
        payPrice=payPriceda
        payPrice=payPrice.toFixed(2)
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
    // //根据订单号请求订单信息及会员id
    // barcodesetdatasoce=(messages)=>{
    //     let datasouces=this.state.dataSource
    //     const result=GetServerData('qerp.web.qpos.od.return.query',messages)
    //         result.then((res) => {
    //             return res;
    //         }).then((json) => {
    //             if(json.code=='0'){
    //             	const odOrderDetails=json.odOrderDetails
    //             	for(var i=0;i<odOrderDetails.length;i++){
    //             		odOrderDetails[i].key=i;
    //                 odOrderDetails[i].qty=odOrderDetails[i].canReturnQty//把订单数量更改为可退数量
    //                 odOrderDetails[i].inventory=odOrderDetails[i].qty
    //         		// odOrderDetails[i].payPrice=this.payPrice(odOrderDetails[i].price,odOrderDetails[i].qty,odOrderDetails[i].discount)
    //                 odOrderDetails[i].check=false
    //             	}
    //                 if(json.mbCard==null || json.mbCard==undefined || json.mbCard=={} || json.mbCard==''){
    //                     this.setState({
    //                         dataSource:odOrderDetails,
    //                         mbCard:null,
    //                         ismbCard:false
    //                     },function(){
    //                         //传递会员卡信息到展示数据
    //                         this.props.clearingdatal(this.state.mbCard,this.state.ismbCard)
    //                         //置空结算数据
    //                         this.props.clearingdata('0','0')
    //                         //传递会员卡信息到pay
    //                         this.props.revisedata({type:10,data:this.state.dataSource,mbCard:this.state.mbCard,ismbCard:this.state.ismbCard,odOrderNo:messages.odOrderNo})
    //                     })
    //                 }else{
    //                     this.setState({
    //                         dataSource:odOrderDetails,
    //                         mbCard:json.mbCard,
    //                         ismbCard:true
    //                     },function(){
    //                         this.props.clearingdatal(this.state.mbCard,this.state.ismbCard)
    //                         this.props.revisedata({type:10,data:this.state.dataSource,mbCard:this.state.mbCard,ismbCard:this.state.ismbCard,odOrderNo:messages.odOrderNo})
    //                     })
    //                 }
    //                 this.props.getAmountDetail(json.order)
    //             }else{
    //                 message.warning(json.message)
    //             }
    //         })
    // }
    windowResize = () =>{
        if(!this.refs.tableWrapper){
            return
        }else{
            if(document.body.offsetWidth>800){
                this.setState({
                   windowHeight:document.body.offsetHeight-495,
                 });
            }else{
                this.setState({
                    windowHeight:document.body.offsetHeight-295,
                });
            }
        }
    }
    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        return (
        <div className='bgf' ref="tableWrapper">
            <Table bordered
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                scroll={{ y: this.state.windowHeight }}
                onRowClick={this.rowclick.bind(this)}
                rowClassName={this.rowClassName.bind(this)}
                className='returngoodtable'/>
        </div>
    );
  }

}

export default EditableTable;
