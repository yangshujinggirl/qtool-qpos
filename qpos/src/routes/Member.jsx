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
const btn={
    position:'absolute',
    right:'0',
    'top':'0'
}
const inputwidth={
    width:'340px',
    height:'40px'
}
const addaccountspan={
    marginRight:'10px',
    fontSize:'14px',
    color: '#74777F'
}

const hrefshift_box={
    'width':'224px',
    'fontSize': '14px'
}
const hrefshift_boxs={
    'width':'224px',
    'fontSize': '14px',
    color:'#35BAB0'
}
const dividingline={
    width: '2px',
    height: '15px',
    background:'#E7E8EC',
    margin:'0 auto',
    marginTop: '3px'
}
const widthmeth={
    width:'100px',
    height:'40px',
    background:'#FFF',
    border: '1px solid #E7E8EC',
    borderRadius: '3px',
    color: '#35BAB0',
    fontSize: '14px',
    textAlign:'center',
    lineHeight:'40px',
    cursor: 'pointer'
}
const textcoloe={
    color: '#35BAB0'
}
const modelfooters={
    height:'20px',
    lineHeight:'20px',
    marginTop:'40px'
}
const footleft={
    width:'224px',
    fontSize: '14px',
    height:'60px',
    lineHeight:'60px'
}
const footlefts={
    width:'175px',
    fontSize: '14px',
    height:'60px',
    lineHeight:'60px'
}
const footright={
    width:'224px',
    fontSize: '14px',
    color:'#35BAB0',
    height:'60px',
    lineHeight:'60px'
}
const footrights={
    width:'175px',
    fontSize: '14px',
    color:'#35BAB0',
    height:'60px',
    lineHeight:'60px'
}
const footcen={
    width: '2px',
    height: '15px',
    background:'#E7E8EC',
    margin:'0 auto',
    marginTop: '20px'
}
const footcens={
    width:'100px',
    fontSize: '14px',
    height:'60px',
    lineHeight:'60px',
    margin:'0 auto',
    textAlign:'center'
}

const textplace={
    fontSize: '16px',
    color: '#74777F'
}




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
            mbCardBirths:[]
        }
    }
    MemberonChange = (e) => {
        console.log('radio checked', e.target.value);
        this.props.form.setFieldsValue({
            role: e.target.value,
        });
    }
    AccountonChange = (e) => {
        console.log('radio checked', e.target.value);
        this.props.form.setFieldsValue({
            status: e.target.value,
        });
    }
    showModal = () => {
        if(this.props.type==false){
            





            


        }


        console.log(2)
        this.setState({
            visible: true
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
                console.log(values)
                console.log(this)
                const dataSource=this.props.dataSource
                console.log(dataSource)
                values.mbCardBirths=dataSource
                let valuesdata={mbCardInfo:values}
                // if(this.props.type==false){
                //     values.urUserId=this.props.record.urUserId
                // }
                this.props.dispatch({
                    type:'member/save',
                    payload: {code:'qerp.pos.mb.card.save',valuesdata,type:true,meth:this.hideModal}
                })
                
            }
        });
    }

    NicknameHindchange=(e)=>{
        this.setState({
            nickname:e.target.value
        })
    }
    UsernameHindchange=(e)=>{
        this.setState({
            username:e.target.value
        })
    }
    revisepassword=()=>{
        if(this.props.type==false){
            let urUserId = sessionStorage.getItem("urUserId");
            let values={urUserId:urUserId}
            console.log(urUserId)
            console.log(sessionStorage)
            const result=GetServerData('qerp.pos.ur.user.passwordreset',values)
                result.then((res) => {
                  return res;
                }).then((json) => {
                    console.log(json)
                    if(json.code=='0'){
                        Messagesuccess(json.newPassword)
                    }else{  
                       
                    }
                })
        }
    }

    render() {
        const type=this.props.type
        const { getFieldDecorator,getFieldInstance,getFieldProps } = this.props.form;
        const { name, mobile, cardNo,level} = this.props.record;
        const mbCardBirths=this.state.mbCardBirths
        console.log(mbCardBirths)
        console.log(this)
        return (
            <div>
                <div style={this.props.type?widthmeth:textcoloe} onClick={this.showModal.bind(this)}>
                    {this.props.text}
                </div>
                <Modal
                    title={this.props.text}
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
                        <div style={type?footcen:footcens} key='line' onClick={this.revisepassword.bind(this)}>{type?null:'重置密码'}</div>
                    ]}
                >
                    <Form className='formdis'>
                        <FormItem 
                            label="会员姓名"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 8 }}
                            >
                            {getFieldDecorator('name', {
                                initialValue: name,
                                rules: [{ required: true, message: '请输入账号名称' }],
                            })(
                                <Input placeholder="请输入1-5位会员姓名" style={inputwidth} />
                            )}
                        </FormItem>
                        <FormItem 
                            label="会员电话"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 8 }}
                            >
                            {getFieldDecorator('mobile', {
                                initialValue: mobile,
                                rules: [{ required: true, message: '请输入帐号电话' }],
                            })(
                                <Input placeholder="请输入11位手机号" style={inputwidth} />
                            )}
                        </FormItem>
                        <FormItem 
                            label="会员卡号"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 8 }}
                            >
                            {getFieldDecorator('cardNo', {
                                initialValue: cardNo,
                                rules: [{ required: true, message: '请输入帐号电话' }],
                            })(
                                <Input placeholder="请输入6位会员卡号" style={inputwidth} />
                            )}
                        </FormItem>
                        <FormItem 
                            label="宝宝生日"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 8 }}
                            >
                            {getFieldDecorator('mbCardBirths', {
                                // initialValue: cardNo,
                                // rules: [{ required: true, message: '请输入帐号电话' }],
                            })(
                                <EditableTablebaby dispatch={this.props.dispatch} mbCardBirths={mbCardBirths} mbCardId={this.props.mbCardId}/>
                            )}
                        </FormItem>
                        <FormItem  label="会员级别">
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
            <Select  defaultValue={text} style={{ width: 60 }} onChange={this.yearhandleChange.bind(this,index)}>
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
            <Select defaultValue={text} style={{ width: 60 }} onChange={this.monthhandleChange.bind(this,index)}>
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
            <Select defaultValue={text} style={{ width: 60 }} onChange={this.dayhandleChange.bind(this,index)}>
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
        type:'2'
      }],
      count: 2,
      type:2
    };
  }
  onCellChange = (index, key) => {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = value;
      this.setState({ dataSource });
    };
  }
  
  setdata=()=>{
            const mbCardId=this.props.mbCardId
            console.log(mbCardId)
            let values={mbCardId:mbCardId}
            const result=GetServerData('qerp.pos.mb.card.info',values)
                result.then((res) => {
                  return res;
                }).then((json) => {
                    console.log(json)
                    if(json.code=='0'){
                       // this.setState({
                       //  mbCardBirths:json.mbCardBirths
                       // })
                       console.log(this)
                       this.setState({
                        dataSource:json.mbCardInfo.mbCardBirths
                       },function(){
                        console.log(this)
                       })
                    }else{  
                       
                    }
                })
  }
  onDelete = (index) => {
    const dataSource = [...this.state.dataSource];
    dataSource.splice(index, 1);
    this.setState({ dataSource });
  }
  handleAdd = () => {
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
    });
  }
  SwitchChange=(checked)=>{
    const dispatch=this.props.dispatch
    console.log(checked)
    if(checked){
        let ds=this.state.dataSource
        for(var i=0;i<ds.length;i++){
            ds[i].type=1
        }

        this.setState({
            dataSource:ds,
            type:1
        },function(){
            dispatch({
                type:'member/dataSource',
                payload: {dataSource:this.state.dataSource}
        })
        })
        
    }else{
        let ds=this.state.dataSource
        for(var i=0;i<ds.length;i++){
            ds[i].type=2
        }

        this.setState({
            dataSource:ds,
            type:2
        },function(){
            dispatch({
                type:'member/dataSource',
                payload: {dataSource:this.state.dataSource}
        })
        })
    }

  }
  yearhandleChange=(index,value)=>{
    console.log(this)
    const dispatch=this.props.dispatch
    console.log(index)
    let ds=this.state.dataSource
    ds[index].year=value
    this.setState({
        dataSource:ds
    },function(){
        dispatch({
            type:'member/dataSource',
            payload: {dataSource:this.state.dataSource}

        })
    })
  }
  monthhandleChange=(index,value)=>{
    console.log(index)
    let ds=this.state.dataSource
    const dispatch=this.props.dispatch
    ds[index].month=value
    this.setState({
        dataSource:ds
    },function(){
        dispatch({
            type:'member/dataSource',
            payload: {dataSource:this.state.dataSource}
        })
    })
  }
  dayhandleChange=(index,value)=>{
    console.log(text)
        const dispatch=this.props.dispatch
        console.log(index)
        let ds=this.state.dataSource
        ds[index].day=value
        this.setState({
            dataSource:ds
        },function(){
            dispatch({
            type:'member/dataSource',
            payload: {dataSource:this.state.dataSource}
        })
        })
  }
  render() {
    console.log(this)
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <div className='clearfix birthday' style={{width:'340px'}}>
        <div className='fl' style={{width:'250px'}}><Table bordered dataSource={this.state.dataSource} columns={columns} pagination={false} showHeader={false} bordered={false}/></div>
        <div className='fl clearfix' style={{width:'90px'}}>
            <div style={{width:'16px',height:'16px',borderRadius:'50%',border: '1px solid #E7E8EC',float:'left',margin:'10px'}} onClick={this.handleAdd}><i style={{position:'relative',top:'-10px',left:'2px',color:'#35bab0'}}>+</i></div>
            <div className='fl' style={{width:'54px'}}><Switch checkedChildren="公历" unCheckedChildren="农历" onChange={this.SwitchChange.bind(this)}/></div>
        </div>
      </div>
    );
  }
  componentDidMount(){
        this.setdata()
        
    }

}









//table
class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '会员姓名',
            dataIndex: 'name'
        }, {
            title: '会员电话',
            dataIndex: 'mobile'
        }, {
            title: '会员卡号',
            dataIndex: 'cardNo'
        },{
            title: '会员级别',
            dataIndex: 'level'
        },{
            title: '账户余额',
            dataIndex: 'amount'
        },{
            title: '会员积分',
            dataIndex: 'point'
        },{
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) => {
                return (
                    this.props.mbCards.length > 0 ?
                    (
                        <Modelforms  record={record} text='修改' width='450' dispatch={this.props.dispatch} type={false} cardinfo={this.cardinfo.bind(this,record)} mbCardId={record.mbCardId}/>
                    ) : null
                )
            },
        }];
    }

    cardinfo=(record)=>{
        // console.log(record.mbCardId)
        // const mbCardId=record.mbCardId
        // let values={mbCardId:mbCardId}
        // const result=GetServerData('qerp.pos.mb.card.info',values)
        //         result.then((res) => {
        //           return res;
        //         }).then((json) => {
        //             console.log(json)
        //             if(json.code=='0'){
        //                this.setState({
        //                 mbCardInfo:json.mbCardInfo
        //                })
        //             }else{  
                       
        //             }
        //         })


    }

    rowClassName=(record, index)=>{
        if (index % 2) {
            return 'table_gray'
        }else{
            return 'table_white'
        }
    }
    render() {
        const columns = this.columns;
        return (
            <div className='bgf'>
                <Table bordered dataSource={this.props.mbCards} columns={columns} rowClassName={this.rowClassName.bind(this)}/>
            </div>
        )
    }
}

//搜索区
function Searchcomponent({dispatch,dataSource}) {
    console.log(dispatch)
    console.log(dataSource)
  return (
    <div className='clearfix'>
      <div className='fl ml30'><Modelforms record={{level:'1'}} text='新增会员'  dispatch={dispatch} type={true} dataSource={dataSource}/></div>
      <div className='fr mr30'>
          <Searchinput text='请输入会员姓名、手机、会员卡号、级别'/>
      </div>
    </div>
  );
}
 

//主页面
function Member({mbCards,dispatch,dataSource}) {
    console.log(dataSource)
    return (
        <div>
            <Header type={false} color={true}/>
            <Searchcomponent dispatch={dispatch} dataSource={dataSource}/>
            <div className='count mt10'><EditableTable mbCards={mbCards} dispatch={dispatch}/></div>
        </div>
    )
}

function mapStateToProps(state) {
    console.log(state)
    const {mbCards,dataSource} = state.member;
    return {mbCards,dataSource};
}

export default connect(mapStateToProps)(Member);
