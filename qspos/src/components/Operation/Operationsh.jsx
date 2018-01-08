import Operationl from '../../constants/receivegoods/userleft';
import Operationr from '../../constants/receivegoods/userright';

class Operation extends React.Component {
	render() {
		return(
			<div className='count clearfix'>
				<div className='opera'>
      				<div className='operationl fl'>
      					<Operationl/>
      				</div>
      				<div className='operationr fr'>
      					<Operationr 
      						color={this.props.color} 
							  type={this.props.type} 
							  payok={this.props.payok}
      					/>
      				</div>
      			</div>
    		</div>
		)
	}
	
}

export default Operation;