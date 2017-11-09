import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Form, Select,Radio,Modal,message,Switch} from 'antd';
import Header from '../components/header/Header';
import Buttonico from '../components/Button/Button';
import Searchinput from '../components/Searchinput/Searchinput';
import {Messagesuccess} from '../components/Method/Method';
import {GetServerData} from '../services/services';
import {Gettime} from '../services/data';
//css
const btn={position:'absolute',right:'0','top':'0'}
const inputwidth={width:'340px',height:'40px'}
const addaccountspan={marginRight:'10px',fontSize:'14px',color: '#74777F'}
const hrefshift_box={'width':'224px','fontSize': '14px'}
const hrefshift_boxs={'width':'224px','fontSize': '14px',color:'#35BAB0'}
const dividingline={width: '2px',height: '15px',background:'#E7E8EC',margin:'0 auto',marginTop: '3px'}
const widthmeth={width:'100px',height:'40px',background:'#FFF',border: '1px solid #E7E8EC',borderRadius: '3px',color: '#35BAB0',
fontSize: '14px',textAlign:'center',lineHeight:'40px',cursor: 'pointer'}
const textcoloe={color: '#35BAB0',cursor: 'pointer'}
const modelfooters={height:'20px',lineHeight:'20px',marginTop:'40px'}
const footleft={width:'224px',fontSize: '16px',height:'60px',lineHeight:'60px',cursor: 'pointer',}
const footlefts={width:'175px',fontSize: '16px',height:'60px',lineHeight:'60px',cursor: 'pointer'}
const footright={width:'224px',fontSize: '16px',color:'#35BAB0',height:'60px',lineHeight:'60px',cursor: 'pointer'}
const footrights={width:'175px',fontSize: '16px',color:'#35BAB0',height:'60px',lineHeight:'60px',cursor: 'pointer'}
const footcen={width: '1px',height: '15px',background:'#d8d8d8',margin:'0 auto',marginTop: '20px'}
const footcens={width:'100px',fontSize: '16px',height:'60px',lineHeight:'60px',margin:'0 auto',textAlign:'center'}
const textplace={fontSize: '16px',color: '#74777F',display:'inlineBlock',lineHeight:'40px'}


//常量
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const batrhdata=Gettime()
//pop弹窗
class Modelform extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            membervalue: 1,
            accountvalue:1,
            mbCardBirths:[],
            key:0,
        },
        this.babydatasouces=[]
    }
    MemberonChange = (e) => {
        this.props.form.setFieldsValue({
            role: e.target.value,
        });
    }
    showModal = () => {
        this.setState({
            visible: true
        },function(){
            this.memberinit()
        });
    }
    hideModal = () => {
        this.setState({
            visible: false,
        });
        this.props.form.resetFields()
    }
    handleCancel = () => {
        this.setState({ visible: false });
        this.props.form.resetFields()
    }
    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.mbCardBirths=this.babydatasouces
                console.log(this.babydatasouces)
                //如果数组中所有元素都满足条件，则通过，否则抛出异常
                var babydatatattu=values.mbCardBirths.every(function(item,index){
                  return  (item.year==null && item.month===null && item.day===null) || (item.year!=null && item.month!=null && item.day!=null)
                })
                if(babydatatattu){
                    if(this.props.type==false){
                        const {mbCardId} = this.props.record; 
                        values.mbCardId=mbCardId
                    }
                    let valuesdata={mbCardInfo:values}
                    const result=GetServerData('qerp.pos.mb.card.save',valuesdata)
                    result.then((res) => {
                        return res;
                    }).then((json) => {
                        console.log(json)
                        if(json.code=='0'){
                            if(this.props.type){
                                message.success('会员新建成功',1)
                            }else{
                                message.success('会员信息修改成功',1)
                            }
                           this.hideModal()
                           this.props.dispatch({
                                type:'member/fetch',
                                payload: {code:'qerp.pos.mb.card.query',values:{keywords:''}}
                            })
                        }else{  
                           message.error(json.message);
                        }
                    })
                }else{
                    message.warning('生日信息不全')
                }

            } 
        
        })
    }
    
    receivebabydata=(dataSource)=>{
        console.log(dataSource)
        this.babydatasouces=dataSource
    }
    memberinit=()=>{
        console.log(this.props.form.getFieldInstance('ref'))
        const memberdatas=this.props.form.getFieldInstance('ref').memberdata
        memberdatas()
    }
    render() {
        const type=this.props.type
        const { getFieldDecorator,getFieldInstance,getFieldProps } = this.props.form;
        const { name, mobile, cardNo,level,mbCardId,amount,point} = this.props.record;
        const mbCardBirths=this.state.mbCardBirths
        return (
            <div>
                <div style={this.props.type?widthmeth:textcoloe} onClick={this.showModal.bind(this)}>
                    {this.props.text}
                </div>
                <Modal
                    className="member-width-style"
                    title={this.props.texts}
                    visible={this.state.visible}
                    onOk={this.hideModal}
                    onCancel={this.hideModal}
                    okText="确认"
                    cancelText="取消"
                    width={this.props.width+'px'}
                    closable={false}
                    width={450}
                    footer={[
                        <div className='fl tc' style={type?footleft:footlefts} key='back' onClick={this.handleCancel.bind(this)}>取消</div>,
                        <div className='fr tc' style={type?footright:footrights} key='submit' onClick={this.handleOk.bind(this)}>确定</div>,
                        <div style={footcen} key='line'></div>
                    ]}
                >
                    <Form className='formdis'>
                        <FormItem 
                            label="会员姓名"
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 8 }}
                            >
                            {getFieldDecorator('name', {
                                initialValue: name,
                                rules: [{ required: true, message: '请输入1-5位会员姓名' }],
                            })(
                                <Input placeholder="请输入1-5位会员姓名" className='inputwidth'/>
                            )}
                        </FormItem>
                        <FormItem 
                            label="会员电话"
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 8 }}
                            >
                            {getFieldDecorator('mobile', {
                                initialValue: mobile,
                                rules: [{ required: true, message: '请输入11位手机号' }],
                            })(
                                <Input placeholder="请输入11位手机号" className='inputwidth' />
                            )}
                        </FormItem>
                        <FormItem 
                            label="会员卡号"
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 8 }}
                            >
                            {getFieldDecorator('cardNo', {
                                initialValue: cardNo,
                                rules: [{ required: true, message: '请输入6位会员卡号' }],
                            })(
                                <Input placeholder="请输入6位会员卡号" className='inputwidth' />
                            )}
                        </FormItem>
                        <FormItem 
                            label="宝宝生日"
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 8 }}
                            className='listform'
                            >
                            {getFieldDecorator('mbCardBirths', {
                            })(
                                <EditableTablebaby 
                                    dispatch={this.props.dispatch} 
                                    mbCardBirths={mbCardBirths} 
                                    mbCardId={this.props.mbCardId} 
                                    receivebabydata={this.receivebabydata.bind(this)} 
                                    type={this.props.type}
                                    {...getFieldProps('ref')}
                                />
                            )}
                        </FormItem>
                        <FormItem  
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 8 }}
                        label="会员级别"
                        className='listform'
                        >
                            {getFieldDecorator('level', {
                                initialValue: Number(level)
                            })(
                                <RadioGroup onChange={this.MemberonChange.bind(this)}>
                                    <Radio value={1}>金卡</Radio>
                                    <Radio value={2}>银卡</Radio>
                                    <Radio value={3}>普卡</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        {
                            this.props.type
                            ? 
                                null
                            :
                                <FormItem  
                                label="账户金额"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 8 }}
                                className='listform'
                                >
                                    {getFieldDecorator('amount', {
                                        initialValue: Number(amount)
                                    })(
                                        <Input className='inputwidth teinput' disabled/>
                                    )}
                                </FormItem>
                        }
                        {
                            this.props.type
                            ?
                                null
                            :
                                <FormItem  
                                label="会员积分"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 8 }}
                                className='listform'
                                >
                                    {getFieldDecorator('point', {
                                        initialValue: Number(point)
                                    })(
                                        <Input className='inputwidth teinput' disabled/>
                                    )}
                                </FormItem>
                           
                         }
                    </Form>   
                </Modal>
            </div>
        );
    }
    
}

const Modelforms=Form.create()(Modelform);

//宝宝生日table
class EditableTablebaby extends React.Component {
    constructor(props) {
    super(props);
    this.columns = [{
        title: 'year',
        dataIndex: 'year',
        render: (text, record, index) => (
            <div>
                <Select  style={{ width: 64 }} onChange={this.yearhandleChange.bind(this,index)} value={this.state.dataSource[index].year}>
                {
                    batrhdata.year.map((item,index)=>{
                        return (<Option  key={index} value={item}>{item}</Option>)
                    })
                }
                </Select>
                <span style={textplace}>年</span>
            </div>
        ),
    }, {
        title: 'month',
        dataIndex: 'month',
        width: '30%',
        render: (text, record, index) => (
            <div>
                <Select  style={{ width: 50 }} onChange={this.monthhandleChange.bind(this,index)} value={this.state.dataSource[index].month}>
                  {
                    batrhdata.month.map((item,index)=>{
                        return (<Option  key={index} value={item}>{item}</Option>)
                    })
                }
                </Select>
                <span style={textplace}>月</span>
            </div>
        )
    }, {
        title: 'day',
        dataIndex: 'day',
        width: '30%',
        render: (text, record, index) => (
             <div>
                <Select style={{ width: 50 }} onChange={this.dayhandleChange.bind(this,index)} value={this.state.dataSource[index].day}>
                  {
                    batrhdata.day.map((item,index)=>{
                        return (<Option  key={index} value={item}>{item}</Option>)
                    })
                }
                </Select>
                <span style={textplace}>日</span>
            </div>
          )
    }];
    this.state = {
        dataSource: [{
            key: 0,
            year: '',
            month: '',
            day: '',
            type:'1'
        }],
        count: 2,
        type:1,
        checked:true,    
    };
  }
 
    
    handleAdd = () => {
        if(this.state.dataSource.length>5 || this.state.dataSource.length==5){
            message.warning('宝宝生日最多可以添加5条')
            return
        }
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            year:'',
            month:'',
            day:'',
            type:this.state.type
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        },function(){
            this.props.receivebabydata(this.state.dataSource)
        });
    }
    SwitchChange=(checked)=>{
        console.log(checked)
        const dispatch=this.props.dispatch
        if(checked){
            var ds=this.state.dataSource
            for(var i=0;i<ds.length;i++){
                ds[i].type=1
            }
            this.setState({
                dataSource:ds,
                type:1,
                checked:checked
            },function(){
                this.props.receivebabydata(this.state.dataSource)
            })
        }else{
            var ds=this.state.dataSource
            for(var i=0;i<ds.length;i++){
                ds[i].type=2
            }
            this.setState({
                dataSource:ds,
                type:2,
                checked:checked
            },function(){
                this.props.receivebabydata(this.state.dataSource)
            })
        }
    }
    yearhandleChange=(index,value)=>{
        const dispatch=this.props.dispatch
        let ds=this.state.dataSource
        ds[index].year=value
        this.setState({
            dataSource:ds,
        },function(){
            this.props.receivebabydata(this.state.dataSource)
        })
    }
    monthhandleChange=(index,value)=>{
        let ds=this.state.dataSource
        const dispatch=this.props.dispatch
        ds[index].month=value
        this.setState({
            dataSource:ds,
        },function(){
            this.props.receivebabydata(this.state.dataSource)
        })
    }
    dayhandleChange=(index,value)=>{
        console.log(value)
        const dispatch=this.props.dispatch
        let ds=this.state.dataSource
        ds[index].day=value
        this.setState({
            dataSource:ds,
          
        },function(){
            this.props.receivebabydata(this.state.dataSource)
        })
    }


    //数据请求
    memberdata=()=>{
        this.props.receivebabydata(this.state.dataSource)
        if(this.props.type==false){
            const mbCardId=this.props.mbCardId
            let values={mbCardId:mbCardId}
            const result=GetServerData('qerp.pos.mb.card.info',values)
                result.then((res) => {
                  return res;
                }).then((json) => {
                    console.log(json)
                    if(json.code=='0'){
                        let mbCardInfo=json.mbCardInfo.mbCardBirths
                        if(mbCardInfo.length>0){
                            const barthtype=mbCardInfo[0].type
                            for(var i=0;i<mbCardInfo.length;i++){
                                mbCardInfo[i].key=i
                            }
                            if(barthtype=='1'){
                                this.setState({
                                    type:1,
                                    dataSource:mbCardInfo,
                                    checked:true

                                },function(){
                                    this.props.receivebabydata(this.state.dataSource)
                                })
                            }
                            if(barthtype=='2'){
                                this.setState({
                                    type:2,
                                    dataSource:mbCardInfo,
                                     checked:false
                                },function(){
                                    this.props.receivebabydata(this.state.dataSource)
                                })
                           }
                        }else{
                                this.setState({
                                    type:1,
                                    dataSource:[
                                        {
                                            year:null,
                                            month:null,
                                            day:null,
                                            key:-1,
                                            type:1,
                                        }
                                            ],
                                    checked:true
                                },function(){
                                    this.props.receivebabydata(this.state.dataSource)
                                })
                        
                        }

                    }else{  
                        this.props.receivebabydata(this.state.dataSource)
                    }
                })
        }else{
            this.setState({
                    type:1,
                    dataSource:[
                        {
                            year:null,
                            month:null,
                            day:null,
                            key:-1,
                            type:1
                        }
                            ],
                    checked:true
                },function(){
                     this.props.receivebabydata(this.state.dataSource)
            })
        }


    }

    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
    return (
      <div className='clearfix birthday' style={{width:'340px'}}>
        <div className='fl babytablesbox'>
            <Table 
                bordered 
                dataSource={this.state.dataSource} 
                columns={columns} 
                pagination={false} 
                showHeader={false} 
                bordered={false}
                className='babytables'
            />
        </div>
        <div className='fl clearfix' style={{width:'90px'}}>
            <div onClick={this.handleAdd} className='fl mr10 ml10 themecolor' style={{height:'40px',lineHeight:'40px'}}>
                <Icon type="plus-circle-o" />
            </div>
            <div className='fl' style={{width:'54px',height:'40ox',lineHeight:'36px'}}>
                <Switch 
                    checkedChildren="公历" 
                    unCheckedChildren="农历" 
                    onChange={this.SwitchChange.bind(this)} 
                    checked={this.state.checked}
                />
            </div>
        </div>
      </div>
    );
  }
  componentDidMount(){
        this.memberdata()
    }

}




//table
class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage:1,
            pageSize:localStorage.getItem("pageSize")==null?10:Number(localStorage.getItem("pageSize")),
            windowHeight:''
        };
        this.columns = [{
            title: '会员姓名',
            dataIndex: 'name',
            width:'10%'
        }, {
            title: '会员电话',
            width:'15%',
            dataIndex: 'mobile'
        }, {
            title: '会员卡号',
            width:'15%',
            dataIndex: 'cardNo'
        },{
            title: '会员级别',
            width:'15%',
            dataIndex: 'levelStr'
        },{
            title: '账户余额',
            width:'15%',
            dataIndex: 'amount'
        },{
            title: '会员积分',
            width:'15%',
            dataIndex: 'point'
        },{
            title: '操作',
            width:'15%',
            dataIndex: 'operation',
            render: (text, record, index) => {
                return (
                    this.props.mbCards.length > 0 ?
                    (
                        <Modelforms  
                            record={record} 
                            text='修改' 
                            width='450' 
                            dispatch={this.props.dispatch} 
                            type={false}  
                            mbCardId={record.mbCardId}
                            amount={record.amount}
                            point={record.point}
                            texts='修改会员信息'
                        />
                    ) : null
                )
            },
        }];
    }
    rowClassName=(record, index)=>{
        if (index % 2) {
            return 'table_gray'
        }else{
            return 'table_white'
        }
    }
    hindchange=(page)=>{
        console.log(page)
        this.props.dispatch({ type: 'member/fetch', payload: {code:'qerp.pos.mb.card.query',values:{keywords:'',limit:'10',currentPage:page.current-1}} });

    }

    pageChange=(page,pageSize)=>{
        this.setState({
            currentPage:page
        },function(){
            const current=Number(page)-1;
            this.props.pagefresh(current,this.state.pageSize)
        });
    }
    
    //pageSize 变化的回调
    onShowSizeChange=(current, pageSize)=>{
        this.setState({
            pageSize:pageSize,
            currentPage:1
        },function(){
             localStorage.setItem("pageSize", pageSize); 
            this.props.pagefresh(0,pageSize)
        })
        
    }

    windowResize = () =>{
       this.setState({
        windowHeight:document.body.offsetHeight-300
       });
    }

    render() {
        const columns = this.columns;
        return (
            <div className='member-style'>
               <Table bordered dataSource={this.props.mbCards} columns={columns} rowClassName={this.rowClassName.bind(this)} loding={this.props.loding}  
               pagination={{'total':Number(this.props.total),current:this.state.currentPage,
                            pageSize:this.state.pageSize,showSizeChanger:true,onShowSizeChange:this.onShowSizeChange,
                            onChange:this.pageChange,pageSizeOptions:['10','11','12','13','16','20']}}
               scroll={{y:this.state.windowHeight}}
               />
            </div>
        )
    }

    componentDidMount(){
        this.setState({
           windowHeight:document.body.offsetHeight-300
         });
        window.addEventListener('resize', this.windowResize);    
    }
    componentWillUnmount(){   
        window.removeEventListener('resize', this.windowResize);
    }
}

//搜索区
class Searchcomponent extends React.Component{
    state={
        searchvalue:''
    }
    revisemessage=(messages)=>{
        this.setState({
            searchvalue:messages
        })
    }
    hindsearch=()=>{
        this.props.dispatch({ 
            type: 'member/fetch', 
            payload: {code:'qerp.pos.mb.card.query',values:{keywords:this.state.searchvalue,limit:'10',currentPage:0}} 
        });
    }

    pagefresh=(currentPage,pagesize)=>{
        console.log(currentPage)
        console.log(pagesize)
        this.props.dispatch({
                type:'member/fetch',
                payload: {code:'qerp.pos.mb.card.query',values:{keywords:this.state.searchvalue,limit:pagesize,currentPage:currentPage} }
        })
    }

    render(){
        return (
            <div className='clearfix mb10'>
                <div className='fl'><Modelforms record={{level:'3'}} texts='新增会员' text='新增会员' dispatch={this.props.dispatch} type={true}/></div>
                <div className='fr'>
                    <Searchinput 
                        text='请输入会员姓名、手机、会员卡号' 
                        revisemessage={this.revisemessage.bind(this)} 
                        hindsearch={this.hindsearch.bind(this)}
                    />
                </div>
            </div>  
        );
    }


}

//主页面
class Member extends React.Component{

    pagefresh=(currentPage,pagesize)=>{
        const pagefreshs=this.refs.search.pagefresh
        pagefreshs(currentPage,pagesize)
    }

   render(){
      return (
        <div>
            <Header type={false} color={true}/>
            <div className='search-component'>
                <Searchcomponent dispatch={this.props.dispatch} ref="search"/>
            </div>
            <div className='counters goods-counters'>
                <EditableTable mbCards={this.props.mbCards} 
                                dispatch={this.props.dispatch} 
                                loding={this.props.loding} 
                                total={this.props.total} 
                                pagefresh={this.pagefresh.bind(this)}/>
            </div>
        </div>
     )
   }
}

function mapStateToProps(state) {
    console.log(state)
    const {mbCards,loding,total} = state.member;
    return {mbCards,loding,total};
}

export default connect(mapStateToProps)(Member);
