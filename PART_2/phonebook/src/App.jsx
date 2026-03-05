import { useState, useEffect } from 'react'
import axios from 'axios'

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
    {persons.map((person) => (
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
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data);
        console.log(`Fetched ${response.data.length} persons from the database`);
      })
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const addPerson = () => {
    if (newName.trim() === '') {
      window.alert("Name can't be empty");
      return;
    }
    if (persons.some(person => person.name === newName)) {
      window.alert(`"${newName}" is already added to phonebook`);
      return;
    }

    const newPerson = { name: newName, number: newNumber, id: persons.length + 1 };

    console.log(`Adding new person: ${newPerson.name} with number: ${newPerson.number}`);

    axios.post('http://localhost:3001/persons', newPerson)
      .then(response => {
        setPersons(persons.concat(response.data));
        console.log(`Number added: ${response.data.name} (${response.data.number})`);
        console.log(`Total persons in database: ${persons.length + 1}`);
        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        console.error('Error saving person:', error);
      });
  };

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
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

export default App