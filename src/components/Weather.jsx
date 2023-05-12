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
    ) : <></>}
  </div>
);
  }

export default Weather;
