import React from 'react';
import TickerInput from './components/tickerinput.js';
import Chart5y from './components/chart5y.js';
import Chart30d from './components/chart30d.js';
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
    getDataByTicker(ticker).then(data => {
      this.setState({data});
    });
  }

  onAnalyze(event) {
    event.preventDefault();
    this.retrieveData(this.state.ticker);
  }

  render() {
    return (
      <div className="row">
        <div className="col-5">
          <Chart5y
            data={this.state.data && this.state.data.data5y}
            height={this.state.height}
            rangeSelected={0}
          />
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
        <div className="col-5">
          <Chart30d
            data={this.state.data && this.state.data.data30d}
            height={this.state.height}
            rangeSelected={0}
            rangeChange={(event) => {
              console.log('clicked here');
              console.log(event);
            }}
          />
        </div>
      </div>
    );
  }
}

export default Bootstrap
