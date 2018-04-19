import React, {Component} from "react";
import * as d3 from "d3";
import D3chart from "./D3chart";

import logo from "./logo.svg";
import "./App.css";
import mockdata from "./d3Related/MockData.json";
import mockdata1 from "./d3Related/MockData1.json";
import mockdata2 from "./d3Related/MockData2.json";

class App extends Component {
	constructor(props) {
		super(props);
		this.pickedDatum = this.pickedDatum.bind(this);
		this.state = {
			x: 0,
			data: mockdata,
			currentdata: null
		};
	}

	handleClick = () => {
		let {x} = this.state;
		if (x !== 2) x++;
		else x = 0;
		let newData;
		let index = x;
		switch (index) {
			case 0:
				newData = mockdata;
				break;
			case 1:
				newData = mockdata1;
				break;
			default:
				newData = mockdata2;
				break;
		}
		this.setState({
			x: x,
			data: newData,
			currentdata: null
		});
	};

	pickedDatum = d => {
		this.setState({
			currentdata: d
		});
	};

	render() {
		const {data, currentdata} = this.state;
		let date;
		let format = d3.timeFormat("%b %d");
		date = currentdata ? format(new Date(Date.parse(currentdata.date))) : null;

		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				{/*<p style={{display : 'flex', flexDirection : 'column'}}>
					{data.map((x, i) => {
						return <span key={i}>{x.date + ' ['+ x.open + ', ' + x.close + ', ' + x.high + ', ' + x.low + "] "}</span>;
					})}
				</p>*/}
				<button onClick={this.handleClick}>Change Data</button>
				<div className="d3chart-container">
					<D3chart data={data} pickedDatum={this.pickedDatum} />
				</div>
				<div style={{position: "absolute", top: "730px", left: "200px"}}>
					<span>Current Datum: </span>
					<span>
						{currentdata
							? date +
							  " O:" +
							  currentdata.open.toFixed(2) +
							  " H:" +
							  currentdata.high.toFixed(2) +
							  " L:" +
							  currentdata.low.toFixed(2) +
							  " C:" +
							  currentdata.close.toFixed(2)
							: "No datum picked"}
					</span>
				</div>
			</div>
		);
	}
}

export default App;
