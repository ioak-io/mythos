import React, { useEffect, useState } from 'react';
import './style.css';
import logoWhite from '@/svg/logo-no-background.svg';
import logoBlack from '@/svg/logo-black.svg';
import { DarkModeState } from '@/store/ProfileStore';

interface Props {
  black?: boolean;
}

const Logo = (props: Props) => {

  return (
    <div className="logo">
      <div className="logo--image">
        {!props.black && (
          <img src={logoWhite.src} alt="Talentprobe logo" />
        )}
        {props.black && (
          <img src={logoBlack.src} alt="Talentprobe logo" />
        )}
      </div>
    </div>
  );
};

export default Logo;
