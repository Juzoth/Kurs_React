const CountryDetail = ({ country, onBack }) => {
  const languages = country.languages 
    ? Object.values(country.languages).join(', ') 
    : 'N/A';

  return (
    <div>
      <button onClick={onBack}>Back</button>
      
      <h2>{country.name.common}</h2>
      
      {country.flags && (
        <div>
          <img 
            src={country.flags.svg} 
            alt={`Flag of ${country.name.common}`}
          />
        </div>
      )}
      
      <div>
        <p>Capital: {country.capital?.[0] || 'N/A'}</p>
        <p>Area: {country.area?.toLocaleString()} km²</p>
        <p>Population: {country.population?.toLocaleString()}</p>
        <p>Region: {country.region || 'N/A'}</p>
        <p>Subregion: {country.subregion || 'N/A'}</p>
        <p>Languages: {languages}</p>
      </div>
    </div>
  );
};

export default CountryDetail;
