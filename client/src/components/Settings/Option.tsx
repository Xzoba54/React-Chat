import { useState } from "react";

type Props = {
  title: string;
  value: boolean;
  handleOnClick: (val: boolean) => void;
};

const Option = ({ title, value, handleOnClick }: Props) => {
  const [checked, setChecked] = useState<boolean>(value);

  return (
    <div className="option">
      <div className="name">{title}</div>

      <label className="switch" onClick={() => handleOnClick(!checked)}>
        <input checked={checked} onChange={() => setChecked((prev) => !prev)} type="checkbox" hidden />
        <span className="slider" />
      </label>
    </div>
  );
};

export default Option;
