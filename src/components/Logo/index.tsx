import React, { useEffect, useState } from "react";
import { useSelector, connect, useDispatch } from "react-redux";
import "./style.scss";
import mythosWhiteSmall from "../../images/mythos_white_small.svg";
import mythosWhiteText from "../../images/mythos_white_text.svg";
import mythosBlackSmall from "../../images/mythos_black_small.svg";
import mythosBlackText from "../../images/mythos_black_text.svg";
import mythosBlack from "../../images/mythos_black.svg";

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
          <img src={mythosBlackSmall} alt="Mythos logo" />
        )}
        {profile.theme === "basicui-dark" && (
          <img src={mythosWhiteSmall} alt="Mythos logo" />
        )}
      </div>
      {props.variant === "full" && (
        <div className="logo--text">
          {profile.theme === "basicui-light" && (
            <img src={mythosBlackText} alt="Mythos logo" />
          )}
          {profile.theme === "basicui-dark" && (
            <img src={mythosWhiteText} alt="Mythos logo" />
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
