import { useState, useEffect } from 'react';
import SearchCountries from './components/SearchCountries';
import CountriesList from './components/CountriesList';
import CountryDetail from './components/CountryDetail';

const App = () => {
  // Stan przechowujący aktualną zapytanie wyszukiwania
  const [searchQuery, setSearchQuery] = useState('');
  
  // Stan przechowujący listę krajów znalezionych w API
  const [countries, setCountries] = useState([]);
  
  // Stan wskazujący, czy trwa ładowanie danych z API
  const [loading, setLoading] = useState(false);
  
  // Stan przechowujący komunikat błędu, jeśli wyszukiwanie się nie powiodło
  const [error, setError] = useState('');

  // Efekt uruchamiany za każdym razem, gdy zmienia się zapytanie wyszukiwania
  useEffect(() => {
    // Jeśli zapytanie jest puste, wyczyść rezultaty
    if (searchQuery.trim() === '') {
      setCountries([]);
      setError('');
      return;
    }

    // Ustaw stan ładowania i wyczyść poprzedni błąd
    setLoading(true);
    setError('');

    // Pobierz dane krajów z REST Countries API
    fetch(`https://restcountries.com/v3.1/name/${searchQuery}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('No countries found');
        }
        return response.json();
      })
      .then(data => {
        // Ustaw znalezione kraje w stanie
        setCountries(data);
      })
      .catch(err => {
        // W przypadku błędu, wyczyść listę i ustaw komunikat błędu
        setCountries([]);
        setError('No countries found');
      })
      .finally(() => {
        // Zawsze wyłącz stan ładowania
        setLoading(false);
      });
  }, [searchQuery]);

  // Obsługiwacz zmiany zapytania wyszukiwania
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Obsługiwacz wyboru konkretnego kraju z listy
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