"use client";

import Link from "next/link";
import "./style.css";
import {
  Button,
  IconButton,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ThemeType,
} from "basicui";
import { DarkModeState } from "@/store/ProfileStore";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faRightFromBracket, faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { AuthorizationState } from "@/store/AuthorizationStore";
import { Authorization } from "@/types/Authorization";
import Logo from "../Logo";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [authorization, setAuthorization] = useState<Authorization>({});
  const router = useRouter();

  useEffect(() => {
    DarkModeState.subscribe((message) => {
      setDarkMode(message);
    });
  }, []);

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      console.log(message)
      setAuthorization(message);
    });
  }, []);

  const toggleDarkMode = () => {
    DarkModeState.next(!DarkModeState.value);
  };

  const logout = () => {
    sessionStorage.clear();
    AuthorizationState.next({});
    router.push("/login");
    setIsLogoutDialogOpen(false)
  };

  return (
    <>
      <nav className="navbar">
      <Logo />
      {authorization?.isAuth && (
        <><ul>
          </ul><div className="navbar_right">
              <div>
                {darkMode && (
                  <IconButton onClick={toggleDarkMode} circle={true}>
                    <FontAwesomeIcon icon={faSun} size="xs" />
                  </IconButton>
                )}
                {!darkMode && (
                  <IconButton onClick={toggleDarkMode} circle={true}>
                    <FontAwesomeIcon icon={faMoon} size="xs" />
                  </IconButton>
                )}
              </div>
              <div className="logout">
                <IconButton onClick={() => setIsLogoutDialogOpen(true)} circle={true}>
                  <FontAwesomeIcon icon={faPowerOff} size="xs" />
                </IconButton>
              </div>
            </div></>
         )}
      </nav>
      <Modal
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
      >
        <ModalHeader
          onClose={() => setIsLogoutDialogOpen(false)}
          heading="Confirm Logout"
        />

        <ModalBody>
          <div className="new-project-dialog">
            <p>Are you sure you want to log out?</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button theme={ThemeType.primary} onClick={logout}>
            Confirm
          </Button>
          <Button onClick={() => setIsLogoutDialogOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Navbar;
