import { Upload, Button, Icon,message} from 'antd';
import "./gooddb.css"
import {LocalizedModal,Buttonico} from '../../components/Button/Button';

class MyUpload extends React.Component {
    state = {
      fileList: [],
    }
    beforeUpload(file) {
      const isSize = file.size / 1024 / 1024 < 1;
      let fileName = file.name;
      let fileType = fileName.split('.')[1];
      if(fileType!='xls'&&fileType!='xlsx') {
        message.error('请选择Excel文件');
        return false;
      }else {
        if (!isSize) {
          message.error('导入文件不得大于1M');
          return false;
        }
      }
    }
    handleChange = (info) => {
      var fileList = info.fileList;
      fileList = fileList.slice(-1);
      fileList = fileList.filter((file) => {
        if (file.response) {
          this.props.setLoding(1)
          if(file.response.code=='0'){
            //得到数据，把数据抛出
            const data=file.response.pdSpu
            const total=data.length
            this.props.Setdate(data,total);
            this.props.setLoding(0)
          }else{
            this.props.setLoding(0)
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
            name:'mfile',
            beforeUpload:this.beforeUpload
        };
        return (
            <Upload {...props} fileList={this.state.fileList}>
              <Buttonico text='导入调拨商品'/>
            </Upload>
      );
    }
  }

  export default MyUpload;
