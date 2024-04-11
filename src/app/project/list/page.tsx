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

const ListProjectPage = () => {
  const { hasPermissions, isRouteAuthorized } = useRouteAuthorization("1");
  useLayoutEffect(() => {
    hasPermissions([PermissionType.USER]);
  }, []);
  const [authorization, setAuthorization] = useState<Authorization>({});
  
  const router = useRouter();
  const [data, setData] = useState<Project[]>();
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] =
    useState(false);
  const [newAssignmentForm, setNewAssignmentForm] = useState<Project>({
    name: "",
    createdBy :""
  });

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      setAuthorization(message);
    });
  }, []);

  useEffect(() => {
    setNewAssignmentForm({ name: "",createdBy:sessionStorage.getItem('email')});
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
                <th>Status</th>
                <th>Responses</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr
                  key={index}
                  tabIndex={0}
                  onClick={() => manageProject(item.id || "")}
                  onKeyDown={(event) => handleKeydown(event, item.id || "")}
                >
                  <td>{item.name}</td>
                  <td>{item.createdDate}</td>
                  <td>{item.status}</td>
                  <td>{5}</td>
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
