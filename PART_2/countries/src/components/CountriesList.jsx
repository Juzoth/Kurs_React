const CountriesList = ({ countries, onSelectCountry }) => {
  return (
    <div>
      {countries.map(country => (
        <div key={country.cca2}>
          <span>{country.name.common}</span>
          <button onClick={() => onSelectCountry(country)}>show</button>
        </div>
      ))}
    </div>
  );
};

export default CountriesList;
