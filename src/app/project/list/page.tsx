"use client";

import ContextBar from "@/components/ContextBar";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ThemeType,
} from "basicui";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { getProjects, saveProject } from "./service";
import { Project } from "@/types/Project";
import { Authorization } from "@/types/Authorization";
import { AuthorizationState } from "@/store/AuthorizationStore";
import {
  PermissionType,
  useRouteAuthorization,
} from "@/lib/RouteAuthorizationHook";
import "../edit/style.css";

const ListProjectPage = () => {
  const { hasPermissions, isRouteAuthorized } = useRouteAuthorization("1");
  useLayoutEffect(() => {
    hasPermissions([PermissionType.USER]);
  }, []);
  const [authorization, setAuthorization] = useState<Authorization>({});

  const router = useRouter();
  const [data, setData] = useState<Project[]>();
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [newAssignmentForm, setNewAssignmentForm] = useState<Project>({
    name: "",
    createdBy: "",
  });

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      setAuthorization(message);
    });
  }, []);

  useEffect(() => {
    setNewAssignmentForm({
      name: "",
      createdBy: sessionStorage.getItem("email"),
    });
  }, [isNewProjectDialogOpen]);

  const handleChange = (event: any) => {
    setNewAssignmentForm({
      ...newAssignmentForm,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSaveNewAssignment = () => {
    saveProject(newAssignmentForm).then((response: any) => {
      setIsNewProjectDialogOpen(false);
      fetchProjects();
    });
  };

  const manageProject = (id: string) => {
    router.push(`/project/edit?id=${id}`);
  };

  const handleKeydown = (event: any, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      manageProject(id);
    }
  };

  useEffect(() => {
    if (authorization.isAuth) {
      fetchProjects();
    }
  }, [authorization]);

  const fetchProjects = () => {
    getProjects(authorization).then((response: any) => {
      setData(response);
    });
  };

  if (!isRouteAuthorized) {
    return <></>;
  }

  return (
    <>
      <div>
        <ContextBar title="Projects list">
          <Button onClick={() => setIsNewProjectDialogOpen(true)}>
            New project
          </Button>
        </ContextBar>
        <div className="page">
          <table className="basicui-table theme-default table-hover">
            <thead>
              <tr>
                <th>Project name</th>
                <th>Created on</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr
                  key={index}
                  tabIndex={0}
                  onKeyDown={(event) => handleKeydown(event, item.id || "")}
                >
                  <td>{item.name}</td>
                  <td>{item.createdDate}</td>
                  <td><div className="action_icons">
                    <span onClick={() => manageProject(item.id || "")}><svg
                      width="16px"
                      height="16px"
                      viewBox="0 0 16 16"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <g
                        id="Assistent"
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                      >
                        <g
                          id="Artboard"
                          transform="translate(-189.000000, -175.000000)"
                        >
                          <g
                            id="icon/edit"
                            transform="translate(189.000000, 175.000000)"
                          >
                            <polygon
                              id="Path"
                              points="0 0 16 0 16 16 0 16"
                            ></polygon>
                            <path
                              d="M0,12.6671296 L0,16 L3.33287043,16 L13.1626163,6.17025413 L9.82974587,2.8373837 L0,12.6671296 Z M15.7400361,3.59283433 C16.0866546,3.2462158 16.0866546,2.68629357 15.7400361,2.33967505 L13.660325,0.259963894 C13.3137064,-0.0866546313 12.7537842,-0.0866546313 12.4071657,0.259963894 L10.7807249,1.88640467 L14.1135953,5.2192751 L15.7400361,3.59283433 Z"
                              id="Shape"
                              fill="#FFFFFF"
                              fill-rule="nonzero"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                    </span>
                    <svg
                      width="12px"
                      height="16px"
                      viewBox="0 0 12 16"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <g
                        id="Assistent"
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                      >
                        <g
                          id="Artboard"
                          transform="translate(-231.000000, -175.000000)"
                        >
                          <g
                            id="icon/delete"
                            transform="translate(229.000000, 175.000000)"
                          >
                            <polygon
                              id="Path"
                              points="0 0 16 0 16 16 0 16"
                            ></polygon>
                            <path
                              d="M2.85714286,14.2222222 C2.85714286,15.2 3.62857143,16 4.57142857,16 L11.4285714,16 C12.3714286,16 13.1428571,15.2 13.1428571,14.2222222 L13.1428571,3.55555556 L2.85714286,3.55555556 L2.85714286,14.2222222 Z M14,0.888888889 L11,0.888888889 L10.1428571,0 L5.85714286,0 L5,0.888888889 L2,0.888888889 L2,2.66666667 L14,2.66666667 L14,0.888888889 Z"
                              id="Shape"
                              fill="#FFFFFF"
                              fill-rule="nonzero"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={isNewProjectDialogOpen}
        onClose={() => setIsNewProjectDialogOpen(false)}
      >
        <ModalHeader
          onClose={() => setIsNewProjectDialogOpen(false)}
          heading="Create new project"
        />

        <ModalBody>
          <div className="new-project-dialog">
            <Input
              name="name"
              value={newAssignmentForm.name}
              label="Project name"
              onInput={handleChange}
              autoFocus
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button theme={ThemeType.primary} onClick={handleSaveNewAssignment}>
            Save
          </Button>
          <Button onClick={() => setIsNewProjectDialogOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ListProjectPage;
