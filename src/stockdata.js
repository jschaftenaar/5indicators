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

export function adjustTimezone(date) {
  return data;
}

export function dateFromDate(date) {
  const d = date.split('-');
  const newDate = new Date(d[0], d[1]-1, d[2]);
  return newDate.getTime();
}

export function dateFromDateWithMinute(date, minute) {
    const d = date;
    const t = minute.split(':');
    const newDate = new Date(d.substring(0,4), d.substring(4,6)-1, d.substring(6),t[0], t[1]);
    return newDate.getTime();
}

export function convert5yToSet(input) {
  const result = [];
  input.data.forEach(item => {
    result.push({
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
      label: item.label,
      date: dateFromDate(item.date)
    })
  });
  return result;
}

export function convert30dToSet(input) {
  const result = [];
  input.forEach(item => {
    result.push({
      open: item.marketOpen,
      high: item.marketHigh,
      low: item.marketLow,
      close: item.marketClose,
      volume: item.marketVolume,
      label: item.label,
      date: dateFromDateWithMinute(item.date, item.minute)
    })
  });
  return result;
}


export function average(array) {
  let sum = array.reduce((a,b) => { return a+b });
  return sum / array.length;
}

export function buildObject(array) {
  const open = [];
  const high = [];
  const low = [];
  const close = [];
  const volume = [];
  const sma100 = [];
  const sma200 = [];
  const ema10 = [];
  const ema20 = [];
  const ema50 = [];
  const candlestick = [];


  const trailing100 = [];
  const trailing200 = [];
  const trailing10 = [];
  const trailing20 = [];
  const trailing50 = [];

  array.forEach((item, index) => {
    const date = item.date;
    open.push([date, item.open]);
    high.push([date, item.high]);
    low.push([date, item.low]);
    close.push([date, item.close]);
    volume.push([date, item.volume]);

    // calculate eponential moving averages
    // for 10, 20 and 50

    trailing10.push(item.close);
    trailing20.push(item.close);
    trailing50.push(item.close);

    if (index==0) {
      ema10.push([date, item.close]);
      ema20.push([date, item.close]);
      ema50.push([date, item.close]);
    } else {
      let ema = (item.close - ema10[ema10.length-1][1]) * (2/11) + ema10[ema10.length-1][1]
      ema10.push([date, ema]);
      ema = (item.close - ema20[ema20.length-1][1]) * (2/21) + ema20[ema20.length-1][1]
      ema20.push([date, ema]);
      ema = (item.close - ema50[ema50.length-1][1]) * (2/51) + ema50[ema50.length-1][1]
      ema50.push([date, ema]);
    }
    // calculate simple moving average
    trailing100.push(item.close);
    trailing200.push(item.close);
    if (trailing100.length>100) {
      trailing100.shift();
      sma100.push([date, average(trailing100)]);
    }
    if (trailing200.length>200) {
      trailing200.shift();
      sma200.push([date, average(trailing200)]);
    }
    candlestick.push([
      date,
      item.open,
      item.high,
      item.low,
      item.close
    ]);
  });
  return {
    open,
    high,
    low,
    close,
    volume,
    sma100,
    sma200,
    ema10,
    ema20,
    ema50,
    candlestick
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
    return result;
  })

}


