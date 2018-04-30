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
			showSMA: false,
			showEMA: false,
			showVolumn: true,
			mainLineType: "candlestick",
			rangeSMA: 5,
			sourceSMA: "close",
			rangeEMA: 5,
			sourceEMA: "close"
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
	handleLine = () => {
		let inputrangeSMA = this.refs.range_SMA,
			inputsourceSMA = this.refs.source_SMA,
			inputrangeEMA = this.refs.range_EMA,
			inputsourceEMA = this.refs.source_EMA;
		this.setState({
			rangeSMA: inputrangeSMA.value || 5,
			sourceSMA: inputsourceSMA.value || "close",
			rangeEMA: inputrangeEMA.value || 5,
			sourceEMA: inputsourceEMA.value || "close"
		}) 
		
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

	handleShowVolumn = () => {
		let newShowVolumn = !this.state.showVolumn;
		this.setState({
			showVolumn: newShowVolumn
		});
	}

	handleMainLineType = (type) => {
		this.setState({
			mainLineType: type
		});
	}


	render() {
		const {data, currentdata, zoom, showSMA, showEMA, showVolumn, mainLineType, rangeSMA, sourceSMA, rangeEMA, sourceEMA} = this.state;
		let date;
		let format = d3.timeFormat("%Y %b %d %H:%M");
		let linePara = {
			"rangeSMA": rangeSMA,
			"sourceSMA": sourceSMA,
			"rangeEMA": rangeEMA,
			"sourceEMA": sourceEMA
		}
		let settings = {
			"showSMA": showSMA,
			"showEMA": showEMA,
			"showVolumn": showVolumn,
			"mainLineType": mainLineType,
			"linePara": linePara			
		}
		date = currentdata ? format(new Date(Date.parse(currentdata.date))) : null;

		return (
			<div className="App">
				{/*<p style={{display : 'flex', flexDirection : 'column'}}>
					{data.map((x, i) => {
						return <span key={i}>{x.date + ' ['+ x.open + ', ' + x.close + ', ' + x.high + ', ' + x.low + "] "}</span>;
					})}
				</p>*/}
				<div style={{display: "flex", flexDirection: "row"}}>
					<button className="change-button" onClick={this.handleClick1}>Data 1 (Daily)</button>
					<button className="change-button" onClick={this.handleClick2}>Data 2 (Hourly)</button>
					<input
						name="showSMA"
						type="checkbox"
						checked={showVolumn}
						onChange={this.handleShowVolumn} />
					<span style={{color: "white", fontSize: 12}}>Volumn</span>
					<input
						name="showSMA"
						type="checkbox"
						checked={showSMA}
						onChange={this.handleShowSMA} />
					<span style={{color: "white", fontSize: 12}}>SMA</span>
					<ul className="line-settings">
						<li>
							<span>range</span>
							<input
								ref="range_SMA"
								placeholder={rangeSMA}
								style={{width: 50, marginLeft: 5}}/>
						</li>
						<li>
							<span>source</span>
							<input
								ref="source_SMA"
								placeholder={sourceSMA}
								style={{width: 50, marginLeft: 5}}/>
						</li>
					</ul>
					<input
						name="showEMA"
						type="checkbox"
						checked={showEMA}
						onChange={this.handleShowEMA} />
					<span style={{color: "white", fontSize: 12}}>EMA</span>
					<ul className="line-settings">
						<li>
							<span>range</span>
							<input
								ref="range_EMA"
								placeholder={rangeEMA}
								style={{width: 50, marginLeft: 5}}/>
						</li>
						<li>
							<span>source</span>
							<input
								ref="source_EMA"
								placeholder={sourceEMA}
								style={{width: 50, marginLeft: 5}}/>
						</li>
					</ul>
					<button className="change-button" onClick={this.handleLine}>Update Lines</button>
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
					{/*
					<span style={{color: "white", fontSize: 12, marginLeft: 10}}>Comparison:</span>
					<input
						name="comparisonType"
						type="checkbox"
						 />
					<span style={{color: "white", fontSize: 12}}>Percentage</span>
					<input
						name="comparisonType"
						type="checkbox"
						 />
					<span style={{color: "white", fontSize: 12}}>Value</span>
					*/}
				</div>
				<div className="d3chart-container">
					<D3chart data={data} pickedDatum={this.pickedDatum} zoomState={zoom} settings={settings} mcbasedata={mockdata2}/>
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
