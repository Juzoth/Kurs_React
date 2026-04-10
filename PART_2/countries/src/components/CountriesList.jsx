const CountriesList = ({ countries, onSelectCountry }) => {
  return (
    <div className="countries-list">
      {countries.map(country => (
        <div key={country.cca2} className="country-item">
          <button onClick={() => onSelectCountry(country)}>
            {country.name.common}
          </button>
        </div>
      ))}
    </div>
  );
};

export default CountriesList;
