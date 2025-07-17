import { usePlaces } from "../contexts/PlacesContext";

function SearchPosts() {
  const { searchQuery, setSearchQuery } = usePlaces();
  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search Places..."
    />
  );
}

export default SearchPosts;
