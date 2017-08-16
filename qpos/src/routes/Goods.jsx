import React from 'react';
import { connect } from 'dva';
import Header from '../components/header/Header';

function Goods({data}) {
  return (
    <div>
       <Header type={false} data={data} color={true}/>
       <p>Goods</p>
    </div>
  );
}

function mapStateToProps(state) {
 	const {data}=state.header
  	return {data};
}

export default connect(mapStateToProps)(Goods);
