import React, {Component} from "react";
import * as d3 from "d3";
import D3chart from "./D3chart";

import "./App.css";
import mockdata from "./d3Related/MockData.json";
import mockdata1 from "./d3Related/MockData1.json";
import mockdata2 from "./d3Related/MockData2.json";

class App extends Component {
	constructor(props) {
		super(props);
		this.pickedDatum = this.pickedDatum.bind(this);
		this.state = {
			//zoom 0:day, 1:hour, 2:5min
			zoom: 0,
			data: mockdata,
			currentdata: null,
			showSMA: true,
			showEMA: true,
			mainLineType: "candlestick"
		};
	}

	handleClick1 = () => {
		this.setState({
			zoom: 0,
			data: mockdata,
			currentdata: null
		});
	};
	handleClick2 = () => {
		this.setState({
			zoom: 1,
			data: mockdata1,
			currentdata: null
		});
	};
	handleClick3 = () => {
		this.setState({
			zoom: 2,
			data: mockdata2,
			currentdata: null
		});
	};

	pickedDatum = d => {
		this.setState({
			currentdata: d
		});
	};

	handleShowSMA = () => {
		let newShowSMA = !this.state.showSMA;
		this.setState({
			showSMA: newShowSMA
		});
	}

	handleShowEMA = () => {
		let newShowEMA = !this.state.showEMA;
		this.setState({
			showEMA: newShowEMA
		});
	}

	handleMainLineType = (type) => {
		this.setState({
			mainLineType: type
		});
	}


	render() {
		const {data, currentdata, zoom, showSMA, showEMA, mainLineType} = this.state;
		let date;
		let format = d3.timeFormat("%Y %b %d %H:%M");
		let settings = {
			"showSMA": showSMA,
			"showEMA": showEMA,
			"mainLineType": mainLineType
		}
		date = currentdata ? format(new Date(Date.parse(currentdata.date))) : null;

		return (
			<div className="App">
				{/*<p style={{display : 'flex', flexDirection : 'column'}}>
					{data.map((x, i) => {
						return <span key={i}>{x.date + ' ['+ x.open + ', ' + x.close + ', ' + x.high + ', ' + x.low + "] "}</span>;
					})}
				</p>*/}
				<div>
					<button className="change-button" onClick={this.handleClick1}>Data 1 (Daily)</button>
					<button className="change-button" onClick={this.handleClick2}>Data 2 (Hourly)</button>
					<input
						name="showSMA"
						type="checkbox"
						checked={showSMA}
						onChange={this.handleShowSMA} />
					<span style={{color: "white", fontSize: 12}}>SMA</span>
					<input
						name="showEMA"
						type="checkbox"
						checked={showEMA}
						onChange={this.handleShowEMA} />
					<span style={{color: "white", fontSize: 12}}>EMA</span>
					<span style={{color: "white", fontSize: 12, marginLeft: 10}}>Graph Type:</span>
					<input
						name="mainLineType"
						type="checkbox"
						checked={mainLineType === "candlestick"}
						onChange={() => this.handleMainLineType("candlestick")} />
					<span style={{color: "white", fontSize: 12}}>Candlestick</span>
					<input
						name="mainLineType"
						type="checkbox"
						checked={mainLineType === "mountain"}
						onChange={() => this.handleMainLineType("mountain")} />
					<span style={{color: "white", fontSize: 12}}>Mountain</span>
				</div>
				<div className="d3chart-container">
					<D3chart data={data} pickedDatum={this.pickedDatum} zoomState={zoom} settings={settings} />
				</div>
				<div style={{position: "absolute", top: "560px", left: "20px", color:"white"}}>
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
