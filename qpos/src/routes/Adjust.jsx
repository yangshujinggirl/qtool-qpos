import React from 'react';
import { connect } from 'dva';

function Adjust() {
  return (
    <div>
      Route Component: Adjust
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Adjust);
