//Skończyłem na minucie 1:05:15

import { useState } from 'react';
import bootstrap from 'react';

const App = () => {

  const [courses, setCourses] = useState([
    'Programowanie w C#',
    'Angular dla początkujących',
    'Kurs Django',
  ]);

  const [nameAndSurname, setNameAndSurname] = useState();
  const [courseNumber, setCourseNumber] = useState();

  const onNameAndSurnameChange = (event) => {
            setNameAndSurname(event.target.value);
            };

  const onCourseNumberChange = (event) => {
              setCourseNumber(event.target.value);
            };

  const onSubmit = (event) => {
    event.preventDefault();
    console.log(nameAndSurname);
    if(courses[courseNumber -1]){
      console.log(courses[courseNumber -1]);
    } else{
      console.log("Nieprawidłowy numer kursu")
    }
  };

  return (
    <div>
      <a href="https://www.youtube.com/watch?v=COtrqVRwO7I">Link do tutorialu</a>
      <h1>Egzamin Zawodowy INF.04 - rozwiązuje doświadczony programista</h1>
      <h2>Liczba kursów: {courses.length}</h2>
      <ol>
        {courses.map((course) => (
          <li>{course}</li>
          ))}
      </ol>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label for="name-and-surname">Imię i nazwisko:</label>
          <input 
            onChange={onNameAndSurnameChange} 
            className="form-control" 
            type="text"
            id="name-and-surname"
          />
        </div>

        <div className="form-group">
          <label for="course-number">Numer kursu:</label>
          <input 
            onChange={onCourseNumberChange}
            className="form-control" 
            type="number" 
            id="course-number"
          />
        </div>

        <button className="btn btn-primary">Zapisz do kursu</button>
      </form>
    </div>
    
  );
};

export default App;
