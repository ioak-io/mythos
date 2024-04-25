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
  IconButton
} from "basicui";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { getProjects, saveProject, deleteProject } from "./service";
import { Project } from "@/types/Project";
import { Authorization } from "@/types/Authorization";
import { AuthorizationState } from "@/store/AuthorizationStore";
import { SuiteIdState } from "@/store/AuthorizationStore";
import {
  PermissionType,
  useRouteAuthorization,
} from "@/lib/RouteAuthorizationHook";
import "../edit/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,faEye
} from "@fortawesome/free-solid-svg-icons";

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
      console.log(message)
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
    saveProject(newAssignmentForm,authorization).then((response: any) => {
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


  const handleDelete = async (id:string,) => {
    console.log(id)
    deleteProject(id, authorization).then((response) => {
      fetchProjects();
    });
  };

  const navigateToUsecase = (suiteId: string) => {
    router.push(`/project/usecase/list/?suiteId=${suiteId}`)
  };

  useEffect(() => {
    if (authorization.isAuth) {
      fetchProjects();
    }
  }, [authorization]);

  const fetchProjects = () => {
    getProjects(authorization).then((response: any) => {
      console.log(response);
      const convertedData = response.map((item: { createdDate: string | number | Date; }) => {
        const createdDate = new Date(item.createdDate);
        const formattedDate = createdDate.toLocaleDateString('en-GB');
        return {
            ...item,
            createdDate: formattedDate
        };
    });
      setData(convertedData);
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
                <th></th>
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
                  <IconButton circle={true} onClick={() => navigateToUsecase(item.id || "")}>
                    <FontAwesomeIcon
                      icon={faEye} size="1x"
                    />
                    </IconButton>
                    <IconButton circle={true} onClick={() => manageProject(item.id || "")}>
                    <FontAwesomeIcon
                      icon={faPen} size="2x"
                    />
                    </IconButton>
                    <IconButton circle={true} onClick={() => handleDelete(item.id || "")}>
                    <FontAwesomeIcon
                      icon={faTrash} size="-1x"
                    />
                    </IconButton>
                    
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
