import React from 'react';
import { connect } from 'dva';


function Inventory() {
  return (
    <div>
      Route Component: Inventory
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Inventory);
