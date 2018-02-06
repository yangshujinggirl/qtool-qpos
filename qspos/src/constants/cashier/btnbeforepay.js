class Btnbrforepay extends React.Component {
	state={}
	render(){
		return(
			<div className={this.props.dis?'payinput-before-dis':'payinput-before'}>
				{this.props.title}
    		</div>
		)
	}
}


export default Btnbrforepay;