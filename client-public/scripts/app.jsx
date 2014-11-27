var UserForm = React.createClass({
	render: function() {
		return (<div className="User_Form"> </div>);
	}
});

var Devices = React.createClass({
	getInitialState: function () {
		return {
			devices : []
		};
	},
	componentDidMount :   function () {
		Window.socket.on('device_list', function (data) {
			console.log(data);
			this.setState({ devices : data});
		});
	},

	render: function() {
		var  items = []
		_.each( this.state.devices , function (obj ,i ) {
			items[i] = (	<li>{obj}</li>);
		});
		return (<div className="Devices">
					{items}
		      </div>);
	}
});

var Ranking = React.createClass({
	render: function() {
		return (<div className="Ranking"> </div>);
	}
});

var Start = React.createClass({
	getInitialState: function () {
		return {
			name : '',
			time : 3000,
			state: 0
		};
	},
	start  :   function ()  {
		this.setState({state: 1});

		if(this.state.state!= 1){
			Window.socket.emit('app:start', {name: this.props.name} );
		}
	},
	handleTime :  function (e)  {
		this.setState({time: e.target.value});
	},
	handleName  :   function (e)  {
		this.setState({name: e.target.value});
	},
	render: function() {
		var className  = this.state.state === 0 ? 'visible' :'hidden ';
		var btnClass =  [className, 'btn'].join(" ");
		var formClass =  [className, 'form'].join(" ");

		return (<div className="Start">
				<div className={formClass}>
					<label>
					    Name :
						<input type="text" value={this.state.name} onChange={this.handleName}/>
					</label>
					<label>
					   Time :
						<input type="text" value={this.state.time} onChange={this.handleTime}/>
					</label>
					<div  className={btnClass} onClick={this.start}>  Start</div>
				</div>
		</div>);
	}
});

var App = React.createClass({

	 componentDidMount :   function () {
		 Window.socket.emit('app:register');
	 },
		render: function() {
			return (<div>
					 <Devices/>
						<Start />
					</div>
			);
		}
});

React.render(<App/>,
		document.getElementById('app')
);



