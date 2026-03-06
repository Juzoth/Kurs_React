import { useState, useEffect } from 'react';
import personService from './services/persons';

const Filter = ({ searchTerm, handleSearchChange }) => (
  <div>
    Search: <input value={searchTerm} onChange={handleSearchChange} />
  </div>
);

const PersonForm = ({
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
  addPerson
}) => (
  <div>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button onClick={addPerson}>add</button>
    </div>
  </div>
);

const Persons = ({ persons }) => (
  <ul>
    {persons.map(person => (
      <li key={person.id}>{person.name} {person.number}</li>
    ))}
  </ul>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('Fetching persons from backend...');
    personService.getAll().then(initialPersons => {
      console.log('Persons fetched:', initialPersons);
      setPersons(initialPersons);
    });
  }, []);

  const handleNameChange = (e) => setNewName(e.target.value);
  const handleNumberChange = (e) => setNewNumber(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const addPerson = () => {
    console.log('Adding person:', newName, newNumber);
    if (newName.trim() === '') {
      alert("Name can't be empty");
      return;
    }
    if (persons.some(p => p.name === newName)) {
      alert(`${newName} is already added`);
      return;
    }
    
    const newId = persons.length + 1;

    const newPerson = { id: newId, name: newName, number: newNumber };
    personService.create(newPerson).then(returnedPerson => {
      console.log('Person added:', returnedPerson);
      setPersons(persons.concat(returnedPerson));
      setNewName('');
      setNewNumber('');
    });
  };

  const filteredPersons = persons.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>
      <Persons persons={filteredPersons} />
    </div>
  );
};

export default App;