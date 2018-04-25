class LineCalculation {

    getSubset = (data, range, i) => {
        let subSet;
        let startIndex = 0;
        if(i < range) subSet = data.slice(startIndex, i+1);
        else {
                startIndex = i - range + 1;
                subSet = data.slice(startIndex, i+1);
        }
        return subSet;
    }

    calSMA = (data, range, source) => {
        let outData = [];
        let i;
        for(i=0; i< data.length; i++){
            let subSet;
            let avarange = 0;
            subSet = this.getSubset(data, range, i);
            subSet.forEach( d => {
                switch(source){
                    case "open":
                        avarange += d.open;
                        break;
                    case "high":
                        avarange += d.high;
                        break;
                    case "low":
                        avarange += d.low;
                        break;
                    case "close":
                        avarange += d.close;
                        break;
                    default:
                        avarange += d.close;
                        break;
                }
            })
            avarange /= subSet.length;
            outData.push({"date": data[i].date, "SMA": avarange});
        }
        return outData;
    }

    calEMA = (data, range, source) => {

    }
}

let lineCalculation = new LineCalculation();
export default lineCalculation;