
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,message,Modal} from 'antd';
import Operationcaster from './components/Operationcaster.jsx';
import Header from '../../components/header/Header';
import Btncashier from './components/Btncashier';
import EditableTable from './components/table';
import PayModal from './components/PayModal';
import {GetServerData} from '../../services/services';
import NP from 'number-precision'
import { dataedit } from '../../utils/commonFc';

class Cashierindex extends React.Component {
    state = {checkPrint:false};
    componentDidMount(){
      this.props.dispatch({
          type:'dataManage/initKey',
          payload: "1"
      })
      window.addEventListener('click', this.inputclick,true);
      window.addEventListener('keydown', this.handleokents,true);
      window.addEventListener('keyup', this.handleokent,true);
    }
    componentWillUnmount(){
      window.removeEventListener('click', this.inputclick,true);
      window.removeEventListener('keydown', this.handleokents,true);
      window.addEventListener('keyup', this.handleokent,true);
    }
    //条码表单聚焦
    inputclick=()=>{
      var x = document.activeElement.tagName;
      if(x=='BODY'){
          this.props.meths.focustap()
      }
    }
    handleokents=(e)=>{
      if(e.keyCode==114){
         e.preventDefault()
      }
    }
    //键盘code事件
    handleokent=(e)=>{
      let code = e.keyCode;
      switch(code) {
        case 32:
          this.clearingEvent();
          break;
        case 9:
          if(!this.props.onBlur) {
            this.props.meths.focustap()
          }
          break;
        case 113:
          this.takeout();
          break;
        case 114:
          this.takein();
          break;
        case 115:
          this.rowonDelete();
          break;
        case 38:
          this.upArrowEvent();
          break;
        case 40:
          this.downArrowEvent();
          break;
      }
    }
    //上箭头事件
    upArrowEvent() {
      let { themeindex, datasouce } = this.props;
      themeindex = Number(themeindex);
      if(themeindex) {
        themeindex--;
      } else {
        themeindex = Number(datasouce.length)-1;
      }
      // const themeindex=Number(themeindex)=='0'?Number(datasouce.length)-1:Number(themeindex)-1
      this.props.dispatch({
          type:'cashier/themeindex',
          payload:themeindex
      });
    }
    //下箭头事件
    downArrowEvent() {
      let { themeindex, datasouce } = this.props;
      themeindex = Number(themeindex);
      if( themeindex == (datasouce.length-1)) {
        themeindex = 0;
      } else {
        themeindex++;
      }
      // const themeindex=Number(this.props.themeindex)==Number(this.props.datasouce.length)-1?0:Number(this.props.themeindex)+1
      this.props.dispatch({
          type:'cashier/themeindex',
          payload:themeindex
      });
    }
    //结算事件
    clearingEvent() {
      this.props.meths.focustap();
      const visible=this.props.payvisible;
      if(visible){//结算按钮
        this.props.meth1.hindpayclick()
      }else{
        this.showModalEvent()
      }
    }
    //显示结算弹框//出弹窗
    showModalEvent() {
      const { totolnumber, totolamount } = this.props;
      //判断系统默认选择是否打印
      if(Number(totolnumber)>0 && parseFloat(totolamount)>0){
          GetServerData('qerp.pos.sy.config.info')
          .then((json) => {
              if(json.code == "0"){
                  if(json.config.submitPrint=='1'){
                      const checkPrint=true
                      this.props.dispatch({
                          type:'cashier/changeCheckPrint',
                          payload:checkPrint
                      })
                  }else{
                      const checkPrint=false
                      this.props.dispatch({
                          type:'cashier/changeCheckPrint',
                          payload:checkPrint
                      })
                  }
              }
          })
          this.props.meth1.initModel()
      }else{
          message.error('数量为0，不能结算')
          return
      }
    }
    //移除商品
    rowonDelete=()=>{
      const themeindex=this.props.themeindex
      const datasouce=this.props.datasouce.splice(0)
      datasouce.splice(themeindex, 1);
      this.props.dispatch({
          type:'cashier/datasouce',
          payload:datasouce
      })
    }
    //挂单
    takeout=()=>{
      const datasouce=this.props.datasouce
      sessionStorage.setItem('olddatasouce',JSON.stringify(datasouce));
      this.initdata()
    }
    //取单
    takein=()=>{
      if(sessionStorage.olddatasouce){
        let datasouce=eval('('+sessionStorage.olddatasouce+')')
        this.props.dispatch({
            type:'cashier/datasouce',
            payload:datasouce
        })
      }
    }
    //整单折扣值价格重置
    takezhe=(value)=>{
      var dis=value
      let role=sessionStorage.getItem('role');
      if(dis<8) {
        switch(role) {
          case '1':
          case '2':
            dis = 8;
            break;
          case '3':
          dis = 9;
          break;
        }
      }

     const datasouce=this.props.datasouce.splice(0)
     for(var i=0;i<datasouce.length;i++){
        datasouce[i].discount=dis
        var zeropayPrice=String(NP.divide(NP.times(datasouce[i].toCPrice, datasouce[i].qty,datasouce[i].discount),10)); //计算值
        const editpayPrice =dataedit(zeropayPrice)
        if(parseFloat(zeropayPrice)-parseFloat(editpayPrice)>0){
          datasouce[i].payPrice=String(NP.plus(editpayPrice, 0.01));
        }else{
          datasouce[i].payPrice=editpayPrice
        }
     }
     this.props.dispatch({
          type:'cashier/datasouce',
          payload:datasouce
      })
    }
    //初始化清空数据
    resetData=()=>{
      this.props.dispatch({
        type:'cashier/initstate',
        payload:{}
      })
      this.props.meths.focustap()
    }

    render() {
      return(
        <div>
          <Header type={true} color={true}/>
          <div className='counter cashier-counter-style'>
            <EditableTable/>
          </div>
          <div className='mt30 footer'>
            <Btncashier
              rowonDelete={this.rowonDelete.bind(this)}
              takein={this.takein.bind(this)}
              takeout={this.takeout.bind(this)}
              takezhe={this.takezhe.bind(this)}/>
            <div className='mt20'>
              <Operationcaster
                color={true}
                type={false}
                index={true}
                userplace='1'/>
            </div>
          </div>
          <PayModal ref='pay' initdata={this.resetData.bind(this)}/>
        </div>
      )
    }
}

function mapStateToProps(state) {
    const {
            datasouce,
            meths,
            onBlur,
            payvisible,
            totolnumber,
            totolamount,
            meth1,
            themeindex,
            checkPrint}=state.cashier
    return {
            datasouce,
            meths,
            onBlur,
            payvisible,
            totolnumber,
            totolamount,
            meth1,
            themeindex,
            checkPrint
          };
}
export default connect(mapStateToProps)(Cashierindex);
