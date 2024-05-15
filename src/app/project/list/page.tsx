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
  Link,
} from "basicui";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  getProjects,
  saveProject,
  deleteProject,
  editProject,
} from "./service";
import { Project } from "@/types/Project";
import { Authorization } from "@/types/Authorization";
import { AuthorizationState } from "@/store/AuthorizationStore";
import {
  PermissionType,
  useRouteAuthorization,
} from "@/lib/RouteAuthorizationHook";
import "../edit/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,
  faEye,
  faPlus,
  faCalendar,
  faDiagramProject,
  faSearch,
  faPenToSquare
} from "@fortawesome/free-solid-svg-icons";
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
  const [searchQuery, setSearchQuery] = useState('');
  const filteredData = data?.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          // const formattedDate = createdDate.toLocaleDateString("en-GB");
          const formattedDate=calculateTimeAgo(item.createdDate);
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
    const payload = {
      name: projectData.name,
    };
    editProject(payload, projectData?.id, authorization).then((response) => {
      console.log(response);
      setIsEditProjectDialogOpen(false);
      fetchProjects();
    });
  };

  const handleDeleteProject = () => {
    console.log("delete project by id");
    deleteProjectById(projectData?.id || "").then((response) => {
      // router.back();
    });
  };

  
  const calculateTimeAgo = (createdDate) => {
    const currentDate = new Date();
    const pastDate = new Date(createdDate);
    const millisecondsAgo= currentDate - pastDate;
    const daysAgo = Math.floor(millisecondsAgo / (1000 * 60 * 60 * 24));
    
    if (daysAgo >= 7) {
        const weeksAgo = Math.floor(daysAgo / 7);
        return "Created "+weeksAgo + " weeks ago";
    } else if(daysAgo == 0){
        return "New";
    } else 
        return daysAgo + " days ago";
}

  if (!isRouteAuthorized) {
    return <></>;
  }

  return (
    <>
      <div>
        <ContextBar title="Projects list">
          {/* <Button onClick={() => setIsNewProjectDialogOpen(true)}>
            New project
          </Button> */}
        </ContextBar>
        <div className="page">
        <div className="header_action">
          <h2>Projects</h2>
          <div className="input_search">
          <div className="search">
          <FontAwesomeIcon icon={faSearch} />
          <Input type="text" placeholder="Search" value={searchQuery}
             onChange={(e:any) => setSearchQuery(e.target.value)}/>
          </div>
          <div>
          <Button onClick={() => setIsNewProjectDialogOpen(true)}>
          <FontAwesomeIcon icon={faPlus} /> New project
          </Button>
          </div>
          </div>
          
          </div>
          <div className="listing_pages">
          {/* <div className="details_list"  >
                <h6>
                PROJECT NAME
                </h6>
                <div className="action_buttons">
                <h6>
                ACTION
                </h6>
                </div>
            </div> */}
          {filteredData?.map((item, index) => (
            <div className="details_list"  key={index}>
              <div className="details">
                <h5>
                  {item.name}
                </h5>
                <p className={item.createdDate === "New" ? "new_item" : "old_item"}>{item.createdDate}</p>
                </div>
                <div className="action_buttons">
              <Button  variant="outline" size="large" onClick={() => navigateToUsecase(item.id || "")}>
              <FontAwesomeIcon icon={faEye} size="sm" /> Usecases</Button>
                {/* <Button  size="large" onClick={() => {
                    setIsEditProjectDialogOpen(true);
                    setProjectData(item);
                  }}>
                <FontAwesomeIcon icon={faPenToSquare} size="sm" /> Edit
                 </Button> */}
              {/* <IconButton
                  className="icon_button"
                  circle={true}
                  onClick={() => {
                    setIsEditProjectDialogOpen(true);
                    setProjectData(item);
                  }}
                >
                  <FontAwesomeIcon icon={faPen} size="sm" />
                </IconButton> */}
                </div>
            </div>
          ))}
          </div>
          {/* <div className="listing_page">
            {data?.map((item, index) => (
              <div className="box cyan" key={index}>
                <h3>
                  {item.name}
                </h3>
                <p>test description of the project</p>
                
                <div className="card-footer">
                  <div className="card-meta">
                    <FontAwesomeIcon icon={faEye} />
                    23
                  </div>
                  <div className="card-meta">
                    <FontAwesomeIcon icon={faDiagramProject} />
                    50
                  </div>
                </div>
                <div className="card-footer">
                  <div className="card-meta">{item.createdBy}</div>
                  <div className="card-meta">
                    <FontAwesomeIcon icon={faCalendar} />
                    {item.createdDate}
                  </div>
                </div>
                <div className="action_buttons">
              <Button  size="large" onClick={() => navigateToUsecase(item.id || "")}>
                Usecases</Button>
              <IconButton
                  className="icon_button"
                  circle={true}
                  onClick={() => {
                    setIsEditProjectDialogOpen(true);
                    setProjectData(item);
                  }}
                >
                  <FontAwesomeIcon icon={faPen} size="sm" />
                </IconButton>
                </div>
              </div>
            ))}
            <div className="box dotted">
              <h3>Add Project</h3>
              <Button onClick={() => setIsNewProjectDialogOpen(true)}>
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </div>
          </div> */}
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
          <ModalFooter>
            <div className="editor_footer">
              <div className="footer_delete">
                <Button theme={ThemeType.danger} onClick={handleDelete}>
                  Delete
                </Button>
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
