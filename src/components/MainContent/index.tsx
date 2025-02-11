import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./style.scss";

import BodyContainer from "../App/BodyContainer";
import { useLocation, useNavigate } from "react-router-dom";
import { AppShell } from "basicui";

import logoIconWhite from "../../images/mythos_white_small.svg";
import logoTextWhite from "../../images/mythos_white_text.svg";
import logoIconBlack from "../../images/mythos_black_small.svg";
import logoTextBlack from "../../images/mythos_black_text.svg";
import SideNavLink from "./SideNavLink";
import {
  faBook,
  faCircleNodes,
  faCogs,
  faDatabase,
  faFolderOpen,
  faListUl,
  faPalette,
  faPlus,
  faPuzzlePiece,
  faSearch,
  faStrikethrough,
  faTh,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import SideNavSubHeading from "./SideNavSubHeading";
import { setProfile } from "../../store/actions/ProfileActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { removeSessionValue } from "../../utils/SessionUtils";
import { removeAuth } from "../../store/actions/AuthActions";
import MobileSidebar from "../MobileSidebar";

interface Props {
  space: string;
}

const MainContent = (props: Props) => {
  const navigate = useNavigate();
  const profile = useSelector((state: any) => state.profile);
  const authorization = useSelector((state: any) => state.authorization);
  const dispatch = useDispatch();
  const location = useLocation();

  const toggleMode = () => {
    dispatch(
      setProfile({
        theme:
          profile.theme === "basicui-dark" ? "basicui-light" : "basicui-dark",
      })
    );

    sessionStorage.setItem(
      "fortuna_pref_profile_colormode",
      profile.theme === "basicui-dark" ? "basicui-light" : "basicui-dark"
    );
  };

  const chooseCompany = () => {
    navigate("/home");
  };

  const toggleSidebar = () => {
    sessionStorage.setItem(
      "mythos_pref_sidebar_status",
      profile.sidebar ? "collapsed" : "expanded"
    );

    dispatch(setProfile({ ...profile, sidebar: !profile.sidebar }));
  };

  const logout = () => {
    dispatch(removeAuth());
    removeSessionValue(`mythos-access_token`);
    removeSessionValue(`mythos-refresh_token`);
    navigate(`/`);
  };

  const login = (type: string) => {
    navigate("/login");
  };

  return (
    <AppShell
      isDarkMode={profile.theme === "basicui-dark"}
      isSidebarExpanded={profile.sidebar}
      onSidebarToggle={toggleSidebar}
      onSignin={login}
      onSignout={logout}
      onDarkModeToggle={toggleMode}
      logoIconBlack={logoIconBlack}
      logoIconWhite={logoIconWhite}
      logoTextBlack={logoTextBlack}
      logoTextWhite={logoTextWhite}
      hideNavbar={
        location.pathname === "/login" ||
        location.pathname.startsWith("/confirm-email") ||
        location.pathname.startsWith("/reset-password")
      }
      location={location}
    >
      <AppShell.Navbar>
        <AppShell.Navbar.Header>
          <div className="side-content__header__button">
            <button className="button" onClick={chooseCompany}>
              <FontAwesomeIcon icon={faTh} />
            </button>
          </div>
        </AppShell.Navbar.Header>
        <AppShell.Navbar.Body>
          {/* <SideContent space={props.space} /> */}
          {props.space && (
            <>
              <SideNavSubHeading short="Main" long="Main" />
              <SideNavLink
                link={`/${props.space}/application`}
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
        </AppShell.Navbar.Body>
        <AppShell.Navbar.Footer />
      </AppShell.Navbar>
      <AppShell.Topbar />
      <AppShell.MobileNavbar>
        <AppShell.MobileNavbar.Body>
          <MobileSidebar space={props.space} />
        </AppShell.MobileNavbar.Body>
        <AppShell.MobileNavbar.Footer>Footer</AppShell.MobileNavbar.Footer>
      </AppShell.MobileNavbar>
      <AppShell.Body>
        <BodyContainer {...props} />
      </AppShell.Body>
    </AppShell>
  );
};

export default MainContent;
