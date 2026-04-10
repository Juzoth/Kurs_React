import { useState, useEffect } from 'react';
import SearchCountries from './components/SearchCountries';
import CountriesList from './components/CountriesList';
import CountryDetail from './components/CountryDetail';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setCountries([]);
      setError('');
      return;
    }

    setLoading(true);
    setError('');

    fetch(`https://restcountries.com/v3.1/name/${searchQuery}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('No countries found');
        }
        return response.json();
      })
      .then(data => {
        setCountries(data);
      })
      .catch(err => {
        setCountries([]);
        setError('No countries found');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSelectCountry = (country) => {
    setCountries([country]);
  };

  return (
    <div className="container">
      <h1>Country Information Search</h1>
      <SearchCountries onSearch={handleSearch} />
      
      {loading && <p className="loading">Loading...</p>}
      
      {error && <p className="error">{error}</p>}
      
      {!loading && !error && countries.length === 0 && searchQuery && (
        <p className="info">Enter a country name to search</p>
      )}
      
      {!loading && !error && countries.length > 10 && (
        <div className="too-many">
          <p>Too many matches, please specify another search</p>
        </div>
      )}
      
      {!loading && !error && countries.length > 1 && countries.length <= 10 && (
        <CountriesList countries={countries} onSelectCountry={handleSelectCountry} />
      )}
      
      {!loading && !error && countries.length === 1 && (
        <CountryDetail country={countries[0]} onBack={() => setSearchQuery('')} />
      )}
    </div>
  );
};

export default App;