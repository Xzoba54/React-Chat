type Props = {
  search: string;
  setSearch: (value: string) => void;
};

const Search = ({ search, setSearch }: Props) => {
  return (
    <div className="search">
      <div className="input-container">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" strokeWidth="1.9200000000000004" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
          </g>
        </svg>

        <input onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search..." type="text" className="input" />
      </div>

      <div className="button-add cursor-pointer">
        <span>+</span>
      </div>
    </div>
  );
};

export default Search;
