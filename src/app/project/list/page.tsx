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
  IconButton,
} from "basicui";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { faPen, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import { Card, CardContent, Typography } from "@mui/material";
import { Box, Grid } from "@mui/material";
import "./style.css";
import EditProjectPage from "../edit/page";
import { deleteProjectById, saveProjectById } from "../edit/service";

const ListProjectPage = () => {
  const { hasPermissions, isRouteAuthorized } = useRouteAuthorization("1");
  useLayoutEffect(() => {
    hasPermissions([PermissionType.USER]);
  }, []);
  const [authorization, setAuthorization] = useState<Authorization>({});

  const router = useRouter();
  const [data, setData] = useState<Project[]>();
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [projectData, setProjectData] = useState<Project>({
    name: "",
  });
  const [newAssignmentForm, setNewAssignmentForm] = useState<Project>({
    name: "",
    createdBy: "",
  });
  const editProjectRef = useRef();

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      console.log(message);
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
    saveProject(newAssignmentForm, authorization).then((response: any) => {
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

  const handleDelete = () => {
    deleteProject(projectData.id, authorization).then((response) => {
      setIsEditProjectDialogOpen(false);
      fetchProjects();
    });
  };

  const navigateToUsecase = (suiteId: string) => {
    router.push(`/project/usecase/list/?suiteId=${suiteId}`);
  };

  useEffect(() => {
    if (authorization.isAuth) {
      fetchProjects();
    }
  }, [authorization]);

  const fetchProjects = () => {
    getProjects(authorization).then((response: any) => {
      console.log(response);
      const convertedData = response.map(
        (item: { createdDate: string | number | Date }) => {
          const createdDate = new Date(item.createdDate);
          const formattedDate = createdDate.toLocaleDateString("en-GB");
          return {
            ...item,
            createdDate: formattedDate,
          };
        }
      );
      setData(convertedData);
    });
  };

  // const updateProject = () =>{
  //   editProjectRef?.current?.updateProject();
  // }

  const handleProjectDataChange = (event: any) => {
    setProjectData({
      ...projectData,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };


  const updateProject = () => {
    console.log(authorization)
    saveProjectById(projectData?.id || "", projectData,authorization).then(
      (response) => {
        console.log(response)
        setIsEditProjectDialogOpen(false);
        fetchProjects();
      }
    );
  };

  const handleDeleteProject = () => {
    console.log("delete project by id")
    deleteProjectById(projectData?.id || "").then((response) => {
      // router.back();
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
          {/* <table className="basicui-table theme-default table-hover">
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
          </table> */}
          <div className="listing_page">
            <Grid container spacing={2} sx={{ height: "150px" }}>
              {data?.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card variant="outlined">
                  <CardContent>
                  <IconButton
                          className="icon_button"
                          circle={true}
                          onClick={() => {
                            setIsEditProjectDialogOpen(true);
                            setProjectData(item)
                          }}
                        >
                          <FontAwesomeIcon icon={faPen} size="0.1x"/>
                        </IconButton>
                      <Typography variant="h6" component="div" className="project_title">
                        <a onClick={() => navigateToUsecase(item.id || "")}>
                          {item.name}
                        </a>
                      </Typography>
                      <Typography variant="body2">
                        Created on: {item.createdDate}
                      </Typography>
                      <Typography variant="body2">
                        Number of use cases: 2 <br />
                        Number of test cases: 12
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
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

      <Modal
        isOpen={isEditProjectDialogOpen}
        onClose={() => setIsEditProjectDialogOpen(false)}
      >
        <ModalHeader
          onClose={() => setIsEditProjectDialogOpen(false)}
          heading="Edit project"
        />

        <ModalBody>
          <div className="new-project-dialog">
            {/* <EditProjectPage ref={editProjectRef} data={isEditProjectId} auth={authorization}></EditProjectPage> */}
            <form className="project-detail-form">
                <Input
                  label="Project name"
                  name="name"
                  value={projectData?.name}
                  onInput={handleProjectDataChange}
                />
              </form>
          </div>
        </ModalBody>
        <div className="editor_footer_container">
        <ModalFooter >
          <div className="editor_footer">
          <div className="footer_delete">
          <Button theme={ThemeType.danger}  onClick={handleDelete}>Delete</Button>
          </div>
          <div className="footer_save">
          <Button theme={ThemeType.primary} onClick={updateProject}>
            Save
          </Button>
          <Button onClick={() => setIsEditProjectDialogOpen(false)}>
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

export default ListProjectPage;
