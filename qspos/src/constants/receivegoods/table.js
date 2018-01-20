
import React from 'react';
import { connect } from 'dva';
import { Table, Input, Icon, Button, Popconfirm ,message} from 'antd';
import NP from 'number-precision'
import {GetServerData} from '../../services/services';
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
            width:'8%'
        }, {
            title: '商品条码',
            dataIndex: 'barcode',
            width:'10%',
        }, {
            title: '商品名称',
            dataIndex: 'name',
            width:'15%',
        },{
            title: '规格',
            dataIndex: 'displayName',
            width:'10%',
        },{
            title: '待收数量',
            dataIndex: 'unReceiveQty',
            width:'10%',
        },{
            title: '本次数量',
            dataIndex: 'receiveQty',
            width:'10%',
            render: (text, record, index) => {
                return (
                    <Input 
                        style={inputwidth} 
                        value={text} 
                        onChange={this.qtyChange.bind(this,index)}
                        onBlur={this.discountblur.bind(this,index)}
                        className='tc'
                    />       
                );
            }
        },{
            title: '零售价',
            dataIndex: 'toCPrice',
            width:'10%',
        }];
        this._isMounted = false;
        this.columnsrole = [{
            title: '序号',
            dataIndex: 'index',
            width:'8%'
        }, {
            title: '商品条码',
            dataIndex: 'barcode',
            width:'10%',
        }, {
            title: '商品名称',
            dataIndex: 'name',
            width:'15%',
        },{
            title: '规格',
            dataIndex: 'displayName',
            width:'10%',
        },{
            title: '待收数量',
            dataIndex: 'unReceiveQty',
            width:'10%',
        },{
            title: '本次数量',
            dataIndex: 'receiveQty',
            width:'10%',
            render: (text, record, index) => {
                return (
                    <Input 
                        style={inputwidth} 
                        value={text} 
                        onChange={this.qtyChange.bind(this,index)}
                        onBlur={this.discountblur.bind(this,index)}
                        className='tc'
                    />       
                );
            }
        },{
            title: '零售价',
            dataIndex: 'toCPrice',
            width:'10%',
        },{
            title: '成本价',
            dataIndex: 'averageRecPrice',
            width:'10%',
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
    qtyChange=(index,e)=>{
        const re=/^[0-9]*$/
        const values=e.target.value
        const str=re.test(values)
        if(str){
            const datasouce=this.props.datasouce.slice(0)
            datasouce[index].receiveQty=values
            this.props.dispatch({
				type:'receivegoods/datasoucechange',
				payload:datasouce
			})
        }  
    }

    //数量失去焦点
    discountblur=(index,e)=>{
        const values=e.target.value
        const datasouce=this.props.datasouce.slice(0)
        datasouce[index].receiveQty=values
        if(Number(values)>Number(datasouce[index].unReceiveQty)){
            datasouce[index].receiveQty=datasouce[index].unReceiveQty
            message.warning('超出应收数量，默认为总数');
        }
        const pdOrderId=this.props.pdOrderId
        this.props.dispatch({
            type:'receivegoods/datasouce',
            payload:{datasouce,pdOrderId}
        })
    }
    rowClassName=(record, index)=>{
        if(index==this.props.themeindex){
            return 'themebgcolor'
        }else{
            if (index % 2) {
                return 'table_white'
            }else{
                return 'table_gray'
            }
        }
    }
    //行点击 
    rowclick=(record,index,event)=>{
        const themeindex=index
		this.props.dispatch({
			type:'receivegoods/themeindex',
			payload:themeindex
		})
    }

    windowResize = () =>{
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

    render() {
        const columns = this.columns;
        let role=sessionStorage.getItem('role');
        return (
            <div className='bgf'>
                <Table 
                    bordered 
                    dataSource={this.props.datasouce} 
                    columns={role=='3'?this.columns:this.columnsrole} 
                    rowClassName={this.rowClassName.bind(this)}  
                    pagination={false}
                    onRowClick={this.rowclick.bind(this)}
                    scroll={{ y: this.state.windowHeight }}
                />
          </div>
        );
    }

    componentDidMount(){
        this._isMounted = true;
        if(this._isMounted){
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
    }
    componentWillUnmount(){   
        this._isMounted = false;
        window.removeEventListener('resize', this.windowResize);
    }
}


function mapStateToProps(state) {
    const {datasouce,themeindex,pdOrderId} = state.receivegoods;
    return {datasouce,themeindex,pdOrderId};
}

export default connect(mapStateToProps)(EditableTable);
