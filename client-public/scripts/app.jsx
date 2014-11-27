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
		Window.socket.emit('getDeviceList', {});
		Window.socket.on('deviceList', function (data) {
			alert(1);
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
	getInitialState: function () {
		return {
			ranking : []
		};
	},
	componentDidMount :   function () {
		Window.socket.on('result', function (data) {
			this.setState({ ranking : data});
		});
	},
	render: function() {
		var  items = []
		_.each( this.state.ranking , function (obj ,i ) {
			items[i] = (	<li>
								<div class="bloder"> {obj.name}</div>
								<div>{obj.result}</div>
							</li>);
		});
		return (<div className="Ranking">{items} </div>);
	}
});

var Start = React.createClass({
	getInitialState: function () {
		return {
			name : '',
			time : 3000,
			state: 0,
			timer : 0
		};
	},
	start  :   function ()  {
		this.state.timer= this.state.time;
		this.setState({state: 1 } );
		if(this.state.state!= 1){
			Window.socket.emit('app:start', {name: this.props.name} );
			this.updateTime();
		}
	},
	handleTime :  function (e)  {
		this.setState({time: e.target.value});
	},
	handleName  :   function (e)  {
		this.setState({name: e.target.value});
	},
	updateTime : function ()  {
		console.log(1);
		this.setState({timer : (this.state.timer -1)})
		if (this.state.timer <= 0) {
			this.stopT();
		}else{
			window.setTimeout(this.updateTime,  1);
		}
	},
	stopT  : function  ()  {
			Window.socket.emit('app:stop',{});
			this.setState({state:0});
	},
	render: function() {

		var className  = this.state.state === 0 ? 'visible' :'hidden ';
		var className2  = this.state.state !== 0 ? 'visible' :'hidden ';
		var btnClass =  [className, 'btn'].join(" ");
		var formClass =  [className, 'form'].join(" ");
		var timerClassName =  [className2, 'timer'].join(" ");
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
				<div className={timerClassName}>  {this.state.timer} </div>
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



