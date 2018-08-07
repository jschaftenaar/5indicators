import React from 'react';
import TickerInput from './components/tickerinput.js';
import Chart from './components/chart.js';
import {getDataByTicker} from './stockdata.js';

class Bootstrap extends React.Component {

 constructor(props) {
    super(props);
    this.state = {
      ticker:'ADBE',
      lastRequest: localStorage.getItem('lastRequest')
    };
    this.tickerChange = this.tickerChange.bind(this);
    this.onAnalyze = this.onAnalyze.bind(this);
    this.retrieveData = this.retrieveData.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  tickerChange(ticker) {
    this.setState({ticker});
  }

  retrieveData(ticker) {
    const cache = JSON.parse(localStorage.getItem(ticker));
    let d = new Date();
    let now = Math.ceil(d.getTime() / 1000);
    if (!cache || (cache.requestTime+60)<now) {
      getDataByTicker(ticker).then(data => {
        localStorage.setItem(ticker, JSON.stringify({
          requestTime: now,
          data
        }));
        this.setState({data});
      });
    } else {
      this.setState({ data: cache.data });
    }
  }

  onAnalyze(event) {
    event.preventDefault();
    this.retrieveData(this.state.ticker);
  }

  render() {
    return (
      <div className="row">
        <div className="col">
          <Chart data={this.state.data} height={this.state.height}/>
        </div>
        <div className="col">
          <h1>Indicator Checklist</h1>
          <TickerInput value={this.state.ticker} onChange={this.tickerChange}/>
          <button onClick={this.onAnalyze}>Analyze</button>
          <ul>
          <li>Support & Resistance</li>
          <li>Moving Average</li>
          <li>RSI</li>
          <li>MACD</li>
          <li>Volume</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Bootstrap
