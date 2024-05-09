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
import {
  editUseCaseById,
  getAllUseCases,
  getUseCaseById,
} from "../../list/service";
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
  Textarea
} from "basicui";
import ContextBar from "@/components/ContextBar/index";

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

  const handleChange = (event: any) => {
    setProjectData({
      ...projectData,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const updateUsecase = () => {
    editUseCaseById(
      searchParams.get("suiteId"),
      searchParams.get("id"),
      projectData,
      authorization
    ).then((response) => {
      fetchTestCases();
      setIsEditUsecaseDialogOpen(false)
    });
  };

  return (
    <>
      <div>
        <ContextBar title="Testcases">
          <Button onClick={() => setIsEditUsecaseDialogOpen(true)}>
            Edit Usecase
          </Button>
        </ContextBar>
        <div className="page">
          <div className="main-wrapper">
            <div className="cards">
              {/* <div className="information card">
            <span className="tag">hello</span>
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
          </div> */}
              {testCases.map((testCase) => (
                <div key={testCase.id} className="information card">
                  <span className="tag">{testCase.priority}</span>
                  <h2 className="title">{testCase.description}</h2>
                  <p className="info">{testCase.summary}</p>
                  <span className="components">{testCase.components}</span>
                  <dl className="details">
                    <div>
                      <dt>Labels</dt>
                      <dd>{testCase.labels}</dd>
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
      </div>
      <Modal
        isOpen={isEditUsecaseDialogOpen}
        onClose={() => setIsEditUsecaseDialogOpen(false)}
      >
        <ModalHeader
          onClose={() => setIsEditUsecaseDialogOpen(false)}
          heading="Edit usecase"
        />

        <ModalBody>
          <div className="new-project-dialog">
            <form className="project-detail-form">
              <Textarea
                label="Usecase"
                name="description"
                value={projectData?.description}
                onInput={handleChange}
              />
            </form>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button theme={ThemeType.primary} onClick={updateUsecase}>
            Save
          </Button>
          <Button onClick={() => setIsEditUsecaseDialogOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default testcases;
