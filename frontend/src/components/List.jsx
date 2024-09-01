import ListItem from "./ListItem";

const List = ({ onDelete, searchPerson }) => {
  return (
    <div>
      <h2>Numbers</h2>
      {searchPerson.map((person) => (
        <ListItem key={person.id} data={person} onDelete={onDelete} />
      ))}
    </div>
  );
};
export default List;
