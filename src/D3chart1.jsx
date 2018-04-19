import React from "react";
import * as d3 from "d3";

let margin;
let colorIncrease = "#88D040",
	colorDecrease = "#D63030";
let width = 960,
	height = 500,
	rectWidth = 5;




let drawMainChart = props => {
    const data = props.data;
    
    margin = {top: 20, right: 20, bottom: 30, left: 50};
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    let xScale = d3.scaleTime(),
        yScale = d3.scaleLinear();

    let xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5);

    let yAxis = d3.axisLeft()
        .scale(yScale)

    let series = candleStick()
        .xScale(xScale)
        .yScale(yScale);

    let svg = d3.select('#chart').classed({'chart': true}).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    let g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let plotArea = g.append('g');
    plotArea.append('clipPath')
        .attr('id', 'plotAreaClip')
        .append('rect')
        .attr({ width: width, height: height });
    plotArea.attr('clip-path', 'url(#plotAreaClip)');

    let maxDate = d3.max(data, d => {
        return d.date;
    });
    let mD = new Date(maxDate)
    xScale.domain([
        new Date(mD.getTime() - (8.64e7 * 31.5)),
        new Date(mD.getTime() + 8.64e7)
    ]);

    yScale.domain(
        [
            d3.min(data, d => {
                return d.low;
            }),
            d3.max(data, d => {
                return d.high;
            })
        ]
    ).nice();

    xScale.range([0, width]);
    yScale.range([height, 0]);

    // Draw axes
    g.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    g.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    // Draw series.
    plotArea.append('g')
        .attr('class', 'series')
        .datum(data)
        .call(series);
	/*
	let maxValue = d3.max([
		d3.max(data, d => {
			return d.open;
		}),
		d3.max(data, d => {
			return d.close;
		}),
		d3.max(data, d => {
			return d.high;
		})
	]);
	console.log(maxValue);

	margin = {top: 40, right: 10, bottom: 20, left: 10};
	width = width - margin.left - margin.right;
	height = height - margin.top - margin.bottom;
	chart = d3
		.select("#chart_container")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	x = d3.scaleBand()
		.rangeRound([0, width])
        .padding(0.1);
    x.domain(
        data.map(d => {
            console.log(d.name)
            return d.name;
        })
    )
	y = d3.scaleLinear()
        .range([height, 0]);
    y.domain(0, maxValue)

	xAxis = d3.axisBottom().scale(x);
	yAxis = d3.axisLeft().scale(y);
	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    
    */
};

export default class D3chart extends React.Component {
	componentDidMount() {
		drawMainChart(this.props);
	}

	shouldComponentUpdate(nextProps) {
		if (nextProps.data) {
			console.log("update data");
			console.log(nextProps.data);
			//updateMainChart(nextProps);
		}
		return false;
	}
	render() {
		return <div id="chart" />;
	}
}


/*
    let candleStick = () => {
        let line, hlLines, paths, rect, rects, cS;
        let xScale, yScale;
        let ohlc;
        let isUpday, isDownday;

        xScale = d3.scaleTime();
        yScale = d3.scaleLinear();

        isUpday = d => {
            return d.close > d.open;
        };
        isDownday = d => {
            return d.open > d.close;
        };

        line = d3
            .line()
            .x(d => {
                return d.x;
            })
            .y(d => {
                return d.y;
            });

        hlLines = bars => {
            paths = bars.selectAll(".high-low-line").data(d => {
                return [d];
            });
            paths.enter().append("path");
            paths.classed({"high-low-line": true}).attr("d", d => {
                return line([{x: xScale(d.date), y: yScale(d.high)}, {x: xScale(d.date), y: yScale(d.low)}]);
            });
        };

        rects = bars => {
            rect = bars.selectAll("rect").data(d => {
                return [d];
            });
            rect.enter().append("rect");
            rect.attr('x', d => {
                return xScale(d.date) - rectWidth;
            })
                .attr('y',d => {
                    return isUpday(d) ? yScale(d.close) : yScale(d.open);
                })
                .attr('width', rectWidth * 2)
                .attr('height',d => {
                    return isUpday(d) ?
                        yScale(d.open) - yScale(d.close) :
                        yScale(d.close) - yScale(d.open);
                });
        };
        
        cS = selection => {
            let series, bars;
            selection.each(function(data) {
                series = d3.select(this).selectAll('.candlestick-series').data([data]);
                series.enter().append('g')
                        .classed({'candlestick-series': true});

                bars = series.selectAll('.bar')
                    .data(data, function (d) {
                        return d.date;
                    });

                bars.enter()
                    .append('g')
                    .classed({'bar': true});

                bars.classed({
                    'up-day': isUpday,
                    'down-day': isDownday
                });

                hlLines(bars);
                rects(bars);

                bars.exit().remove();
            });
        }
        cS.xScale = value => {
            if(!arguments.length) {
                return xScale;
            }
            xScale = value;
            return cS;
        }
        cS.yScale = value => {
            if(!arguments.length) {
                return yScale;
            }
            yScale = value;
            return cS;
        }
        cS.rectWidth = value => {
            if(!arguments.length) {
                return rectWidth;
            }
            rectWidth = value;
            return cS;
        }

        return cS;
    };
*/