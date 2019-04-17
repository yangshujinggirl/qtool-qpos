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
              width:'8%',
              dataIndex: 'price'
          },{
              title: '可退价',
              width:'10%',
              dataIndex: 'canReturnPrice'
          },{
              title: '可退数量',
              width:'8%',
              dataIndex: 'canReturnQty'
          },{
              title: '退货数量',
              width:'8%',
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
              width:'6%',
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
      //（1）退货数量 < 可退数量时，可退总价=退货数量*可退价；
      //（2）退货数量 = 可退数量时，可退总价=销售单商品折后总价 - 商品可退价*商品已退货数量；
        var r = /^\+?[1-9][0-9]*$/;
        let changedataSource=this.state.dataSource
        console.log(changedataSource)
        if(Number(changedataSource[index].qty) < Number(changedataSource[index].canReturnQty)){
            if(r.test(Number(changedataSource[index].qty))){
              //如果是正整数
              // changedataSource[index].payPrice=this.payPrice(changedataSource[index].price,changedataSource[index].qty,changedataSource[index].discount)
              changedataSource[index].payPrice=this.accMuls(changedataSource[index].canReturnPrice,changedataSource[index].qty)
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
                // changedataSource[index].payPrice=this.payPrice(changedataSource[index].price,changedataSource[index].qty,changedataSource[index].discount)
                changedataSource[index].payPrice=this.accMuls(changedataSource[index].canReturnPrice,changedataSource[index].qty)
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
        }else if(Number(changedataSource[index].qty) == Number(changedataSource[index].canReturnQty)){
          let totalPrice = changedataSource[index].odAmount;
          let returnQty = changedataSource[index].returnQty;//已退数量
          let canPrice = changedataSource[index].canReturnPrice;//可退价
          let returnedAmount = this.accMuls(returnQty,canPrice);
          let shouldRePrice = Number(totalPrice)-Number(returnedAmount);
          changedataSource[index].payPrice = shouldRePrice;
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
        } else {
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
      const { ismbCard, isdataSource, mbCard } =this.state;
    	let changedataSource=this.state.dataSource;
    	if(changedataSource[index].discount>0 || changedataSource[index].discount==0){
        let payPrice = this.payPrice(changedataSource[index].price,changedataSource[index].qty,changedataSource[index].discount);
        let itemCanReturnAmount = this.accMuls(changedataSource[index].canReturnPrice,changedataSource[index].canReturnQty);
        if(payPrice>itemCanReturnAmount) {
          changedataSource[index].discount= this.discount(changedataSource[index].price,changedataSource[index].qty,changedataSource[index].payPrice)
          message.error('折后价不得大于可退总价')
        } else {
          changedataSource[index].payPrice= payPrice;
        }
    		this.setState({
    			dataSource:changedataSource
    		},()=>{
    			this.uptotaldata()
          if(ismbCard){
            this.props.revisedata({type:6,data:isdataSource,mbCardId:mbCard.mbCardId})
          }else{
            this.props.revisedata({type:6,data:isdataSource,mbCardId: null})
          }
          // if(this.state.ismbCard){
          //   console.log(this.state.isdataSource)
          //   this.props.revisedata({type:6,data:this.state.isdataSource,mbCardId:this.state.mbCard.mbCardId})
          // }else{
          //   this.props.revisedata({type:6,data:this.state.isdataSource,mbCardId: null})
          // }
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
    	let changedataSource=this.state.dataSource;
      let itemCanReturnAmount = this.accMuls(changedataSource[index].canReturnPrice,changedataSource[index].canReturnQty);
      let payPrice = parseFloat(changedataSource[index].payPrice);
      if(payPrice<0){
        payPrice=0
      } else if(payPrice>itemCanReturnAmount) {
        message.error('折后价不得大于可退总价');
        // payPrice = this.payPrice(changedataSource[index].price,changedataSource[index].qty,changedataSource[index].discount);
        payPrice = this.payPriceSpecil(changedataSource,index);
      } else {
        payPrice = payPrice.toFixed(2)
      }
      changedataSource[index].payPrice = payPrice;
      changedataSource[index].discount=this.discount(changedataSource[index].price,changedataSource[index].qty,payPrice);
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
        payPrice=payPriceda
        payPrice=payPrice.toFixed(2)
        return payPrice
    }
    //可退数量与输入数量相等时
    payPriceSpecil=(changedataSource,index)=> {
      let payPrice;
      if(Number(changedataSource[index].qty) < Number(changedataSource[index].canReturnQty)) {
        payPrice = this.accMuls(changedataSource[index].canReturnPrice,changedataSource[index].qty);
      } else {
        payPrice = changedataSource[index].odAmount;
      }
      return payPrice;
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
