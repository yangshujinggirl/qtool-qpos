
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,message,Modal} from 'antd';
import Operation from '../../components/Operation/Operationcaster.jsx';
import Header from '../../components/header/Header';
import Btncashier from './btns';
import EditableTable from './table';
import Pay from './pay';
import {GetServerData} from '../../services/services';
import NP from 'number-precision'

class Cashierindex extends React.Component {
    inputclick=()=>{
        var x = document.activeElement.tagName;
        if(x=='BODY'){
            this.props.meths.focustap()
        }
    }
    handleokent=(e)=>{
        if(e.keyCode=='32'){
            this.props.meths.focustap()   
            const visible=this.props.payvisible
            if(visible){
                //结算按钮
                this.props.meth1.hindpayclick()
            }else{
                //出弹窗
                if(Number(this.props.totolnumber)>0 && parseFloat(this.props.totolamount)>0){
                    this.props.meth1.initModel()
                }else{
                    message.error('数量为0，不能结算')
                    return
                }
            }
        }
        // tap
        if(e.keyCode==9 && this.props.onBlur==false){
            this.props.meths.focustap()
        }
        if(e.keyCode==113){
            this.takeout()
        }
        if(e.keyCode==114){
            this.takein()
        }
        if(e.keyCode==115){
            this.rowonDelete()
        }
        //上箭头
        if(e.keyCode==38){
            const themeindex=Number(this.props.themeindex)=='0'?Number(this.props.datasouce.length)-1:Number(this.props.themeindex)-1
            this.props.dispatch({
                type:'cashier/themeindex',
                payload:themeindex
            })
        }
        //下箭头
        if(e.keyCode==40){  
            const themeindex=Number(this.props.themeindex)==Number(this.props.datasouce.length)-1?0:Number(this.props.themeindex)+1
            this.props.dispatch({
                type:'cashier/themeindex',
                payload:themeindex
            })
        }
    }
    
    rowonDelete=()=>{
        const themeindex=this.props.themeindex
        const datasouce=this.props.datasouce.splice(0)
        datasouce.splice(themeindex, 1);
        this.props.dispatch({
            type:'cashier/datasouce',
            payload:datasouce
        })
    }
    takeout=()=>{
        //挂单
        const datasouce=this.props.datasouce
        sessionStorage.setItem('olddatasouce',JSON.stringify(datasouce));
        this.initdata()
    }
    takein=()=>{
        //取单
        if(sessionStorage.olddatasouce){
            let datasouce=eval('('+sessionStorage.olddatasouce+')')
            this.props.dispatch({
                type:'cashier/datasouce',
                payload:datasouce
            })
        }
    }
    takezhe=(value)=>{
        //对得到的数据进行判断
        var dis=value
        let role=sessionStorage.getItem('role');
        if(role=='2'||role=='1'){
            if(dis<8){
                dis=8
            }
        }
        if(role=='3'){
            if(dis<8){
                dis=9
            }
        }
       const datasouce=this.props.datasouce.splice(0)
       for(var i=0;i<datasouce.length;i++){
            datasouce[i].discount=dis
            datasouce[i].payPrice=NP.divide(NP.times(datasouce[i].toCPrice, datasouce[i].qty,datasouce[i].discount),10);
       }
       this.props.dispatch({
            type:'cashier/datasouce',
            payload:datasouce
        })
    }
    //初始化清空数据
    initdata=()=>{
        const datasouce=[]
        const themeindex=0
        const name=null
        const levelStr=null
        const point=null
        const amount=null
        const cardNo=null
        const mbCardId=null
        const isBirthMonth=null
        const ismember=false
        const payvisible=false
        const onbule=false
        const barcode=null
        const cardNoMobile=null

        this.props.dispatch({
            type:'cashier/datasouce',
            payload:datasouce
        })
        this.props.dispatch({
            type:'cashier/memberlist',
            payload:{name,levelStr,point,amount,cardNo,mbCardId,isBirthMonth,ismember}
        })
        this.props.dispatch({
            type:'cashier/payvisible',
            payload:payvisible
        })
        this.props.dispatch({
            type:'cashier/themeindex',
            payload:themeindex
        })
        this.props.dispatch({
            type:'cashier/onbule',
            payload:onbule
        })
        this.props.dispatch({
            type:'cashier/barcode',
            payload:barcode
        })
        this.props.dispatch({
            type:'cashier/cardNoMobile',
            payload:cardNoMobile
        })
        this.props.meths.focustap()
    }
    handleokents=(e)=>{
        if(e.keyCode==114){
             e.preventDefault()
        }
    }
    render() {
        return(
            <div>
                <Header type={true} color={true}/>
                <div className='counter cashier-counter-style'>
                    <EditableTable/>
                </div>
                <div className='mt30 footer'>
                    <div>
                        <Btncashier 
                            rowonDelete={this.rowonDelete.bind(this)} 
                            takein={this.takein.bind(this)} 
                            takeout={this.takeout.bind(this)} 
                            takezhe={this.takezhe.bind(this)}
                            /></div>
                    <div className='mt20'>
                        <Operation 
                            color={true} 
                            type={false} 
                            index={true} 
                            userplace='1' 
                        />
                    </div>
                </div>
                <div>
                    <Pay ref='pay' initdata={this.initdata.bind(this)}/>
                </div>
             </div> 
        )
    }
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
}


function mapStateToProps(state) {
    const {datasouce,meths,onBlur,payvisible,totolnumber,totolamount,meth1,themeindex}=state.cashier
    return {datasouce,meths,onBlur,payvisible,totolnumber,totolamount,meth1,themeindex};
}
export default connect(mapStateToProps)(Cashierindex);