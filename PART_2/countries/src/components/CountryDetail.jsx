const CountryDetail = ({ country, onBack }) => {
  const languages = country.languages 
    ? Object.values(country.languages).join(', ') 
    : 'N/A';

  return (
    <div className="country-detail">
      <button className="back-button" onClick={onBack}>← Back to search</button>
      
      <h2>{country.name.common}</h2>
      
      {country.flags && (
        <div className="flag-container">
          <img 
            src={country.flags.svg} 
            alt={`Flag of ${country.name.common}`}
            className="flag"
          />
        </div>
      )}
      
      <div className="details">
        <p><strong>Capital:</strong> {country.capital?.[0] || 'N/A'}</p>
        <p><strong>Area:</strong> {country.area?.toLocaleString()} km²</p>
        <p><strong>Population:</strong> {country.population?.toLocaleString()}</p>
        <p><strong>Region:</strong> {country.region || 'N/A'}</p>
        <p><strong>Subregion:</strong> {country.subregion || 'N/A'}</p>
        <p><strong>Languages:</strong> {languages}</p>
      </div>
    </div>
  );
};

export default CountryDetail;
