import { useId } from "react";

import { IoIosSearch } from "react-icons/io";

type Props = {
  search: string;
  setSearch: (value: string) => void;
};

const Search = ({ search, setSearch }: Props) => {
  const inputId = useId();

  return (
    <div className="search">
      <label htmlFor={inputId}>
        <div className="input-container">
          <IoIosSearch />

          <input onChange={(e) => setSearch(e.target.value)} value={search} id={inputId} placeholder="Search..." type="text" className="input" />
        </div>
      </label>
    </div>
  );
};

export default Search;
