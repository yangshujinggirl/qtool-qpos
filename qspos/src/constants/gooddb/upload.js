import { Upload, Button, Icon,message} from 'antd';
import "./gooddb.css"
import {LocalizedModal,Buttonico} from '../../components/Button/Button';

class MyUpload extends React.Component {
    state = {
      fileList: [],
    }
    handleChange = (info) => {
        var fileList = info.fileList;
        fileList = fileList.slice(-1);
        fileList = fileList.filter((file) => {
            if (file.response) {
                if(file.response.code=='0'){
                    //得到数据，把数据抛出
                    const data=file.response.pdSpu
                    const total=data.length
                    this.props.Setdate(data,total)
                }else{
                    fileList=[]
                    message.error(file.response.message);
                }
                return file.response.status === 'success';
            }
            return true;
        });
        this.setState({ fileList });
    }
    render() {
        const props = {
            action: '/erpQposRest/qposrest.htm?code=qerp.pos.sp.order.import',
            onChange: this.handleChange,
            multiple: false,
            showUploadList:false,
            name:'mfile'
        };
        return (
            <Upload {...props} fileList={this.state.fileList}>
              <Buttonico text='导入调拨商品'/>
            </Upload>
      );
    }
  }

  export default MyUpload;
