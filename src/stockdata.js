import axios from 'axios';

const apiKey = 'GXZVNDCSG7Y5BCOH';
const baseUrl = 'https://www.alphavantage.co/query?';

export function getDaily(ticker) {
  return axios.get(`${baseUrl}outputsize=full&&function=TIME_SERIES_INTRADAY&symbol=${ticker}&apikey=${apiKey}`);
}

export function getSma100(ticker) {
  return axios.get(`${baseUrl}function=SMA&symbol=${ticker}&interval=intraday&time_period=100&series_type=close&apikey=${apiKey}`);
}

export function getSma200(ticker) {
  return axios.get(`${baseUrl}function=SMA&symbol=${ticker}&interval=intraday&time_period=200&series_type=close&apikey=${apiKey}`);
}

export function extractData(response) {
  const key = Object.keys(response.data)[1];
  return response.data[key];
}

export function transformObject(object) {
  const result = {}
  const dateKeys = Object.keys(object.data);
  const transformKeys = Object.keys(object.transform);
  dateKeys.forEach((date) => {
    result[date] = {};
    const valueKeys = Object.keys(object.data[date]);
    valueKeys.forEach((item) => {
      if (transformKeys.includes(item)) {
        const newKey = object.transform[item];
        result[date][newKey] = parseFloat(object.data[date][item]);
      } else {
        result[date][item] = parseFloat(object.data[date][item]);
      }
    });
  });
  return result;
}

export function combineObjects(set) {
  let resultSet = {};
  set.forEach(dataPoints => {
    const data = dataPoints.transform
      ? transformObject(dataPoints)
      : dataPoints.data;
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (resultSet[key]) {
        resultSet[key] = Object.assign(resultSet[key], data[key]);
      } else {
        resultSet[key] = Object.assign({}, data[key]);
      }
    });
  });
  return resultSet;
}

export function buildArray(object) {
  const keys = Object.keys(object);
  const results = [];
  keys.forEach(date => {
    results.push({
      NAME: date,
      ...object[date]
    });
  });

  results.sort(function(a, b) {
    if (a.NAME < b.NAME)
      return -1;
    if (a.NAME > b.NAME)
      return 1;
    return 0;
  });
  return results;
}

export function buildObject(array) {
  const open = [];
  const high = [];
  const low = [];
  const close = [];
  const volume = [];
  const sma100 = [];
  const sma200 = [];
  const parseDate = (input) => {
    const d = input.split('-');
    const d2 = new Date(d[0],d[1]-1,d[2]).getTime();
    return d2;
  };

  array.forEach((item) => {
    const date = parseDate(item.NAME);
    open.push([date, item.OPEN]),
    high.push([date, item.HIGH]),
    low.push([date, item.LOW]),
    close.push([date, item.CLOSE]),
    volume.push([date, item.VOLUME]),
    sma100.push([date, item.SMA100]),
    sma200.push([date, item.SMA200])
  });

  return {
    open,
    high,
    low,
    close,
    volume,
    sma100,
    sma200
  };

}

export function getDataByTicker(ticker) {
  return axios.all([
    getDaily(ticker),
    getSma100(ticker),
    getSma200(ticker)
  ]).then(([daily, sma100,sma200]) => {
    const results = combineObjects([
      {
        transform: {
          '1. open': 'OPEN',
          '2. high': 'HIGH',
          '3. low': 'LOW',
          '4. close': 'CLOSE',
          '5. volume': 'VOLUME'
        },
        data: extractData(daily)
      }, {
        transform: {SMA: 'SMA100'},
        data: extractData(sma100)
      }, {
        transform: {SMA: 'SMA200'},
        data: extractData(sma200)
      }
    ]);
    const raw = buildArray(results);
    return buildObject(raw);
  });

}


