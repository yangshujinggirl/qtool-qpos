import { Button,Input,Icon,message } from 'antd';
import "./gooddb.css"
import MyUpload from './upload'
import { Link } from 'dva/router';
import {GetServerData} from '../../services/services';
import DbTextModal from './model'
import {LocalizedModal,Buttonico} from '../../components/Button/Button';

const Search = Input.Search;
const searchtext=<span style={{fontSize:'14px'}}><Icon type="search" />搜索</span>

class Searchcomponent extends React.Component {
    state={
        inputvalue:'',
        dataSourcemessage:[],
        visible: false,
        type:null,
    }
    //下载
    download=()=>{
        window.open('../static/db.xlsx')
    }
    //导入上传数据
    setdayasouceas=(data,total)=>{
        this.props.setdayasouce(data,total)
    }
    //搜索
    hindSearch=(value)=>{
        const values={keywords:value,limit:100000,currentPage:0}
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
        this.setState({ visible: true});
    }
    //搜索
    submitListInfo = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log(values)
            values.details=this.ptops.datasouce
            values.inShopId=this.props.inShopId
            const result=GetServerData('qerp.pos.pd.adjust.save',data);
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
    	this.context.router.push('/goods');
    }
    render(){
        return(
            <div className='clearfix mb10 adjust-v15-style'>
	      		<div className='fl clearfix'>
	      			<div className='fl mr20' onClick={this.download.bind(this)}><Buttonico text='下载调拨模板'/></div>
	      			<div className='fl mr20'><MyUpload Setdate={this.setdayasouceas.bind(this)}/></div>
                    <div className='fl'><Link to='/dblog'><Button size='large' className='searchbtn'>商品调拨日志</Button></Link></div>
	      		</div>
      			<div className='fr clearfix'>
          			<div className='fl search_inputmod'>
                        <Search placeholder='请输入商品条码、名称' size="large" enterButton={searchtext}  onSearch={this.hindSearch.bind(this)}/>
                    </div>
          			<div className='searchselect clearfix fl'>
	                    <div className='fl ml20 cancel-btn-style'><Button size='large'>取消调拨</Button></div>
	      				<div className='fl ml20 cancel-btn-style'><Button size='large' onClick={this.showModal.bind(this)}>确认调拨</Button></div>
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