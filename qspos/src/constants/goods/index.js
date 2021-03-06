import React from 'react';
import { connect } from 'dva';
import Header from '../../components/Qheader';
import SearchinputTwo from '../../components/Searchinput/searchTwo';
import {Buttonico} from '../../components/Button/Button';
import { Table, Popover, Input, Icon, Button, Popconfirm ,Tabs,Tooltip ,DatePicker,Select} from 'antd';
import { Link } from 'dva/router';
import {GetServerData} from '../../services/services';
import {GetExportData} from '../../services/services';
import Qpagination from '../../components/Qpagination';
import Qtable from '../../components/Qtable';
import { columnsClerk, columns } from './columns';
import './index.less';



const Option = Select.Option;
const Searchcomponent = ({ ...props }) => {
  const role = sessionStorage.getItem('role');
  return(
    <div className='clearfix mb10'>
      {
        role != 3?
        <div className='fl clearfix'>
          <div className='fl btn goodindex-btn'>
            <Link to='/adjust'>
                <Buttonico text='商品损益'/>
            </Link>
          </div>
          <div className='fl btn ml20 goodindex-btn'>
            <Link to='/inventory'>
              <Buttonico text='店铺盘点'/>
            </Link>
          </div>
          {
            role == 1 ?
            <div className='fl btn ml20 goodindex-btn'>
              <Link to='/gooddb'><Buttonico text='店铺调拨'/></Link>
            </div>
            :
            null
          }
        </div>
        :
        null
      }
      <div className='fr clearfix'>
        <div className='searchselect clearfix fl goodindex-select-box'>
          <label>商品分类</label>
          <Select
            onChange={(value)=>props.handleChange(value,'select')}
            defaultValue={null}
            className='goodindex-select'>
            <Option value={null} key='-1'>全部</Option>
            {
              props.pdCategories.map((item,index)=>(
                <Option value={item.pdCategoryId} key={index}>{item.name}</Option>
              ))
            }
          </Select>
        </div>
        <div className='fl'>
          <SearchinputTwo
            text='请输入商品条码、名称'
            revisemessage={(value)=>props.handleChange(value,'input')}
            hindsearch={props.hindsearch.bind(this)}
            exportData={props.exportData.bind(this)}/>
        </div>
      </div>
    </div>
  )
}

class Goods extends React.Component {
  state={
      inputvalue:'',
      selectvalue:null,
      currentPage:0,
      limit:15,
      total:0
  }
  componentDidMount() {
    this.props.dispatch({
      type:'goods/fetch',
      payload:{}
    })
    this.props.dispatch({
      type:'goods/pdCategorieslist',
      payload:{}
    })
  }
  pagefresh=(currentPage,pagesize)=>{
    this.setState({
        limit:pagesize,
        currentPage
    });
    this.props.dispatch({
      type:'goods/fetch',
      payload: {
        keywords:this.state.inputvalue,
        pdCategoryId:this.state.selectvalue,
        limit:pagesize,
        currentPage:currentPage
      }
    })
  }
  handleChange=(value,type)=>{
    if(type == 'select') {
      this.setState({
          selectvalue:value
      })
    } else {
      this.setState({
        inputvalue:value
      })
    }
  }
  hindsearch=()=>{
    const { limit, currentPage, inputvalue, selectvalue } =this.state;
    this.props.dispatch({
      type:'goods/fetch',
      payload: {
        keywords:inputvalue,
        pdCategoryId:selectvalue,
        limit,
        currentPage:0
      }
    })
  }
  //导出数据
  exportData = () =>{
      let data = {
          keywords:this.state.inputvalue,
          pdCategoryId:this.state.selectvalue
      };
      const result=GetExportData('qerp.pos.pd.spu.export',data);
  }
  changePage(currentPage) {
    currentPage--
    const { limit, inputvalue, selectvalue } =this.state;
    let params = {
          keywords:inputvalue,
          pdCategoryId:selectvalue,
          limit,
          currentPage
        }
    this.props.dispatch({
      type:'goods/fetch',
      payload:params
    });
    this.setState({ currentPage })
  }
  changePageSize(values) {
    const { inputvalue, selectvalue } =this.state;
    let params = {
          keywords:inputvalue,
          pdCategoryId:selectvalue,
          limit:values.limit,
          currentPage:values.currentPage
        }
    this.props.dispatch({
      type:'goods/fetch',
      payload:params
    });
    this.setState({ currentPage:values.currentPage,limit:values.limit })
  }
  render() {
    const { data, pdSpus, pdCategories } =this.props;
    const role = sessionStorage.getItem('role');
    return (
      <div className="goods-manage goods-manage-pages">
        <Header type={false} color={true}/>
        <div className='goods-v15-style main-content-action'>
          <Searchcomponent
            hindsearch={this.hindsearch.bind(this)}
            exportData={this.exportData.bind(this)}
            handleChange={this.handleChange.bind(this)}
            pdCategories={pdCategories}
            dispatch={this.props.dispatch}/>
          <Qtable
            columns={role=='3'?columnsClerk:columns}
            dataSource={pdSpus}/>
          {
            pdSpus.length>0&&
            <Qpagination
              sizeOptions="1"
              onShowSizeChange={this.changePageSize.bind(this)}
              onChange={this.changePage.bind(this)}
              data={data}/>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
    const {pdSpus,pdCategories,data} = state.goods;
    return {pdSpus,pdCategories,data};
}

export default connect(mapStateToProps)(Goods);
