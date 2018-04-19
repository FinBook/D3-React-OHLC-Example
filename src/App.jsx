import React, {Component} from "react";
import * as d3 from "d3";
import D3chart from "./D3chart";

import logo from "./logo.svg";
import "./App.css";
import mockdata from "./d3Related/MockData.json";
import mockdata1 from "./d3Related/MockData1.json";
import mockdata2 from "./d3Related/MockData2.json";

const data1 = [
	{date: "2014-06-30T16:00:00.000Z", open: 4, close: 8},
	{date: "2014-07-01T16:00:00.000Z", open: 8, close: 15},
	{date: "2014-07-02T16:00:00.000Z", open: 15, close: 16},
	{date: "2014-07-03T16:00:00.000Z", open: 16, close: 10}
];
const data2 = [
	{date: "2014-06-30T16:00:00.000Z", open: 35, close: 3},
	{date: "2014-07-01T16:00:00.000Z", open: 3, close: 65},
	{date: "2014-07-02T16:00:00.000Z", open: 65, close: 42},
	{date: "2014-07-03T16:00:00.000Z", open: 42, close: 14},
	{date: "2014-07-04T16:00:00.000Z", open: 14, close: 82},
	{date: "2014-07-05T16:00:00.000Z", open: 82, close: 38},
	{date: "2014-07-06T16:00:00.000Z", open: 38, close: 88}
];
const data3 = [
	{date: "2014-06-30T16:00:00.000Z", open: 14, close: 42},
	{date: "2014-07-01T16:00:00.000Z", open: 42, close: 33},
	{date: "2014-07-02T16:00:00.000Z", open: 33, close: 61},
	{date: "2014-07-03T16:00:00.000Z", open: 61, close: 29},
	{date: "2014-07-04T16:00:00.000Z", open: 29, close: 4},
	{date: "2014-07-05T16:00:00.000Z", open: 4, close: 18}
];
const data4 = [
	{date: "2014-06-30T16:00:00.000Z", open: 4, close: 52},
	{date: "2014-07-01T16:00:00.000Z", open: 52, close: 12},
	{date: "2014-07-02T16:00:00.000Z", open: 12, close: 38},
	{date: "2014-07-03T16:00:00.000Z", open: 38, close: 22},
	{date: "2014-07-04T16:00:00.000Z", open: 22, close: 30}
];

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
		let {x, data} = this.state;
		if (x != 2) x++;
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
			case 2:
				newData = mockdata2;
				break;
		}
		this.setState({
			x: x,
			data: newData
		});
	};

	pickedDatum = d => {
		this.setState({
			currentdata: d
		});
	};

	render() {
		const {x, data, currentdata} = this.state;
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
