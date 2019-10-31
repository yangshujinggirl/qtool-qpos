
import Memberinfoindex from '../constants/member/info/index'
import { Spin} from 'antd';
import { connect } from 'dva';

class Memberinfo extends React.Component{
   render(){
      return (
        <div className="common-pages-wrap">
            <Spin tip='加载中，请稍后...'  spinning={this.props.spinLoad.loading}>
              <Memberinfoindex {...this.props}/>
            </Spin>
        </div>
     )
   }
}
function mapStateToProps(state){
  const { spinLoad } = state;
  return { spinLoad };
}
export default connect(mapStateToProps)(Memberinfo)
