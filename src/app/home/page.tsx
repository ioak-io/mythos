"use client";

import ContextBar from "@/components/ContextBar";
import {
  Button,
  ButtonVariantType,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ThemeType,
} from "basicui";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faPlus,
  faCheck,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { Authorization } from "@/types/Authorization";
import { AuthorizationState } from "@/store/AuthorizationStore";
import {
  PermissionType,
  useRouteAuthorization,
} from "@/lib/RouteAuthorizationHook";
import "./style.css";

const HomePage = () => {
  const { hasPermissions, isRouteAuthorized } = useRouteAuthorization("1");
  useLayoutEffect(() => {
    hasPermissions([PermissionType.USER]);
  }, []);
  const [authorization, setAuthorization] = useState<Authorization>({});

  const router = useRouter();

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      setAuthorization(message);
    });
  }, []);

  const handleEditAssessmentDetail = (id: string) => {
    router.push(`/assessment/edit?id=${id}`);
  };

  useEffect(() => {
    if (authorization.isAuth) {
    }
  }, [authorization]);

  if (!isRouteAuthorized) {
    return <></>;
  }

  return (
    <>
      <div>
        {/* <ContextBar title="Home"></ContextBar> */}
        <div className="page">
          <div className="module_list">
            <div className="home-tile">
              <div>
                <div className="button-heading">Start generating tests</div>
                <div className="button-description">
                  <p>Generate regression test cases based on the use cases that describe the application.</p>
                  <p>Test cases generated are detailed and compliant to usual test case standards.</p>
                </div>
              </div>
              <Button
                // theme={ThemeType.primary}
                variant={ButtonVariantType.outline}
                onClick={() => router.push("/project/list")}
              >
                <FontAwesomeIcon icon={faArrowRight} />
                Start
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
