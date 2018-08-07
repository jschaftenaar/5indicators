import React from 'react';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { darkunica as theme } from '../charttheme.js';
import merge from 'deepmerge';

const Chart5y = ({data, height}) => {
  if (!data) return '';
  const options = {
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
    rangeSelector: { selected: 0},
    navigator: {enabled: false},

    yAxis: [
      {
        labels: {
          align: 'right',
        },
        title: {
          text: 'Close'
        },
        resize: {
          enabled: true
        },
        lineWidth: 2,
        height: "39%"
      }, {
        labels: {
            align: 'right',
        },
        title: {
            text: 'Moving Averages'
        },
        height: "40%",
        lineWidth: 2,
        top: "40%",
        offset: 0,
        resize: {
          enabled: true
        },
      }, {
        labels: {
          align: 'right',
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
        data: data.close,
        name: 'Day Close',
        animation: false
      },
      {
        data: data.high,
        name: 'Simple Moving Average 100',
        yAxis: 1,
        animation: false
      },
      {
        data: data.low,
        name: 'Simple Moving Average 200',
        yAxis: 1,
        animation: false
      },
      {
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

export default Chart5y
