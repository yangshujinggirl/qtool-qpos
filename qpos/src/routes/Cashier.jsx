import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';

function Cashier({data}) {
  return (
    <div>
     <Header type={true} data={data} color={true}/>
    </div> 
  );
}

function mapStateToProps(state) {
	console.log(state)
	 const { data } = state.header;
  	return { data };
}

export default connect(mapStateToProps)(Cashier);













