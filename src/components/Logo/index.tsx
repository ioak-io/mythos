import React, { useEffect, useState } from 'react';
import './style.css';
import logoWhite from '@/svg/logo-no-background.svg';
import logoBlack from '@/svg/logo-black.svg';
import { DarkModeState } from '@/store/ProfileStore';
import { useRouter } from "next/navigation";

interface Props {
  black?: boolean;
}

const Logo = (props: Props) => {
  const router = useRouter();

  const navigateToHome = () => {
    router.push("/project/list");
  };

  return (
    <div className="logo">
      <div className="logo--image">
        {!props.black && (
          <img src={logoWhite.src} alt="Talentprobe logo" onClick={navigateToHome} />
        )}
        {props.black && (
          <img src={logoBlack.src} alt="Talentprobe logo" onClick={navigateToHome}/>
        )}
      </div>
    </div>
  );
};

export default Logo;
