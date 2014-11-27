
var Devices = React.createClass({
	getInitialState: function () {
		return {
			devices : []
		};
	},
	componentDidMount :   function () {
		var self = this;
		Window.socket.emit('app:getDeviceList', {});
		Window.socket.on('app:deviceList', function (data) {
			console.log(data);
				self.setState({ devices : data.devices});
		});
	},

	render: function() {
		var  items = []
		_.each( this.state.devices , function (obj ,i ) {
			items[i] = (	<li>{obj}</li>);
		});
		return (<div className="Devices">
					<ul>
					{items}
						</ul>
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
		var self = this;

		Window.socket.on('app:getResult', {});
		Window.socket.on('app:result', function (data) {
			 console.log(data);
			self.setState({ ranking : data.result});
		});

	},
	render: function() {
		var  items = []
		if(this.state.ranking.length>0)
			this.state.ranking[this.state.ranking.length-1].last = true ;
		var r  = this.state.ranking;
		_.sortBy(r,function(n){ return n.result; });

		_.each( r , function (obj ,i ) {
			items[i] = (	<li  className={obj.last ? 'Last':  'new'}>
								<div class="bloder"> {obj.name}</div>
								<div>{obj.result}</div>
							</li>);
		});
		return (<div className="Ranking"><ul>{items}</ul> </div>);
	}
});

var Start = React.createClass({
	getInitialState: function () {
		return {
			name : '',
			time : 3000,
			state: 0,
			timer : 0,
			currentResult : 0
		};
	},
	componentDidMount :   function () {
		var self = this;
		Window.socket.on('app:ping', function (data) {
			self.setState({ currentResult : data});
		});
	},

	start  :   function ()  {
		this.state.timer= this.state.time;
		this.setState({state: 1 } );
		if(this.state.state!= 1){
			Window.socket.emit('app:start', { name: this.state.name} );
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
		var result =  [className2, 'Curren'].join(" ");
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
			    <div className={result}>  {this.state.currentResult} </div>
		</div>);
	}
});

var App = React.createClass({
	 componentDidMount :   function () {

	 },
		render: function() {
			return (<div>
					 <Devices/>
						<Start />
						<Ranking/>
					</div>
			);
		}
});

React.render(<App/>,
		document.getElementById('app')
);



