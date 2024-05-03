"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Usecases from "../../list/page";
import "./style.css";
import { Authorization } from "@/types/Authorization";
import { AuthorizationState } from "@/store/AuthorizationStore";
import {
  PermissionType,
  useRouteAuthorization,
} from "@/lib/RouteAuthorizationHook";
import {
  redirect,
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import { Project } from "@/types/Project";
import { getAllUseCases, getUseCaseById } from "../../list/service";
import { getTestcases } from "./service";
import { TestCase } from "@/types/TestCase";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ThemeType,
  IconButton,
} from "basicui";

const testcases = () => {
  const { hasPermissions, isRouteAuthorized } = useRouteAuthorization("1");
  useLayoutEffect(() => {
    hasPermissions([PermissionType.USER]);
  }, []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [suiteId, setSuiteId] = useState<any>();
  const [data, setData] = useState<Project[]>();
  const [authorization, setAuthorization] = useState<Authorization>({});
  const [projectData, setProjectData] = useState<Project>({
    description: "",
  });
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isEditUsecaseDialogOpen, setIsEditUsecaseDialogOpen] =
    useState<any>(false);

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      console.log(message);
      setAuthorization(message);
    });
  }, []);

  useEffect(() => {
    if (searchParams.has("id")) {
      fetchUseCaseById();
      fetchTestCases();
    }
  }, [authorization, searchParams]);

  const fetchUseCaseById = () => {
    console.log(authorization);
    if (authorization.isAuth) {
      getUseCaseById(
        searchParams.get("suiteId"),
        searchParams.get("id"),
        authorization
      ).then((response) => {
        setProjectData(response);
      });
    }
  };

  const fetchTestCases = () => {
    if (authorization.isAuth) {
      getTestcases(
        searchParams.get("suiteId"),
        searchParams.get("id"),
        authorization
      ).then((response) => {
        setTestCases(response);
      });
    }
  };

  return (
    <>
      <div className="page">
        <div className="main-wrapper">
          <h4>Testcases</h4>
          <div className="cards">
            <div className="information card">
              <h2 className="title">testCase.description</h2>
              <p className="info">testCase.summary</p>
              <dl className="details">
                <div>
                  <dt>Priority</dt>
                  <dd>testCase.priority</dd>
                </div>
                <div>
                  <dt>Comments</dt>
                  <dd>testCase.comments</dd>
                </div>
              </dl>
            </div>
            {testCases.map((testCase) => (
              <div key={testCase.id} className="information card">
                <h2 className="title">{testCase.description}</h2>
                <p className="info">{testCase.summary}</p>
                <dl className="details">
                  <div>
                    <dt>Priority</dt>
                    <dd>{testCase.priority}</dd>
                  </div>
                  <div>
                    <dt>Comments</dt>
                    <dd>{testCase.comments}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditUsecaseDialogOpen}
        onClose={() => setIsEditUsecaseDialogOpen(false)}
      >
        <ModalHeader
          onClose={() => setIsEditUsecaseDialogOpen(false)}
          heading="Edit project"
        />

        <ModalBody>
          <div className="new-project-dialog">
            <form className="project-detail-form">
              <Input
                label="Project name"
                name="name"
                value={projectData?.name}
              />
            </form>
          </div>
        </ModalBody>
        <div className="editor_footer_container">
          <ModalFooter>
            <div className="editor_footer">
              <div className="footer_delete">
                <Button theme={ThemeType.danger}>Delete</Button>
              </div>
              <div className="footer_save">
                <Button theme={ThemeType.primary}>Save</Button>
                <Button onClick={() => setIsEditUsecaseDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </ModalFooter>
        </div>
      </Modal>
    </>
  );
};

export default testcases;
