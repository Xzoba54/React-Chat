import { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";

import debounce from "lodash/debounce";

import useAuth from "../../hooks/useAuth";
import { api } from "../../utils/axios";
import { Chat, Member } from "../../utils/types";

import { RiCloseLine } from "react-icons/ri";

import Search from "../Sidebar/Search";
interface SelectedMember extends Member {
  checked: boolean;
}

type Props = {
  handleSetModalOpen: (val: boolean) => void;
  handleAddChat: (newChat: Chat) => void;
};

const NewChat = ({ handleAddChat, handleSetModalOpen }: Props) => {
  const [users, setUsers] = useState<SelectedMember[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState<string>("");
  const modalRoot = document.getElementById("modal-layer");

  const { auth } = useAuth();
  const navigate = useNavigate();

  if (!modalRoot || !auth) return null;

  const fetchUsers = async (searchQuery: string) => {
    try {
      const res = (await api.get("/user", {
        params: {
          name: searchQuery,
        },
      })) as any;
      const data = res.data as SelectedMember[];

      const checkedUsers = data.map((user: SelectedMember) => ({
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

      const { data } = await api.post("/chat", {
        members: IDs,
      });

      // handleAddChat(data as Chat);
      handleSetModalOpen(false);

      navigate(`/chat/${data.id}`);
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    debouncedFetchUsers(query);
  }, [query]);

  useEffect(() => {
    fetchUsers(query);
  }, []);

  const MAX_MEMBERS = 9;

  const addMember = (newMember: Member) => {
    if (members.find((member) => member.id === newMember.id)) return;
    if (members.length >= MAX_MEMBERS) return;

    setMembers((prev) => [...prev, newMember]);
    setUsers((prev) => prev.map((user) => (user.id === newMember.id ? { ...user, checked: true } : user)));
  };

  const removeMember = (member: Member) => {
    setMembers((prev) => prev.filter((user) => user.id !== member.id));
    setUsers((prev) => prev.map((user) => (user.id === member.id ? { ...user, checked: false } : user)));
  };

  const Counter = () => {
    if (members.length >= MAX_MEMBERS) return <span className="counter">You can't select more people</span>;

    const count = MAX_MEMBERS - members.length;
    return <span className="counter">You can select {count} more people</span>;
  };

  return ReactDOM.createPortal(
    <div className="modal-container" onClick={() => handleSetModalOpen(false)}>
      <div onClick={(e) => e.stopPropagation()} className="create-chat">
        <div className="header">
          <span className="title">Create Chat</span>
          <Counter />
        </div>

        <Search search={query} setSearch={setQuery} />

        <div className="members">
          {members.map((member: Member, index: number) => (
            <div onClick={() => removeMember(member)} className="member" key={index}>
              <span className="name text-clamp">{member.profile.name}</span>
              <div className="icon">
                <RiCloseLine />
              </div>
            </div>
          ))}
        </div>

        <div className="list">
          {users
            .filter((user) => user.id !== auth.id)
            .map((user: SelectedMember, index: number) => (
              <div onClick={(e) => !(e.target as HTMLDivElement).closest(".checkbox-container") && addMember(user)} className="item" key={index}>
                <div className="image-xl">
                  <img src={user.profile.imageUrl ? user.profile.imageUrl : "/defaultProfilePicture.jpg"} className="profile-pic" alt="Profile image" />
                </div>
                <span className="name text-clamp">{user.profile.name}</span>

                <label className="checkbox-container">
                  <input
                    checked={members.find((member) => member.id === user.id) ? true : false}
                    onChange={() => (members.find((member) => member.id === user.id) ? removeMember(user) : addMember(user))}
                    id="checkbox"
                    type="checkbox"
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
            ))}
        </div>

        <button onClick={handleCreateChat} className="button">
          Create
        </button>
      </div>
    </div>,
    modalRoot
  );
};

export default NewChat;
