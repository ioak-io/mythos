import React, { useEffect, useState } from "react";
import { useSelector, connect, useDispatch } from "react-redux";
import "./style.scss";
import testgenieWhiteSmall from "../../images/testgenie_white_small.svg";
import testgenieWhiteText from "../../images/testgenie_white_text.svg";
import testgenieBlackSmall from "../../images/testgenie_black_small.svg";
import testgenieBlackText from "../../images/testgenie_black_text.svg";
import testgenieBlack from "../../images/testgenie_black.svg";

interface Props {
  variant: "full" | "short";
}

const Logo = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);

  const profile = useSelector((state: any) => state.profile);

  const dispatch = useDispatch();

  return (
    <div className="logo">
      <div className="logo--image">
        {profile.theme === "basicui-light" && (
          <img src={testgenieBlackSmall} alt="Testgenie logo" />
        )}
        {profile.theme === "basicui-dark" && (
          <img src={testgenieWhiteSmall} alt="Testgenie logo" />
        )}
      </div>
      {props.variant === "full" && (
        <div className="logo--text">
          {profile.theme === "basicui-light" && (
            <img src={testgenieBlackText} alt="Testgenie logo" />
          )}
          {profile.theme === "basicui-dark" && (
            <img src={testgenieWhiteText} alt="Testgenie logo" />
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
