import { useState } from 'react';

const SearchCountries = ({ onSearch }) => {
  const [input, setInput] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    onSearch(value);
  };

  return (
    <div className="search-container">
      <label htmlFor="search">Find countries: </label>
      <input
        id="search"
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Type a country name..."
      />
    </div>
  );
};

export default SearchCountries;
