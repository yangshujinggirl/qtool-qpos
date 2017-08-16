import React from 'react';
import { connect } from 'dva';


function Returngoods() {
  return (
    <div>
      Route Component: Returngoods
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Returngoods);
