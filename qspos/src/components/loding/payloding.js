import styles from '../../routes/Pay.css';
class AntIcon extends React.Component{
    render(){
       return (
            <div className='lodimgbox-all'>
                <div className='lodimgbox'>
                    <img src={require('../../images/icon_loding_w.png')} className='w100 h100'/>
                </div>
                <div className='lodimgbox-center'>
                    <img src={require('../../images/icon_loding.png')} className='w100 h100'/>
                </div>
            </div>
      )
    }
 }
 export default AntIcon;
