const SearchFilter = ({ searchTerm, setSearchTerm }) => {
  return (
    <div>
      <label htmlFor="search">Filter shown with: </label>
      <input
        autoComplete="on"
        id="search"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};
export default SearchFilter;
