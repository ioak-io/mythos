import React, { useEffect, useState } from "react";
import { useSelector, connect, useDispatch } from "react-redux";

import "./style.scss";

import { Profile } from "../Types/GeneralTypes";
import { receiveMessage, sendMessage } from "../../events/MessageService";

import Header from "./Header";
import NavElements from "./NavElements";
import Portal from "./Portal";
import DarkModeIcon from "../Navigation/DarkModeIcon";
import {
  faBalanceScaleRight,
  faBook,
  faCalendarAlt,
  faChartBar,
  faCircleNodes,
  faCogs,
  faCoins,
  faCopy,
  faDatabase,
  faFingerprint,
  faFolderOpen,
  faListUl,
  faMoneyBillWave,
  faPalette,
  faPlus,
  faPuzzlePiece,
  faReceipt,
  faSearch,
  faSignOutAlt,
  faStrikethrough,
  faTags,
  faTh,
  faUserShield,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import SideNavLink from "../MainContent/SideNavLink";
import SideNavSubHeading from "../MainContent/SideNavSubHeading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../Logo";
import { removeSessionValue } from "../../utils/SessionUtils";
import { removeAuth } from "../../store/actions/AuthActions";
import { useNavigate, useParams } from "react-router-dom";

export type MobileSidebarProps = {
  space?: string;
};

const MobileSidebar = (props: MobileSidebarProps) => {
  const params = useParams();
  const profile = useSelector((state: any) => state.profile);
  const authorization = useSelector((state: any) => state.authorization);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = (
    event: any,
    type = "success",
    message = "You have been logged out"
  ) => {
    dispatch(removeAuth());
    removeSessionValue(`mythos-access_token`);
    removeSessionValue(`mythos-refresh_token`);
    navigate(`/`);
  };

  const login = (type: string) => {
    navigate("/login");
  };

  return (
    <div className="side-content__menu">
      {props.space && (
        <>
          <SideNavSubHeading short="Main" long="Main" />
              <SideNavLink
                link={`/${props.space}/applications`}
                icon={faFolderOpen}
                label="Applications"
              />
              <SideNavSubHeading short="System" long="System" />
              <SideNavLink
                link={`/${props.space}/settings/company`}
                icon={faCogs}
                label="Company setting"
              />
              <SideNavLink
                link={`/${props.space}/settings/user`}
                icon={faUserShield}
                label="User"
              />
              <SideNavLink
                link={`/${props.space}/settings/backup`}
                icon={faDatabase}
                label="Backup and restore"
              />
        </>
      )}
    </div>
  );
};

export default MobileSidebar;
