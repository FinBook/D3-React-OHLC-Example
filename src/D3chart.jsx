import React from "react";
import * as d3 from "d3";
import moment from "moment";

let Coinname = "Ethereum(ETH)";

//let chartLeftOffset = 0,
let	chartTopOffset = 60;
let colorIncreaseFill = "rgba(94,137,50,1)",
	colorDecreaseFill = "rgba(140,41,41,1)",
	colorIncreaseStroke = "rgba(136,208,64,1)",
	colorDecreaseStroke = "rgba(214,48,48,1)",
	colorIncreaseFillV = "rgba(56,82,30,0.4)",
	colorDecreaseFillV = "rgba(84,25,25,0.4)",
	colorIncreaseStrokeV = "rgba(104,157,50,0.4)",
	colorDecreaseStrokeV = "rgba(161,39,39,0.4)";
let margin = {top: 40, right: 60, bottom: 30, left: 60};
let width = 1060 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom,
	rectWidth = 11,
	backrectWidth;
let xAxistipWidth = 40;
let chart, chartdata, bars;

let drawMainChart = props => {
	const {data, pickedDatum} = props;
	let x, y, vy, new_x;
	let xAxis, yAxis, yAxisV, xGrid, yGrid;

	let maxDate = d3.max(data, d => {
		return d.date;
	});
	/*
	let minDate = d3.min(data, d => {
		return d.date;
	});
	*/
	let extentStart = new Date(Date.parse(maxDate) - 8.64e7 * 150);
	let extentEnd = new Date(Date.parse(maxDate) + 8.64e7 * 10);

	let start = new Date(Date.parse(maxDate) - 8.64e7 * 30);
	let end = new Date(Date.parse(maxDate) + 8.64e7 * 2);
	let xExtent = d3.extent([extentStart, extentEnd]);

	let isUpday = d => {
		return d.close > d.open;
	};

	let line = d3
		.line()
		.x(d => {
			return d.x;
		})
		.y(d => {
			return d.y;
		});

	let showColumndata = d => {
		infoBar.html(
			Coinname +
				" O: <div class = '" +
				(isUpday(d) ? "upday-column" : "downday-column") +
				" info-column'>" +
				d.open.toFixed(2) +
				"</div> H: <div class = '" +
				(isUpday(d) ? "upday-column" : "downday-column") +
				" info-column'>" +
				d.high.toFixed(2) +
				"</div> L: <div class = '" +
				(isUpday(d) ? "upday-column" : "downday-column") +
				" info-column'>" +
				d.low.toFixed(2) +
				"</div> C: <div class = '" +
				(isUpday(d) ? "upday-column" : "downday-column") +
				" info-column'>" +
				d.close.toFixed(2) +
				"</div> V: " + 
				d.volumn.toFixed(0)
		);
	};
	/*
	let showTooltip = d => {
		tooltip
			.transition()
			.duration(100)
			.style("opacity", 1)
			.style("z-index", 9);
		tooltip
			.html(
				"O: " +
					d.open.toFixed(2) +
					"<br/>H: " +
					d.high.toFixed(2) +
					"<br/>L: " +
					d.low.toFixed(2) +
					"<br/>C: " +
					d.close.toFixed(2)
			)
			.style("left", d3.event.pageX - 15 - chartLeftOffset + "px")
			.style("top", d3.event.pageY - 70 - chartTopOffset + "px");
	};
	*/
	let showXAxisTip = d => {
		let xValue;
		let format = d3.timeFormat("%b %d");
		xValue = format(new Date(Date.parse(d.date)));
		xAxistip.style("opacity", 1).style("z-index", 8);
		xAxistip
			.html(xValue)
			.style("left", new_x(new Date(Date.parse(d.date))) + margin.left - xAxistipWidth / 2 - 2 + "px")
			.style("top", height + margin.top + 2 + "px");
	};

	let showYAxisTip = () => {
		let yValue;
		yValue = y.invert(d3.event.clientY - chartTopOffset - margin.top).toFixed(2);
		yAxistip.style("opacity", 1).style("z-index", 8);
		yAxistip
			.html(yValue)
			.style("left", margin.left - 40 + "px")
			.style("top", d3.event.clientY - chartTopOffset - 9.5 + "px");
	};

	let showYAxisTipV = () => {
		let yValueV;
		yValueV = vy.invert(d3.event.clientY - chartTopOffset - margin.top).toFixed(0);
		yAxistipV.style("opacity", 1).style("z-index", 8);
		yAxistipV
			.html(yValueV)
			.style("left", width + margin.left + 4 + "px")
			.style("top", d3.event.clientY - chartTopOffset - 9.5 + "px");
	}
	/*
	let hideTooltip = () => {
		tooltip
			.transition()
			.duration(100)
			.style("opacity", 0)
			.style("z-index", -1);
	};
	*/
	let hideXAxisTip = () => {
		xAxistip.style("opacity", 0).style("z-index", -1);
	};

	let hideYAxisTip = () => {
		yAxistip.style("opacity", 0).style("z-index", -1);
	};

	let hideYAxisTipV = () => {
		yAxistipV.style("opacity", 0).style("z-index", -1);
	}
	//Scales
	x = d3
		.scaleTime()
		.domain([start, end])
		.range([0, width /*(rectWidth + 20) * (data.length + 1)*/]);
	
	//showing range
	let showedData = data.filter((d, i) => {
		return i > data.length - 32
	})
	let yMin = d3.min(
			showedData.map(d => {
				return d.low;
			})),
		yMax = d3.max(
			showedData.map(d => {
				return d.high;
			})),
		yRange = yMax - yMin;
	
	let v_yMax = d3.max(
			showedData.map(d => {
				return d.volumn;
			}));

	y = d3
		.scaleLinear()
		.domain([
			(yMin - 0.7 * yRange) > 0? yMin - 0.7 * yRange : 0
			,
			yMax + 0.2 * yRange
		])
		.range([height, 0]);
	
	vy = d3 
		.scaleLinear()
		.domain([0, 3 * v_yMax])
		.range([height, 0])
	
	new_x = x;
	xAxis = d3
		.axisBottom()
		.scale(x)
		.ticks(8)
		.tickFormat(d3.timeFormat("%b %d"));
	yAxis = d3
		.axisLeft()
		.scale(y)
		.ticks(10);

	yAxisV = d3
		.axisRight()
		.scale(vy)
		.ticks(10);
	
	xGrid = d3
		.axisBottom()
		.scale(x)
		.ticks(8)
		.tickSize(-height)
		.tickFormat("");

	yGrid = d3
		.axisLeft()
		.scale(y)
		.ticks(10)
		.tickSize(-width)
		.tickFormat("");
	//Zoom
	let zoom = d3
		.zoom()
		.scaleExtent([0.5, 5])
		.translateExtent([[x(new Date(xExtent[0])), -Infinity], [x(new Date(xExtent[1])), Infinity]])
		.on("zoom", zoomed);

	rectWidth = (x(new Date("2000-01-02")) - x(new Date("2000-01-01"))) * 0.8 - 1;
	backrectWidth = (x(new Date("2000-01-02")) - x(new Date("2000-01-01"))) * 1 + 2;

	d3.selectAll("g").remove();
	d3.selectAll("rect").remove();
	d3.selectAll("text").remove();
	d3.selectAll("line").remove();
	d3.selectAll(".tooltip").remove();
	d3.selectAll(".x-axis-tip").remove();
	d3.selectAll(".y-axis-tip").remove();
	d3.selectAll(".y-axis-tip-v").remove();
	d3.selectAll(".track-line").remove();
	d3.selectAll(".info-bar").remove();
	d3.selectAll(".info-column").remove();
	//Info-bar div
	let infoBar = d3
		.select("#trade-chart")
		.append("div")
		.attr("class", "info-bar")
		.html(Coinname);
	
	/*
	//Tooltip div
	let tooltip = d3
		.select("#trade-chart")
		.append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);
	*/

	//Axis tip div
	let xAxistip = d3
		.select("#trade-chart")
		.append("div")
		.attr("class", "x-axis-tip")
		.style("opacity", 0);
	let yAxistip = d3
		.select("#trade-chart")
		.append("div")
		.attr("class", "y-axis-tip")
		.style("opacity", 0);
	let yAxistipV = d3
		.select("#trade-chart")
		.append("div")
		.attr("class", "y-axis-tip-v")
		.style("opacity", 0);
	//Mouse track grid line
	let yLine = d3
		.select("#trade-chart")
		.append("div")
		.attr("class", "track-line")
		.style("opacity", 0);

	//Chart

	chart = d3
		.select("#chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.on("mousemove", d => {
			yLine
				.style("z-index", 0)
				.style("opacity", 1)
				.style("left", margin.left + 1 + "px")
				.style("top", d3.event.clientY - chartTopOffset - 0.5 + "px");
			showYAxisTip();
			showYAxisTipV();
		})
		.on("mouseout", d => {
			yLine.style("opacity", 0).style("z-index", -1);
			hideYAxisTip();
			hideYAxisTipV();
		});

	//Chart Grid
	let gridX = chart
		.append("g")
		.attr("class", "grid")
		.attr("transform", "translate(0," + height + ")")
		.call(xGrid);
	let gridY = chart
		.append("g")
		.attr("class", "grid")
		.call(yGrid);
	//Chart Axis
	let gX = chart
		.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
	gX.selectAll("text").style("text-anchor", "middle");

	chart
		.append("g")
		.attr("class", "y-axis")
		.call(yAxis);

	chart
		.append("g")
		.attr("class", "y-axis-v")
		.attr("transform", "translate(" + width + ", 0)")
		.call(yAxisV)
		.selectAll("text").style("text-anchor", "start");
	//Chart Data
	chart
		.append("defs")
		.append("clipPath")
		.attr("id", "clip")
		.append("rect")
		.attr("x", 1)
		.attr("y", 0)
		.attr("width", width - 1)
		.attr("height", height);
	chartdata = chart
		.append("g")
		.attr("class", "chart-data")
		.attr("clip-path", "url(#clip)");
	chartdata
		.selectAll("g")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "single-bar");
	bars = chartdata.selectAll("g");

	bars
		.data(data)
		.exit()
		.remove();
	//Bar Backgrounds
	bars
		.append("rect")
		.attr("class", "bar-background")
		.attr("x", d => {
			return x(new Date(Date.parse(d.date))) - backrectWidth / 2;
		})
		.attr("y", 0)
		.attr("width", backrectWidth)
		.attr("height", height)
		.on("mousemove", d => {
			showColumndata(d);
		})
		.on("mouseover", d => {
			showXAxisTip(d);
		})
		.on("mouseout", d => {
			hideXAxisTip();
		});
	//Rectengle Bars
	bars
		.append("rect")
		.attr("class", "bar-rect")
		.attr("x", d => {
			return x(new Date(Date.parse(d.date))) - rectWidth / 2;
		})
		.attr("y", d => {
			return isUpday(d) ? y(d.close) : y(d.open);
		})
		.attr("width", rectWidth)
		.attr("height", d => {
			return isUpday(d) ? y(d.open) - y(d.close) : y(d.close) - y(d.open);
		})
		.style("fill", d => {
			return isUpday(d) ? colorIncreaseFill : colorDecreaseFill;
		})
		.style("stroke", d => {
			return isUpday(d) ? colorIncreaseStroke : colorDecreaseStroke;
		})
		.on("mousemove", d => {
			showColumndata(d);
		})
		.on("mouseover", d => {
			//showTooltip(d);
			showXAxisTip(d);
		})
		.on("mouseout", d => {
			//hideTooltip();
			hideXAxisTip();
		})
		.on("mousedown", d => {
			pickedDatum(d);
		});
	//High low lines
	bars
		.append("path")
		.attr("class", "bar-line1")
		.attr("d", d => {
			return line([
				{x: x(new Date(Date.parse(d.date))), y: y(d.high)},
				{x: x(new Date(Date.parse(d.date))), y: isUpday(d) ? y(d.close) : y(d.open)}
			]);
		})
		.style("stroke", d => {
			return isUpday(d) ? colorIncreaseStroke : colorDecreaseStroke;
		})
		.on("mousemove", d => {
			showColumndata(d);
		})
		.on("mouseover", d => {
			//showTooltip(d);
			showXAxisTip(d);
		})
		.on("mouseout", d => {
			//hideTooltip();
			hideXAxisTip();
		});
	bars
		.append("path")
		.attr("class", "bar-line2")
		.attr("d", d => {
			return line([
				{x: x(new Date(Date.parse(d.date))), y: y(d.low)},
				{x: x(new Date(Date.parse(d.date))), y: isUpday(d) ? y(d.open) : y(d.close)}
			]);
		})
		.style("stroke", d => {
			return isUpday(d) ? colorIncreaseStroke : colorDecreaseStroke;
		})
		.on("mousemove", d => {
			showColumndata(d);
		})
		.on("mouseover", d => {
			//showTooltip(d);
			showXAxisTip(d);
		})
		.on("mouseout", d => {
			//hideTooltip();
			hideXAxisTip();
		});
	
	//Volumn Bars
	bars
		.append("rect")
		.attr("class", "bar-rect-v")
		.attr("x", d => {
			return x(new Date(Date.parse(d.date))) - rectWidth / 2;
		})
		.attr("y", d => {
			return vy(d.volumn);
		})
		.attr("width", rectWidth)
		.attr("height", d => {
			return height - vy(d.volumn);
		})
		.style("fill", d => {
			return isUpday(d) ? colorIncreaseFillV : colorDecreaseFillV;
		})
		.style("stroke", d => {
			return isUpday(d) ? colorIncreaseStrokeV : colorDecreaseStrokeV
		})
		.on("mousemove", d => {
			showColumndata(d);
		})
		.on("mouseover", d => {
			//showTooltip(d);
			showXAxisTip(d);
		})
		.on("mouseout", d => {
			//hideTooltip();
			hideXAxisTip();
		})
		.on("mousedown", d => {
			pickedDatum(d);
		});

	chart.call(zoom);
	
	//Zoom function
	function zoomed() {
		let transformAxis = d3.event.transform;
		let newExtentEnd;
		let newRangedData;
		new_x = transformAxis.rescaleX(x);

		if(transformAxis.k > 3.5) {
			newExtentEnd = new Date(Date.parse(maxDate) + 8.64e7 * 2.5);
	    } else if(transformAxis.k > 2.5) {
			newExtentEnd = new Date(Date.parse(maxDate) + 8.64e7 * 5);
		} else if(transformAxis.k > 1.5){
			newExtentEnd = new Date(Date.parse(maxDate) + 8.64e7 * 7.5);
		} else {
			newExtentEnd = new Date(Date.parse(maxDate) + 8.64e7 * 10);
		}
		xExtent = d3.extent([extentStart, newExtentEnd])
		zoom.translateExtent([[x(new Date(xExtent[0])), -Infinity], [x(new Date(xExtent[1])), Infinity]])

		gX.call(xAxis.scale(new_x));
		gX.selectAll("text").style("text-anchor", "middle");
		gridX.call(xGrid.scale(new_x));
		newRangedData = data.filter( (d) => {
			return (moment(d.date).isAfter(new_x.invert(-rectWidth)) && moment(d.date).isBefore(new_x.invert(width+rectWidth)))
		})
		let new_y = y;
		let new_vy = vy;
		let new_yMin = d3.min(
				newRangedData.map(d => {
					return d.low;
				})),
			new_yMax = d3.max(
				newRangedData.map(d => {
					return d.high;
				})),
			new_yRange = new_yMax - new_yMin;
		let new_v_yMax = d3.max(
				newRangedData.map(d => {
					return d.volumn;
				})
			);
		new_y.domain([
			(new_yMin - 0.7 * new_yRange) > 0? new_yMin - 0.7 * new_yRange : 0
			,
			new_yMax + 0.2 * new_yRange
		]);
		new_vy.domain([0, 3 * new_v_yMax]);
		gridY.call(yGrid.scale(new_y).ticks(10));
		d3.selectAll(".y-axis").call(d3.axisLeft().scale(new_y).ticks(10));
		d3.selectAll(".y-axis-v").call(d3.axisRight().scale(new_vy).ticks(10));
		d3.selectAll(".y-axis-v").selectAll("text").style("text-anchor", "start");
		rectWidth = (new_x(new Date("2000-01-02")) - new_x(new Date("2000-01-01"))) * 0.8 - 1;
		backrectWidth = (new_x(new Date("2000-01-02")) - new_x(new Date("2000-01-01"))) * 1 + 2;
		d3
			.selectAll(".bar-background")
			.data(data)
			.attr("x", d => {
				return new_x(new Date(Date.parse(d.date))) - backrectWidth / 2;
			})
			.attr("width", backrectWidth);
		d3
			.selectAll(".bar-rect")
			.data(data)
			.attr("x", d => {
				return new_x(new Date(Date.parse(d.date))) - rectWidth / 2;
			})
			.attr("y", d => {
				return isUpday(d) ? new_y(d.close) : new_y(d.open);
			})
			.attr("width", rectWidth)
			.attr("height", d => {
				return isUpday(d) ? new_y(d.open) - new_y(d.close) : new_y(d.close) - new_y(d.open);
			});
		d3
			.selectAll(".bar-line1")
			.data(data)
			.attr("d", d => {
				return line([
					{x: new_x(new Date(Date.parse(d.date))), y: y(d.high)},
					{x: new_x(new Date(Date.parse(d.date))), y: isUpday(d) ? y(d.close) : y(d.open)}
				]);
			});
		d3
			.selectAll(".bar-line2")
			.data(data)
			.attr("d", d => {
				return line([
					{x: new_x(new Date(Date.parse(d.date))), y: y(d.low)},
					{x: new_x(new Date(Date.parse(d.date))), y: isUpday(d) ? y(d.open) : y(d.close)}
				]);
			});
		d3
			.selectAll(".bar-rect-v")
			.data(data)
			.attr("x", d => {
				return new_x(new Date(Date.parse(d.date))) - rectWidth / 2;
			})
			.attr("y", d => {
				return new_vy(d.volumn)
			})
			.attr("width", rectWidth)
			.attr("height", d => {
				return height - new_vy(d.volumn);
			})
	}
};

export default class D3chart extends React.Component {
	componentDidMount() {
		drawMainChart(this.props);
	}

	shouldComponentUpdate(nextProps) {
		console.log("props changed");
		//redraw when data is changed
		if (nextProps.data && JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
			console.log("Redraw chart");
			drawMainChart(nextProps);
			return false;
		}
		console.log("Did not redraw");
		return false;
	}

	render() {
		return (
			<div id="trade-chart">
				<svg id="chart" />
			</div>
		);
	}
}
