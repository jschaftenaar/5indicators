import React from 'react';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { darkunica as theme } from '../charttheme.js';
import merge from 'deepmerge';

const Chart30d = ({data, height, rangeSelected, rangeChange}) => {
  if (!data) return '';
  const options = {
    time: {
      useUTC: false
    },
    chart: {
      height,
      animation: false
    },
    credits: {
      enabled: false
    },
    scrollbar: {
        enabled: false
    },

    navigator: {enabled: false},
    rangeSelector: {
        buttons: [{
            type: 'hour',
            count: 1,
            text: '1H',
            events: {
              click: (event) => { rangeChange('1H'); }
            }
        }, {
            type: 'day',
            count: 1,
            text: '1D',
            events: {
              click: (event) => { rangeChange('1D'); }
            }
        }, {
            type: 'day',
            count: 5,
            text: '5D',
            events: {
              click: (event) => { rangeChange('5D'); }
            }
        }, {
            type: 'all',
            count: 1,
            text: 'All',
            events: {
              click: (event) => { rangeChange('ALL'); }
            }
        }],
        selected: rangeSelected,
        inputEnabled: false,
    },
    tooltip: {
      valueDecimals: 2,
    },
    yAxis: [
      {
        crosshair: true,
        labels: {
          align: 'left',
        },
        title: {
          text: 'Close'
        },
        lineWidth: 2,
        height: "39%"
      }, {
        crosshair: true,
        labels: {
            align: 'left',
        },
        title: {
            text: 'Moving Averages'
        },
        height: "40%",
        lineWidth: 2,
        top: "40%",
        offset: 0
      }, {
        crosshair: true,
        labels: {
          align: 'left',
        },
        title: {
          text: 'Volume'
        },
        offset: 0,
        lineWidth: 2,
        top: "85%",
        height: "14%"
      }
    ],
    series: [
      {
        type: 'candlestick',
        data: data.candlestick,
        name: 'Day',
        animation: false,
        color: 'green',
        upColor: 'red',
        gridLineWidth: 0,
        lineColor: 'green',
        upLineColor: 'red'
      },
      {
        data: data.sma100,
        name: 'Simple Moving Average 100',
        yAxis: 1,
        animation: false
      },
      {
        data: data.sma200,
        name: 'Simple Moving Average 200',
        yAxis: 1,
        animation: false
      }, {
        data: data.ema10,
        name: 'Exponential Moving Average 10',
        yAxis: 1,
        animation: false
      },
      {
        data: data.ema20,
        name: 'Exponential Moving Average 20',
        yAxis: 1,
        animation: false
      }, {
        data: data.ema50,
        name: 'Exponential Moving Average 50',
        yAxis: 1,
        animation: false
      }, {
        type: 'column',
        name: 'Volume',
        data: data.volume,
        yAxis: 2,
        animation: false
      }
    ]
  }
  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={'stockChart'}
      options={merge(theme, options)}
    />
  );
}

export default Chart30d
