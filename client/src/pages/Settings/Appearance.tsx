import { useState } from "react";
import { colors } from "../../utils/colors";
import Option from "../../components/Settings/Option";

const Appearance = () => {
  const [activeColor, setActiveColor] = useState<string>(document.documentElement.style.getPropertyValue("--color-custom-theme"));

  const getValue = (key: string): boolean => {
    const value = localStorage.getItem(key);

    if (value === "true") return true;
    else return false;
  };

  const transparentBackground = getValue("transparent-background");

  const setAppTheme = (color: string) => {
    document.documentElement.style.setProperty("--color-custom-theme", color);
    setActiveColor(color);
  };

  const handleTransparentBackground = (value: boolean) => {
    if (value === true) {
      document.body.classList.add("background-image");
    } else {
      document.body.classList.remove("background-image");
    }

    localStorage.setItem("transparent-background", value ? "true" : "false");
  };

  return (
    <div className="settings-page appearance">
      <div className="group">
        <div className="title">Theme</div>

        <div className="list">
          {colors.map((color: string, index: number) => (
            <div onClick={() => setAppTheme(color)} className={`${activeColor === color ? "active" : ""} item`} style={{ backgroundColor: color }} key={index} />
          ))}
        </div>
      </div>

      <div className="group">
        <div className="title">Style</div>

        <Option value={transparentBackground} handleOnClick={handleTransparentBackground} title="Transparent background" />
      </div>
    </div>
  );
};

export default Appearance;
