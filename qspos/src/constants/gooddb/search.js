import { Button,Input,Icon,message } from 'antd';
import "./gooddb.css"
import MyUpload from './upload'
import { Link } from 'dva/router';
import {GetServerData} from '../../services/services';
import DbTextModal from './model'
import {LocalizedModal,Buttonico} from '../../components/Button/Button';
import Searchinput from  '../../components/Searchinput/Searchinput'

class Searchcomponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputvalue: '',
      dataSourcemessage: [],
      visible: false,
      type: null,
    }
  }
    //下载
    download=()=>{
        window.open('../static/db.xlsx')
    }
    //导入上传数据
    setdayasouceas=(data,total)=>{
        this.props.setdayasouce(data,total)
    }

    revisemessage=(messages)=>{
      this.setState({
        inputvalue:messages
      })
    }

    //搜索
    hindSearch=()=>{
        const values={keywords:this.state.inputvalue,limit:100000,currentPage:0}
        const result=GetServerData('qerp.pos.pd.spu.query',values)
        result.then((res) => {
            return res;
        }).then((json) => {
            if(json.code=='0'){
                let pdSpus=json.pdSpus
                let total=json.total
                this.setState({
                    pdSpus:pdSpus,
                    total:total
                },function(){
                    for(var i=0;i<pdSpus.length;i++){
                        pdSpus[i].key=i
                    }
                    this.props.setdayasouce(pdSpus,this.state.total)
                })
            }else{
                message.error(json.message);
            }
        })
    }

    //ref
    saveFormRef = (form) => {
        this.form = form;
    }

    //关闭弹窗
    hideModal = () => {
        const form = this.form;
        this.setState({ visible: false },function(){
            form.resetFields();
        });
    }

    //打开弹窗
    showModal = () => {
      let total = 0
      if(this.props.inShopId == null){
        message.error('请输入需求门店')
      }else{
        if(this.props.datasouce.length > 0){
          for(let i=0;i<this.props.datasouce.length;i++){
            let item = this.props.datasouce[i]
            if(item.exchangeQty != null){
              total = total + item.exchangeQty
              if(!(Number(item.exchangeQty)<Number(item.inventory))){
                message.error('第'+ (i+1) + '行商品调拨数量填写错误。调拨数量不得大于商品库存数量')
              }else{
                if(item.exchangePrice != null){
                  if(item.exchangePrice > parseFloat(item.toCPrice*item.exchangeQty)){
                    message.error('第'+ (i+1) +'行商品调拨总价填写错误。调拨总价不得大于商品零售总价')
                  }else if(item.exchangePrice < parseFloat(item.toBPrice*item.exchangeQty)){
                    message.error('第'+ (i+1) +'行商品调拨总价填写错误。调拨总价不得小于商品进货总价')
                  }
                }
              }
            }
          }
          if(total == 0){
            message.error('调拨商品总数不能为0')
          }else{
            this.setState({visible:true})
          }
        }else{
          message.error('请导入或搜索要调拨的商品')
        }
      }
    }

    submitListInfo = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const newdata = []
            const olddata = this.props.datasouce
            for(let i=0;i<olddata.length;i++){
              if(olddata[i].exchangeQty != null && olddata[i].exchangePrice != null){
                let data = {
                  pdSpuId : olddata[i].pdSpuId,
                  pdSkuId : olddata[i].pdSkuId,
                  qty : olddata[i].exchangeQty,
                  price : olddata[i].exchangePrice
                }
                newdata.push(data)
              }
            }
            let payload = {
              inShopId:this.props.inShopId,
              details:newdata,
              confirmRemark:values.remark
            }
            const result=GetServerData('qerp.qpos.pd.exchange.save',payload);
            result.then((res) => {
                return res;
            }).then((json) => {
                if(json.code=='0'){
                    message.success('调拨成功',3,this.callback());
                    form.resetFields();
                    this.setState({ visible: false });
                }else{
                    message.error(json.message);
                }
            })
        });
    }

    //跳转
    callback=()=>{
    	this.context.router.push('/dblog');
    }

    render(){
        return(
            <div className='clearfix mb10 adjust-v15-style'>
	      		<div className='fl clearfix'>
	      			<div className='fl btn' onClick={this.download.bind(this)}><Buttonico text='下载调拨模板'/></div>
	      			<div className='fl btn ml20'><MyUpload Setdate={this.setdayasouceas.bind(this)}/></div>
              <div className='fl btn ml20'><Link to='/dblog'><Buttonico text='商品调拨日志'/></Link></div>
	      		</div>
      			<div className='fr clearfix'>
              <div className='fl'><Searchinput text='请输入商品条码、商品名称' revisemessage={this.revisemessage.bind(this)} hindsearch={this.hindSearch.bind(this,0)}/></div>
          			<div className='searchselect clearfix fl'>
                  <div className='fl ml20 cancel-btn-style'><Link to='/goods'><Buttonico text='取消调拨'/></Link></div>
                  <div className='fl ml20 cancel-btn-style' onClick={this.showModal.bind(this)}><Buttonico text='确认调拨'/></div>
                  <DbTextModal
                            ref={this.saveFormRef}
                            visible={this.state.visible}
                            onCancel={this.hideModal}
                            onCreate={this.submitListInfo}
                            type={this.state.type}
                        />
                </div>
     			</div>
    		</div>
        )
    }
}

Searchcomponent.contextTypes= {
    router: React.PropTypes.object
}

export default Searchcomponent;
