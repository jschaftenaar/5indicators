import React from 'react';

const TickerInput = ({onChange, value}) => {

  const localChange = (event) => {
    event.preventDefault();
    onChange(event.target.value);
  }

  return (
    <fieldset>
      <label>Ticker</label>
      <input type="text" value={value} onChange={localChange}/>
    </fieldset>
  );
}


export default TickerInput
