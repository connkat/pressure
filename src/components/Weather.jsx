const Weather = ({ weatherData, pressureDiff }) => {

  const altReason = () => {
    const reasons = [
      "Maybe drink more water",
      "Maybe try to get some more sleep",
      "Maybe get some fresh air",
      "Maybe it is time for some Advil",
    ];
    const pick = Math.floor(Math.random() * 4);

    return reasons[pick];
  };
;
  return(
	<div className="Card">
    <h3>{weatherData.name}</h3>
    {pressureDiff < 6 ? (
      <p>{altReason}</p>
    ) : <>
    <div className="header">City Name: {weatherData.name}</div>
        <p>Temprature: {weatherData.main.temp}</p>
        <p>Sunrise: {weatherData.sys.sunrise}</p>
        <p>Sunset: {weatherData.sys.sunset}</p>
        <p>Description: {weatherData.weather[0].description}</p></>}
  </div>
);
  }

export default Weather;
