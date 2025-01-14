import { useSelector, useDispatch } from "react-redux";
import { changeSearchField } from "../actions/actionCreators";

const Skills = () => {
  const { items, loading, error, search } = useSelector(
    (state) => state.skills
  );
  const dispatch = useDispatch();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    dispatch(changeSearchField(value));
  }

  const hasQuery = search.trim() !== "";

  
  return (
    <main>
      <div>
        <input type="search" value={search} onChange={handleSearch} />
      </div>
      {!hasQuery && <div>Type something to search</div>}
      {hasQuery && loading && <div>searching...</div>}
      {error ? (
        <div>Error occured</div>
      ) : (
        <ul>
          {items.map((o: any) => (
            <li key={o.id}>{o.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Skills;