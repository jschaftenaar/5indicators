import axios from 'axios';

const apiKey = 'GXZVNDCSG7Y5BCOH';
const baseUrl = 'https://api.iextrading.com/1.0';

export function get5y(ticker) {
  return axios.get(`${baseUrl}/stock/${ticker}/chart/5y`);
}

function getDay(ticker, offset) {
    let date = new Date();
    date.setDate(date.getDate()-offset);
    let d = date.getFullYear()
            + ('0' + (date.getMonth()+1)).slice(-2)
            + ('0' + date.getDate()).slice(-2);
    return axios.get(`${baseUrl}/stock/${ticker}/chart/date/`+d);
}


export function get30d(ticker) {
  const days=[]
  for (let offset=30; offset>=0; offset--) {
    days.push(offset);
  };

  return axios.all(days.map(offset => getDay(ticker, offset)))
  .then(dataSet => {
      const result = dataSet.reduce(function (total, dayResult) {
        return total.concat(dayResult.data);
      }, []);
      return result;
  });
}

export function convert5yToSet(input) {
  const result = [];
  input.data.forEach(item => {
    const d = item.date.split('-');
    const date = new Date(d[0], d[1]-1, d[2]);
    result.push({
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
      label: item.label,
      date: date.getTime()
    })
  });
  return result;
}

export function convert30dToSet(input) {
  const result = [];
  input.forEach(item => {
    const d = item.date;
    const t = item.minute.split(':');
    console.log(d.substring(0,4), d.substring(4,6), d.substring(6),t[0], t[1]);
    const date = new Date(d.substring(0,4), d.substring(4,6)-1, d.substring(6),t[0], t[1]);
    result.push({
      open: item.marketOpen,
      high: item.marketHigh,
      low: item.marketLow,
      close: item.marketClose,
      volume: item.marketVolume,
      label: item.label,
      date: date.getTime()
    })
  });
  return result;
}


export function buildObject(array) {
  const open = [];
  const high = [];
  const low = [];
  const close = [];
  const volume = [];
  const sma100 = [];
  const sma200 = [];


  array.forEach((item) => {
    const date = item.date;
    open.push([date, item.open]),
    high.push([date, item.high]),
    low.push([date, item.low]),
    close.push([date, item.close]),
    volume.push([date, item.volume]),
    sma100.push([date, item.high]),
    sma200.push([date, item.low])
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
    get5y(ticker),
    get30d(ticker)
  ]).then(([data5y,data30d]) => {
    const result = {
      data5y: buildObject(convert5yToSet(data5y)),
      data30d: buildObject(convert30dToSet(data30d))
    };
    console.log(result.data30d);
    return result;
  })

}


