import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Chat, Member } from "../Sidebar/Chats";
import { axiosPrivate } from "../../utils/axios";
import debounce from "lodash/debounce";
import { RiCloseLine } from "react-icons/ri";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface SelectMember extends Member {
  checked: boolean;
}

type Props = {
  handleSetModalOpen: (val: boolean) => void;
  handleAddChat: (newChat: Chat) => void;
};

const NewChat = forwardRef<HTMLDivElement, Props>(({ handleSetModalOpen, handleAddChat }, ref) => {
  const [users, setUsers] = useState<SelectMember[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState<string>("");
  const modalRoot = document.getElementById("modal-layer");

  const { auth } = useAuth();
  const navigate = useNavigate();

  const fetchUsers = async (searchQuery: string) => {
    try {
      const res = (await axiosPrivate.get(`/user${searchQuery && "?name=" + searchQuery}`)) as any;
      const data = res.data as SelectMember[];

      const checkedUsers = data.map((user: SelectMember) => ({
        ...user,
        checked: false,
      }));

      setUsers(checkedUsers);
    } catch (e: any) {
      console.log(e);
    }
  };

  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 300), []);

  const handleCreateChat = async () => {
    if (members.length === 0) return;

    try {
      const IDs = members.map((member) => member.id);

      const { data } = await axiosPrivate.post("/chat", {
        members: IDs,
      });

      handleAddChat(data as Chat);
      handleSetModalOpen(false);

      navigate(`/chat/${data.id}`);
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedFetchUsers(newQuery);
  };

  useEffect(() => {
    fetchUsers(query);
  }, []);

  const MAX_MEMBERS = 9;

  const addMember = (newMember: Member) => {
    if (members.find((member) => member.id === newMember.id)) return;
    if (members.length >= MAX_MEMBERS) return;
    console.log("add");

    setMembers((prev) => [...prev, newMember]);
    setUsers((prev) => prev.map((user) => (user.id === newMember.id ? { ...user, checked: true } : user)));
  };

  const removeMember = (member: Member) => {
    console.log("remove");
    setMembers((prev) => prev.filter((user) => user.id !== member.id));
    setUsers((prev) => prev.map((user) => (user.id === member.id ? { ...user, checked: false } : user)));
  };

  const Counter = () => {
    if (members.length >= MAX_MEMBERS) return <span className="text-name counter">You can't select more people</span>;

    const count = MAX_MEMBERS - members.length;
    return <span className="text-name counter">You can select {count} more people</span>;
  };

  if (!modalRoot || !auth) return null;

  return ReactDOM.createPortal(
    <div className="modal-container">
      <div onClick={(e) => e.stopPropagation()} ref={ref} className="create-chat">
        <div className="create-chat-header">
          <span className="text-name">Create Chat</span>
          <Counter />
        </div>

        <label className="create-chat-input-container" htmlFor="search">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" strokeWidth="1.9200000000000004" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
            </g>
          </svg>

          <input onChange={(e) => handleChange(e)} type="text" id="search" placeholder="Type to search..." />
        </label>

        <div className="members">
          {members.map((member: Member, index: number) => (
            <div onClick={() => removeMember(member)} className="member" key={index}>
              <span className="text-name text-clamp">{member.profile.name}</span>
              <div className="icon">
                <RiCloseLine />
              </div>
            </div>
          ))}
        </div>

        <div className="list">
          {users
            .filter((user) => user.id !== auth.id)
            .map((user: SelectMember, index: number) => (
              <div onClick={(e) => !(e.target as HTMLDivElement).closest(".checkbox-container") && addMember(user)} className="item" key={index}>
                <img src={user.profile.imageUrl ? user.profile.imageUrl : "/defaultProfilePicture.jpg"} className="profile-pic" alt="Profile image" />
                <span className="text-name text-clamp">{user.profile.name}</span>

                <label className="checkbox-container">
                  <input checked={members.find((member) => member.id === user.id) ? true : false} onChange={() => (members.find((member) => member.id === user.id) ? removeMember(user) : addMember(user))} id="checkbox" type="checkbox" />
                  <span className="checkmark"></span>
                </label>
              </div>
            ))}
        </div>

        <button onClick={handleCreateChat} className="button-create">
          Create
        </button>
      </div>
    </div>,
    modalRoot,
  );
});

export default NewChat;
