//Skończyłem na minucie 1:05:15
//import bootstrap from 'bootstrap';
import { useState } from 'react';

const App = () => {


  return (
    <div>
      <a href="https://www.youtube.com/watch?v=COtrqVRwO7I">Link do tutorialu</a>
      <h1>Egzamin Zawodowy INF.04 - rozwiązuje doświadczony programista</h1>
      <h2>Liczba kursów: 3</h2>
      <ol>
        <li>Programowanie w C#</li>
        <li>Angular dla początkujących</li>
        <li>Kurs Django</li>
      </ol>

      <form>
        <div className="form-group">
          <label for="name-and-surname">Imię i nazwisko:</label>
          <input className="form-control" type="text" id="name-and-surname"></input>
        </div>
        <div className="form-group">
          <label for="course-number">Numer kursu:</label>
          <input className="form-control" type="number" id="course-number"></input>
        </div>

        <button className="btn btn-primary">Zapisz do kursu</button>

      </form>
    </div>
    
  );
};

export default App;
