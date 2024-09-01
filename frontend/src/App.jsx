import { useEffect, useState } from "react";
import Form from "./components/Form";
import List from "./components/List";
import SearchFilter from "./components/SearchFilter";
import personServices from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    status: null,
  });

  // Get Data
  useEffect(() => {
    personServices.getAll().then((initialNumbers) => {
      setPersons(initialNumbers);
    });
  }, []);

  const showNotification = (message, status) => {
    setNotification({
      message: message,
      status: status,
    });
    setTimeout(() => {
      setNotification({
        message: null,
        status: null,
      });
    }, 5000);
  };

  // Utility to make strings the same for comparisons
  const normalizeString = (string) => {
    return string.toLowerCase().trim();
  };

  // Create Data
  const addPerson = (e) => {
    e.preventDefault();
    // Create new object based on input value
    const newPerson = {
      name: normalizeString(newName),
      number: newNumber,
    };
    // Verify if name doesn't already exists in db.
    const isExistingPerson = persons.find(
      (person) => person.name === newPerson.name
    );
    console.log(isExistingPerson);

    // Confirm number update is person is already in db.
    if (isExistingPerson) {
      const confirmUpdate = window.confirm(
        `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
      );
      // Create updated person
      if (confirmUpdate) {
        const changedPerson = {
          ...isExistingPerson,
          number: newPerson.number,
        };
        // Update/Push updated person into the DB.
        personServices
          .update(isExistingPerson.id, changedPerson)
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== isExistingPerson.id ? person : updatedPerson
              )
            );
            showNotification(`Updated number to${updatedPerson.number}`, "ok");
          })
          .catch((error) => {
            if (error.status === 404)
              showNotification(
                `Information of ${newPerson.name} has already been removed from server`,
                "error"
              );
            console.error(error.message);
          });
      }
    } else {
      // Create/Add new person to db.
      personServices.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        showNotification(`Added ${returnedPerson.name}`, "ok");
      });
    }

    // Reset input
    setNewName("");
    setNewNumber("");
  };

  // Filter Data
  const searchPerson = persons.filter((person) =>
    normalizeString(person.name).includes(normalizeString(searchTerm))
  );

  // Delete Data
  const deleteOnePerson = (id, name) => {
    const confirmDeletePerson = window.confirm(`delete ${name}?`);
    // Ask user if they are sure that they wish to delete person entry.
    if (confirmDeletePerson)
      personServices
        .deletePerson(id)
        .then((response) => {
          if (response.status === 200)
            setPersons(persons.filter((person) => person.id !== id));
          showNotification(`Succesfully deleted ${name}`, "ok");
          console.log(`Person deletion succesfull`);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notification.message}
        status={notification.status}
      />
      <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Form
        onSubmit={addPerson}
        name={newName}
        number={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />
      <List onDelete={deleteOnePerson} searchPerson={searchPerson} />
    </div>
  );
};

export default App;
