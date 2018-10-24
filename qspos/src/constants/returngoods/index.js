import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,message,Checkbox} from 'antd';
import Header from '../../components/header/Header';
import PayModal from './components/PayModal';
import NP from 'number-precision';
import {GetServerData} from '../../services/services';
import OperationRe from './components/OperationRe.jsx';
import GoodsTabel from './components/GoodsTabel.js';
import './index.less'

// class Returngoods extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state={
//           onBlur:false,
//           checkPrint:false,
//           dataSource:[]
//       }
//     }
//     componentDidMount(){
//         window.addEventListener('click', this.inputclick,true);
//         window.addEventListener('keyup', this.handleokent,true);
//     }
//     componentWillUnmount(){
//         window.removeEventListener('click', this.inputclick,true);
//         window.removeEventListener('keyup', this.handleokent,true);
//     }
//     //根据订单号查询商品list
//     barcodesetdatasoce=(messages)=>{
//       // let datasouces=this.state.dataSource
//       GetServerData('qerp.web.qpos.od.return.query',messages)
//       .then((json) => {
//           if(json.code=='0'){
//           	const odOrderDetails=json.odOrderDetails
//           	for(var i=0;i<odOrderDetails.length;i++){
//           		odOrderDetails[i].key=i;
//               odOrderDetails[i].qty=odOrderDetails[i].canReturnQty//把订单数量更改为可退数量
//               odOrderDetails[i].inventory=odOrderDetails[i].qty
//               odOrderDetails[i].check=false
//           	}
//             if(json.mbCard==null || json.mbCard==undefined || json.mbCard=={} || json.mbCard==''){
//                 this.setState({
//                     dataSource:odOrderDetails,
//                     mbCard:null,
//                     ismbCard:false
//                 },function(){
//                     //传递会员卡信息到展示数据
//                     this.clearingdatal(this.state.mbCard,this.state.ismbCard)
//                     //置空结算数据
//                     this.clearingdata('0','0')
//                     //传递会员卡信息到pay
//                     this.revisedata({type:10,data:this.state.dataSource,mbCard:this.state.mbCard,ismbCard:this.state.ismbCard,odOrderNo:messages.odOrderNo})
//                 })
//             }else{
//                 this.setState({
//                     dataSource:odOrderDetails,
//                     mbCard:json.mbCard,
//                     ismbCard:true
//                 },function(){
//                     this.clearingdatal(this.state.mbCard,this.state.ismbCard)
//                     this.revisedata({type:10,data:this.state.dataSource,mbCard:this.state.mbCard,ismbCard:this.state.ismbCard,odOrderNo:messages.odOrderNo})
//                 })
//             }
//             this.getAmountDetail(json.order)
//           }else{
//               message.warning(json.message)
//           }
//       })
//     }
//     cashrevisetabledatasouce=(messages)=>{
//         // const barcodesetdatasoce=this.refs.table.barcodesetdatasoce
//         this.barcodesetdatasoce(messages)
//     }
//     inputclick=()=>{
//         var x = document.activeElement.tagName;
//         if(x=='BODY'){
//             const focustap=this.refs.opera.focustap
//             focustap()
//         }
//     }
//     setonblue=(messages)=>{
//         this.setState({
//             onBlur:messages
//         })
//     }
//     handleokent=(e)=>{
//         //空格
//         if(e.keyCode=='32'){
//             const visible=this.refs.pay.state.visible
//             if(visible){
//                 //结算
//                 const hindpayclick=this.refs.pay.hindpayclick
//                 hindpayclick()
//             }else{
//                 //判断系统默认选择是否打印
//                 const result=GetServerData('qerp.pos.sy.config.info')
//                 result.then((res) => {
//                    return res;
//                  }).then((json) => {
//                     if(json.code == "0"){
//                         if(json.config.submitPrint=='1'){
//                             this.setState({
//                                 checkPrint:true
//                             })
//                         }else{
//                             this.setState({
//                                 checkPrint:false
//                             })
//                         }
//                     }
//                 })
//                 //出弹窗
//                 this.showpops()
//             }
//         }
//         // tap
//         if(e.keyCode==9 && this.state.onBlur==false){
//            const focustap=this.refs.opera.focustap
//             focustap()
//         }
//
//         if(e.keyCode==81){
//             this.takeout()
//         }
//         if(e.keyCode==87){
//             this.takein()
//
//         }
//         if(e.keyCode==69){
//             this.rowonDelete()
//
//         }
//          //上箭头
//         if(e.keyCode==38){
//             const onrowchange=this.refs.table.onrowchange
//             onrowchange()
//
//         }
//         //下箭头
//         if(e.keyCode==40){
//             const rowchange=this.refs.table.rowchange
//             rowchange()
//
//         }
//     }
//     //更新积分，总额数据到操作区
//     clearingdata=(messages,totalamount)=>{
//       //存储总金额
//       this.setState({ totalamount })
//       const clearingdatas=this.refs.opera.clearingdata
//       clearingdatas(messages,totalamount)
//     }
//     clearingdatal=(integertotalamount,ismbCard)=>{
//         const clearingdatasl=this.refs.opera.clearingdatasl
//         clearingdatasl(integertotalamount,ismbCard)
//     }
//     rowonDelete=()=>{
//         const rowonDelete=this.refs.table.onDelete
//         rowonDelete()
//     }
//     takeout=()=>{
//         const takeout=this.refs.table.takeout
//         takeout()
//     }
//     takein=()=>{
//         const takein=this.refs.table.takein
//         takein()
//     }
//     updateintegertotalamount=(messages)=>{
//     	const updateintegertotalamount=this.refs.opera.updateintegertotalamount
//     	updateintegertotalamount(messages)
//     }
//     showModals=(type,messages)=>{
//         //判断系统默认选择是否打印
//         GetServerData('qerp.pos.sy.config.info')
//         .then((json) => {
//           if(json.code == "0"){
//             let checkPrint;
//             if(json.config.submitPrint=='1'){
//               checkPrint = true
//             }else{
//               checkPrint = false
//             }
//             this.setState({ checkPrint })
//           }
//         })
//         const showModal=this.refs.pay.showModal
//         showModal(type,messages)
//     }
//     revisedata=(message)=>{
//         const revisedata=this.refs.pay.revisedata
//         revisedata(message)
//     }
//
//     reinitdata=()=>{
//         const reinitdata=this.refs.table.reinitdata
//         reinitdata()
//     }
//     useinitdata=()=>{
//         const initdata=this.refs.opera.initdata
//         initdata()
//     }
//     focuser=()=>{
//         const focustap=this.refs.opera.focustap
//         focustap()
//     }
//     showpops=()=>{
//       const { amountDetail, totalamount } =this.state;
//       if(Number(totalamount)>Number(amountDetail.canReturnAmount)) {
//         message.warning('结算金额不得大于可退金额')
//         return;
//       }
//         const jiesuan=this.refs.table.jiesuan
//         jiesuan()
//     }
//     //改变选择是否打印状态
//     changeCheckPrint = (printFlag) =>{
//         this.setState({
//             checkPrint:printFlag
//         })
//     }
//     getAmountDetail(amountDetail) {
//       this.setState({
//         amountDetail
//       })
//     }
//     //更新结算金额
//     upDateAccount(dataSource,totalamount) {
//       this.setState({ dataSource, totalamount })
//     }
//     render() {
//       const { amountDetail, dataSource } =this.state
//         return(
//             <div className="return-goods-pages">
//                <Header type={false} color={false}/>
//                 <div className='counter'>
//                   {
//                     dataSource.length>0&&
//                     <GoodsTabel
//                       ref='table'
//                       dataSource={dataSource}
//                       clearingdata={this.clearingdata.bind(this)}
//                       // clearingdatal={this.clearingdatal.bind(this)}
//                       updateintegertotalamount={this.updateintegertotalamount.bind(this)}
//                       showModal={this.showModals.bind(this)}
//                       revisedata={this.revisedata.bind(this)}
//                       focuser={this.focuser.bind(this)}/>
//                   }
//                 </div>
//                 {
//                   amountDetail&&
//                   <div className="amout-detail-action">
//                     <p className="money-item">实付金额：<span className="mon-num">{amountDetail.payAmount}</span></p>
//                     <p className="money-item">已退金额：<span className="mon-num">{amountDetail.returnAmount}</span></p>
//                     <p className="money-item">可退金额：<span className="mon-num returnAmount">{amountDetail.canReturnAmount}</span></p>
//                   </div>
//                 }
//                 <PayModal
//                   ref='pay'
//                   reinitdata={this.reinitdata.bind(this)}
//                   useinitdata={this.useinitdata.bind(this)}
//                   checkPrint={this.state.checkPrint}
//                   changeCheckPrint={this.changeCheckPrint.bind(this)}/>
//                 <div className='mt30 footers'>
//                   <div className='mt20'>
//                     <OperationRe
//                       color={false}
//                       type={false}
//                       index={true}
//                       cashrevisetabledatasouce={this.cashrevisetabledatasouce.bind(this)}
//                       userplace='1'
//                       ref='opera'
//                       setonblue={this.setonblue.bind(this)}
//                       revisedata={this.revisedata.bind(this)}
//                       showpops={this.showpops.bind(this)}/>
//                   </div>
//                 </div>
//              </div>
//             )
//     }
//
// }

class Returngoods extends React.Component {
    state={
        onBlur:false,
        checkPrint:false
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
            const visible=this.refs.pay.state.visible
            if(visible){
                //结算
                const hindpayclick=this.refs.pay.hindpayclick
                hindpayclick()
            }else{
                //判断系统默认选择是否打印
                const result=GetServerData('qerp.pos.sy.config.info')
                result.then((res) => {
                   return res;
                 }).then((json) => {
                    if(json.code == "0"){
                        if(json.config.submitPrint=='1'){
                            this.setState({
                                checkPrint:true
                            })
                        }else{
                            this.setState({
                                checkPrint:false
                            })
                        }
                    }
                })
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
    //更新数据到操作区
    clearingdata=(messages,totalamount)=>{
      //存储总金额
      this.setState({
        totalamount
      })
        const clearingdatas=this.refs.opera.clearingdatas
        clearingdatas(messages,totalamount)
    }
    clearingdatal=(integertotalamount,ismbCard)=>{
        const clearingdatasl=this.refs.opera.clearingdatasl
        clearingdatasl(integertotalamount,ismbCard)
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
        //判断系统默认选择是否打印
        const result=GetServerData('qerp.pos.sy.config.info')
        result.then((res) => {
            return res;
            }).then((json) => {
            if(json.code == "0"){
                if(json.config.submitPrint=='1'){
                    this.setState({
                        checkPrint:true
                    })
                }else{
                    this.setState({
                        checkPrint:false
                    })
                }
            }
        })
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
    focuser=()=>{
        const focustap=this.refs.opera.focustap
        focustap()
    }
    showpops=()=>{
      const { amountDetail, totalamount } =this.state;
      if(Number(totalamount)>Number(amountDetail.canReturnAmount)) {
        message.warning('结算金额不得大于可退金额')
        return;
      }
        const jiesuan=this.refs.table.jiesuan
        jiesuan()
    }
    //改变选择是否打印状态
    changeCheckPrint = (printFlag) =>{
        this.setState({
            checkPrint:printFlag
        })
    }
    getAmountDetail(amountDetail) {
      this.setState({
        amountDetail
      })
    }
    render() {
      const { amountDetail } =this.state
        return(
            <div className="return-goods-pages">
               <Header type={false} color={false}/>
                <div className='counter'>
                    <GoodsTabel
                        ref='table'
                        clearingdata={this.clearingdata.bind(this)}
                        clearingdatal={this.clearingdatal.bind(this)}
                        updateintegertotalamount={this.updateintegertotalamount.bind(this)}
                        showModal={this.showModals.bind(this)}
                        revisedata={this.revisedata.bind(this)}
                        focuser={this.focuser.bind(this)}
                        getAmountDetail={this.getAmountDetail.bind(this)}
                        />
                </div>
                {
                  amountDetail&&
                  <div className="amout-detail-action">
                    <p className="money-item">实付金额：<span className="mon-num">{amountDetail.payAmount}</span></p>
                    <p className="money-item">已退金额：<span className="mon-num">{amountDetail.returnAmount}</span></p>
                    <p className="money-item">可退金额：<span className="mon-num returnAmount">{amountDetail.canReturnAmount}</span></p>
                  </div>
                }
                <PayModal
                  ref='pay'
                  reinitdata={this.reinitdata.bind(this)}
                  useinitdata={this.useinitdata.bind(this)}
                  checkPrint={this.state.checkPrint}
                  changeCheckPrint={this.changeCheckPrint.bind(this)}/>
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
                          showpops={this.showpops.bind(this)}/>
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
