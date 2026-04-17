import { useState, useEffect } from 'react';
import personService from './services/persons';
import Notification from './components/Notification';

// Komponent do wyszukiwania kontaktow
const Filter = ({ searchTerm, handleSearchChange }) => (
  <div>
    Search: <input value={searchTerm} onChange={handleSearchChange} />
  </div>
);

// Szkielet komponentu formularza do dodawania nowych kontaktów
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

// Szkielet komponentu do wyświetlania listy kontaktów
const Persons = ({ persons, handleDelete }) => (
  <ul>
    {persons.map(person => (
      <li key={person.id}>
        {person.name} {person.number}
        <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
      </li>
    ))}
  </ul>
);



const App = () => {
  // Dynamiczne przechowywanie listy kontaktów pobranych z serwera
  const [persons, setPersons] = useState([]);
  // Dynamiczne przechowywanie wartości inputu dla imienia nowego kontaktu
  const [newName, setNewName] = useState('');
  // Dynamiczne przechowywanie wartości inputu dla numeru telefonu nowego kontaktu
  const [newNumber, setNewNumber] = useState('');
  // Dynamiczne przechowywanie wartości inputu dla wyszukiwarki kontaktów
  const [searchTerm, setSearchTerm] = useState('');
  // Dynamiczne przechowywanie wiadomości notyfikacji
  const [notification, setNotification] = useState(null);
  // Dynamiczne przechowywanie typu notyfikacji (success lub error)
  const [notificationType, setNotificationType] = useState(null);

  
  // Pobranie kontaktów z serwera przy pierwszym renderze komponentu
  useEffect(() => {
    console.log('Fetching persons from backend...');
    personService.getAll().then(initialPersons => {
      console.log('Persons fetched:', initialPersons);
      setPersons(initialPersons);
    });
  }, []);

  // Funkcja do wyświetlania na kilka sekund
  const showNotification = (message, type = 'success', duration = 5000) => {
    setNotification(message);
    setNotificationType(type);
    
    // Automatyczne usunięcie po określonym czasie
    setTimeout(() => {
      setNotification(null);
      setNotificationType(null);
    }, duration);
  };


  // Obsluga zmiany imienia
  const handleNameChange = (e) => setNewName(e.target.value);
  // Obsluga zmiany numeru telefonu
  const handleNumberChange = (e) => setNewNumber(e.target.value);
  // Obsluga zmiany tekstu w wyszukiwarce
  const handleSearchChange = (e) => setSearchTerm(e.target.value);


  // Dodanie lub aktualizacja kontaktu - sprawdzenie istnienia, potwierdzenie i odpowiednie zapytanie do serwera
  const addPerson = () => {
    console.log('Adding person:', newName, newNumber);
    // Sprawdzenie czy pole nie jest puste
    if (newName.trim() === '') {
      alert("Name can't be empty");
      return;
    }
    
    // Sprawdzenie, czy osoba o tej samej nazwie już istnieje
    const existingPerson = persons.find(p => p.name === newName);
    
    if (existingPerson) {
      // If obslugujacy zapytanie: jesli kontakt istnieje, zapytaj o potwierdzenie aktualizacji numeru
      const confirmUpdate = window.confirm(`${newName} is already added to phonebook. Replace the old number with a new one?`);
      if (!confirmUpdate) return;

      // Aktualizacja istniejącego kontaktu za pomocą PUT request
      const updatedPerson = { ...existingPerson, number: newNumber };
      personService.update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          console.log('Person updated:', returnedPerson);
          // Aktualizacja lokalnie po udanym update z serwera
          setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson));
          // Czyszczenie inputow po aktualizacji kontaktu
          setNewName('');
          setNewNumber('');
          // Wyświetlenie notyfikacji o powodzeniu
          showNotification(`${returnedPerson.name}'s number updated successfully`, 'success');
        })
        .catch(error => {
          console.log('Error updating person:', error);
          // Jeśli kontakt nie istnieje (404), usuń go z lokalnej listy
          if (error.response && error.response.status === 404) {
            setPersons(persons.filter(p => p.id !== existingPerson.id));
            showNotification(`Information of ${existingPerson.name} has already been removed from server`, 'error');
          } else {
            showNotification('Error updating contact', 'error');
          }
          // Czyszczenie inputow
          setNewName('');
          setNewNumber('');
        });
    } 

    else {
      // Jesli osoba nie istnieje - dodaj nowy kontakt za pomocą POST request
      const newPerson = { name: newName, number: newNumber };
      personService.create(newPerson)
        .then(returnedPerson => {
          console.log('Person added:', returnedPerson);
          // Dodanie nowego kontaktu do listy
          setPersons(persons.concat(returnedPerson));
          // Czyszczenie inputow po aktualizacji kontaktu
          setNewName('');
          setNewNumber('');
          // Wyświetlenie notyfikacji o powodzeniu
          showNotification(`${returnedPerson.name} added successfully`, 'success');
        })
        .catch(error => {
          console.log('Error creating person:', error);
          showNotification('Error adding contact', 'error');
          // Czyszczenie inputow
          setNewName('');
          setNewNumber('');
        });
    }
  };


  // Obsluga usuwania kontaktu - potwierdzenie i aktualizacja stanu po usunięciu
  const handleDelete = (id, name) => {
    const confirmDeletion = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!confirmDeletion) return;
    // Usuwanie kontaktu z serwera
    personService
      .remove(id)
      .then(() => {
        // Usuwanie lokalnie po udanym usunięciu z serwera
        setPersons(persons.filter(p => p.id !== id));
        console.log(`Person with id ${id} deleted`);
        // Wyświetlenie notyfikacji o powodzeniu
        showNotification(`${name} deleted successfully`, 'success');
      })
      .catch(error => {
        // Wyswietlen alertu, gdy kontakt został już usunięty z serwera
        showNotification(`Information of ${name} has already been removed from server`, 'error');
      });
  };


  // Filtrowanie konatkow przez tekst wpisany w wyszukiwarke
  const filteredPersons = persons.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType} />
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
      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;