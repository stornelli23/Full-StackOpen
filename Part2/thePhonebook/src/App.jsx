import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import PersonService from "./services/persons";
import Notification from "./components/Notification";
// import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  useEffect(() => {
    PersonService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const addPerson = (e) => {
    e.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
      // We create a new object for the note but omit the id property since it's better to let the server generate ids for our resources.
    };

    const existingPerson = persons.find((person) => person.name === newPerson.name);

    if (existingPerson) {
      if(window.confirm(`${existingPerson.name} is already added to the phonebook, replace the old number with a new one?`)){
        PersonService
        .update(existingPerson.id, newPerson)
        .then(updatedPerson => {
          setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person));
          setNotificationMessage(`${updatedPerson.name} number was successfully changed.`)
          setNotificationType('succesful')
          setTimeout(() => {
            setNotificationMessage(null)
            setNotificationType(null)
          }, 5000)
        })
        .catch(error => {
          // Handle error
          console.error('Error updating person:', error);
          setNotificationMessage(`Information of ${existingPerson.name} has already been removed from server.`)
          setNotificationType('error')
          setTimeout(() => {
            setNotificationMessage(null)
            setNotificationType(null)
          }, 5000)
        });
      }
    } else {
      PersonService
      .create(newPerson)
      .then(setPersons(persons.concat(newPerson)))
      .catch(error => {
        // Handle error
        console.error('Error creating person:', error);
        setNotificationMessage(`${existingPerson.name} couldn't be created, please try again.`)
        setNotificationType('error')
        setTimeout(() => {
          setNotificationMessage(null)
          setNotificationType(null)
        }, 5000)
      });
      setNotificationMessage(`${newPerson.name} was successfully added.`)
      setNotificationType('succesful')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    }
    setNewName("");
    setNewNumber("");
  };

  const deletePerson = (id) => {
    if(window.confirm(`Do you really want to delete this person?`)){
      PersonService
      .deletePerson(id)
      .then(setPersons(persons.filter(person => person.id !== id)))
    }
  };


  const handleNewName = (event) => setNewName(event.target.value);
  const handleNewNumber = (event) => {
    const inputValue = event.target.value.replace(/[^0-9|-]/g, "");
    setNewNumber(inputValue);
  };
  const handleFilter = (e) => {
    setNewFilter(e.target.value);
  };

  const filteredPersons =
    newFilter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(newFilter.toLowerCase())
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={notificationType}/>
      <Filter value={newFilter} onChange={handleFilter} />
      <h2>Add a new</h2>
      <PersonForm
        nameValue={newName}
        onNameChange={handleNewName}
        numberValue={newNumber}
        onNumberChange={handleNewNumber}
        onClickBtn={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} handleDeletePerson={deletePerson} />
    </div>
  );
};

export default App;
