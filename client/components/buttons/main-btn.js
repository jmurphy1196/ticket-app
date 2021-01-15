import { useEffect, createRef } from "react";

const Btn = ({ color, animated, onClick, type, children }) => {
  if (!color) color = "white";
  const btn = createRef();

  const handleBtnClick = () => {
    if (onClick) {
      onClick;
    }
  };

  useEffect(() => {
    btn.current.addEventListener("click", handleBtnClick);

    return () => {
      if (btn.current) {
        btn.current.removeEventListener("click", handleBtnClick, true);
      }
    };
  }, [btn, handleBtnClick]);

  return (
    <a
      ref={btn}
      type={type}
      href='#a'
      onClick={onClick}
      className={`btn btn--${color} ${animated && "btn--animated"}`}
    >
      {children}
    </a>
  );
};

export default Btn;
