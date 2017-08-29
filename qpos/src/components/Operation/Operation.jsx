import React from 'react';
import { Table, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select,message,Switch} from 'antd';

const Operationrstyle={
	width:'100%',
	height:'225px',
	background: '#35BAB0',
	overfloe:'hidden'

}
const Operationrstyleano={
	width:'100%',
	height:'225px',
	background:'#FC4F4F',
	overfloe:'hidden'
}
const opera={
	width:'100%',
	height:'225px',
	background:'#fff'
}
const w55={
	width:'824px',
	height:'225px',
	float:'left'
}
const w45={
	width:'546px',
	height:'225px',
	float:'right'
}

const name36={
	fontSize: '36px',
	color: '#FFF',
	marginTop:'47px'

}

const name18={
	fontSize: '18px',
	color: '#FFF'
}
const name20={
	fontSize: '20px',
	color: '#FFF',
	marginLeft:'37px',
	marginTop:'46px'
}
const name40={
	fontSize: '40px',
	color: '#FFF',
	marginLeft:'37px'
}

const list1={
	width:'177px',
	height:'150px',
	borderRight:'1px solid rgba(255,255,255,0.5)',
	marginTop:'38px',
	textAlign:'center'
}
const list2={
	width:'155px',
	height:'150px',
	borderRight:'1px solid rgba(255,255,255,0.5)',
	marginTop:'38px'
}
const list3={
	width:'212px',
	height:'150px',
	marginTop:'38px'

}
const title=[
			{
				name:'收货',
				name2:'商品',
				name3:'数量'
			},{
				name:'结算',
				name2:'数量',
				name3:'金额'
			}
		]


class Operationl extends React.Component {
	render() {
		return(
			<div className='operationl clearfix'>
      			<Input placeholder='扫码或输入配货单号' style={{width:'200px',height:'50px',fontSize:'20px',color:'#74777F'}} className='fl m30'/>
      			<Input placeholder='扫码或输入条形码' style={{width:'250px',height:'50px',fontSize:'20px',color:'#74777F'}} className='fl ml20'/>
    		</div>
		)
	}
}
class Operationls extends React.Component {
	hindchange=(e)=>{
		console.log(e)
		if(e=='true'){
			this.context.router.push('/cashier')
		}else{
			this.context.router.push('/returngoods')
		}
	}
	render(){
		return(
			<div>
				<div className='operationl clearfix'>
	      			<Input placeholder='扫码或输入条形码' style={{width:'300px',height:'50px',fontSize:'30px',color:'#74777F'}} className='fl m30'/>
	      			<Input placeholder='会员号/手机号' style={{width:'300px',height:'50px',fontSize:'30px',color:'#74777F'}} className='fl ml20'/>
	    		</div>
	    		<div className='clearfix'>
	    			<div className='cashier fl'><Switch checkedChildren="开" unCheckedChildren="关" onChange={this.hindchange.bind(this)}/></div>
	    			<div style={{width:'300px',height:'96px',border:'1px solid #E7E8EC',borderRadius:'3px',marginLeft:'20px'}} className='fl'>
	    				<div style={{borderBottom:'1px solid #E7E8EC',height:'40px',lineHeight:'40px',fontSize:'14px',textAlign:'center'}} className='clearfix'><div className='fl'><span className='c74 ml10'>会员姓名</span><span className='c38 ml10'>yelin96</span></div><div className='fr'><span className='themecolor mr10'>金牌会员 | 生日</span></div></div>
	    				<div className='clearfix f14' style={{margin:'0 auto',width:'216px'}}>
	    					<div className='fl tc'><p className='c74'>余额<div style={{width:'30px',height:'15px',border:'1px solid #35BAB0',textAlign:'center',lineHeight:'15px',borderRight:'3px',fontSize:'10px'}}>充值</div></p><p className='c38'>999.00</p></div>
	    					<div className='fl tc'><p className='c74'>剩余积分</p><p className='c38'>999000</p></div>
	    					<div className='fl tc'><p className='c74'>本次积分</p><p className='c38'>999</p></div>
	    				</div>
	    			</div>
	    		</div>
    		</div>
			)
	}
}

Operationls.contextTypes= {
    router: React.PropTypes.object
}

class Operationr extends React.Component {
	hindclick=()=>{
		console.log(1)
	}
	render() {
		const color=this.props.color
		const type=this.props.type
		return(
			<div style={color?Operationrstyle:Operationrstyleano}>
      			<div className='fl' style={list1} onClick={this.hindclick.bind(this)}>
      				<div style={name36}>{type?title[0].name:title[1].name}</div>
      				<div style={name18}>「空格键」</div>
      			</div>
      			<div className='fl' style={list2}>
      				<div style={name20}>{type?title[0].name2:title[1].name2}</div>
      				<div style={name40}>9999</div>
      			</div>
      			<div className='fl' style={list3}>
      				<div style={name20}>{type?title[0].name3:title[1].name3}</div>
      				<div style={name40}>8900.00</div>
      			</div>
    		</div>
		)
	}
}

class Operation extends React.Component {
	render() {
		return(
			<div className='count clearfix'>
				<div style={opera}>
      				<div style={w55}>
      					{
      						this.props.index==true
      						?<Operationls/>
      						:<Operationl/>
      					}
      				</div>
      				<div style={w45}><Operationr color={this.props.color} type={this.props.type}/></div>
      			</div>
    		</div>
		)
	}
}
export default Operation;