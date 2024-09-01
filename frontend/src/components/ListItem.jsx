const ListItem = ({ data, onDelete }) => {
  const { name, number, id } = data;
  return (
    <div>
      {name} {number} {""}
      <button onClick={() => onDelete(id, name)}>Delete</button>
    </div>
  );
};
export default ListItem;
