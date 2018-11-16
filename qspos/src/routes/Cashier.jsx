import React from 'react';
import Cashierindex from '../constants/cashier/index';


class Cashier extends React.Component {
    render() {
        return(
            <Cashierindex {...this.props}/>
        )
    }
}
export default Cashier;
