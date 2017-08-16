import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';

function Receivegoods({data}) {
  return (
    <div>
    	<Header type={false} data={data} color={true}/>
      Route Component: Receivegoods
    </div>
  );
}

function mapStateToProps(state) {
   console.log(state)
  const {data}=state.header
  return {data};	
}

export default connect(mapStateToProps)(Receivegoods);
