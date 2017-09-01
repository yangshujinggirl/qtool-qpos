import {message,Button, notification} from 'antd';
import ReactDOM from 'react-dom';


const btn = (
    	<div style={{width:'300px',height:'40px',lineHeight:'40px',textAlign:'center'}}>确认</div>

)
export function Messagesuccess(values,time,call) {
   message.success(values,time,call);
}

export function openNotificationWithIcon(type){
  notification[type]({
    message: 'Notification Title',
    description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    btn,
    placement:'topLeft',
    duration:null,
    style: {
     width: 300
    },
  });
};



