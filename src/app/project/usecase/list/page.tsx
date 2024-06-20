"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import ContextBar from "@/components/ContextBar";
import {
  Button,
  Input,
  Textarea,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ThemeType,
  IconButton,
  Table,
} from "basicui";
import {
  redirect,
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import { Project } from "@/types/Project";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faEye,
  faPlus,
  faCircleCheck,
  faMagicWandSparkles,
  faBug,
  faBugs,
  faSpider,
} from "@fortawesome/free-solid-svg-icons";
import {
  deleteUseCase,
  editUseCaseById,
  generateConsolidatedTestcase,
  getAllUseCases,
  getConsolidatedTestcases,
  getUseCaseById,
  saveUseCase,
} from "./service";
import { Authorization } from "@/types/Authorization";
import { AuthorizationState } from "@/store/AuthorizationStore";
import {
  PermissionType,
  useRouteAuthorization,
} from "@/lib/RouteAuthorizationHook";
import ExportDropdown from "../export/page";
import { deleteProject, editProject, getProjects } from "../../list/service";

const Usecases = () => {
  const { hasPermissions, isRouteAuthorized } = useRouteAuthorization("1");
  useLayoutEffect(() => {
    hasPermissions([PermissionType.USER]);
  }, []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [suiteId, setSuiteId] = useState<any>();
  const [data, setData] = useState<Project[]>();
  const [authorization, setAuthorization] = useState<Authorization>({});
  const [isDeleteUsecaseDialogOpen, setIsDeleteUsecaseDialogOpen] =
    useState(false);
  const [isNewUsecaseDialogOpen, setIsNewUsecaseDialogOpen] = useState(false);
  const [isEditUsecaseDialogOpen, setIsEditUsecaseDialogOpen] = useState(false);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [useCaseToEdit, setUseCaseToEdit] = useState<Project>({
    description: "",
    id: "",
  });
  const [toDeleteUsecaseId, setToDeleteUsecaseId] = useState("");
  const [newUsecaseForm, setNewUsecaseForm] = useState<any>({
    description: "",
  });
  const [projectData, setProjectData] = useState<Project>({
    name: "",
  });
  const [projects, setProjects] = useState<Project[]>();
  const classNameTable = data?.length === 0 ? "empty-table" : "data-table";

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      console.log(message);
      setAuthorization(message);
    });
  }, []);

  useEffect(() => {
    setSuiteId(searchParams.get("suiteId"));
    if (searchParams.get("suiteId")) {
      fetchUseCases();
    }
  }, [authorization, searchParams]);

  const fetchUseCases = () => {
    if (authorization.isAuth) {
      getAllUseCases(searchParams.get("suiteId"), authorization).then(
        (response: any) => {
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
        }
      );
    }
  };

  const navigateToTestcase = (id: string) => {
    router.push(`testcase/list?id=${id}&suiteId=${suiteId}`);
  };

  const navigateToConsolidatedTestcase = () => {
    router.push(`testcase/consolidatedlist?suiteId=${suiteId}`);
  };

  const manageUseCase = (item: any) => {
    // router.push(`/project/usecase?id=${id}&suiteId=${suiteId}`);
    setIsEditUsecaseDialogOpen(true);
    fetchUseCaseById(item.id);
  };

  const handleDelete = () => {
    deleteUseCase(suiteId, toDeleteUsecaseId, authorization).then(
      (response) => {
        fetchUseCases();
        setIsDeleteUsecaseDialogOpen(false);
      }
    );
  };

  const confirmDelete = (useCaseId: string) => {
    setIsDeleteUsecaseDialogOpen(true);
    setToDeleteUsecaseId(useCaseId);
  };

  const handleChange = (event: any) => {
    setNewUsecaseForm({
      ...newUsecaseForm,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSaveNewUsecase = () => {
    saveUseCase(suiteId, newUsecaseForm, authorization).then(
      (response: any) => {
        setIsNewUsecaseDialogOpen(false);
        fetchUseCases();
        setNewUsecaseForm({ description: "" });
      }
    );
  };

  const handleUsecaseChange = (event: any) => {
    setUseCaseToEdit({
      ...useCaseToEdit,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const fetchUseCaseById = (id: string) => {
    if (authorization.isAuth) {
      getUseCaseById(suiteId, id, authorization).then((response) => {
        setUseCaseToEdit(response);
      });
    }
  };

  const updateUsecase = () => {
    editUseCaseById(
      suiteId,
      useCaseToEdit?.id,
      useCaseToEdit,
      authorization
    ).then((response) => {
      fetchUseCases();
      setIsEditUsecaseDialogOpen(false);
    });
  };

  useEffect(() => {
    if (authorization.isAuth) {
      fetchProjects();
    }
  }, [authorization]);

  const fetchProjects = () => {
    getProjects(authorization).then((response: any) => {
      console.log(response);
      setProjects(response);
    });
  };

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
    });
  };

  const getProjectData = () => {
    setProjectData(projects?.find((project) => project.id === suiteId));
    console.log(projectData);
    setIsEditProjectDialogOpen(true);
  };

  const handleProjectDelete = () => {
    deleteProject(projectData.id, authorization).then((response) => {
      setIsEditProjectDialogOpen(false);
      router.back();
    });
  };

  const generateTestcaseForSuite = (suiteId: any) => {
    generateConsolidatedTestcase(suiteId, authorization).then(
      (response: any) => {
        console.log(response);
      }
    );
  };

  if (!isRouteAuthorized) {
    return <></>;
  }

  return (
    <>
      <div>
        <ContextBar title="Usecase list">
          {data?.length != 0 && (
            <>
              <ExportDropdown suiteId={suiteId}></ExportDropdown>
              <Button onClick={getProjectData}>
                <FontAwesomeIcon icon={faPen} /> Edit Project
              </Button>
              <div className="usecase_action">
                <Button onClick={() => setIsNewUsecaseDialogOpen(true)}>
                  <FontAwesomeIcon icon={faPlus} /> Add Usecase
                </Button>
              </div>
            </>
          )}
        </ContextBar>
        <div className="page">
          {data?.length != 0 && (
            <div className="usecase_action">
              {/* <Button variant="outline" size="large" onClick={() => generateTestcaseForSuite(suiteId)} >
          <FontAwesomeIcon icon={faMagicWandSparkles} /> Generate Testcases
          </Button> */}
              <Button
                variant="outline"
                size="medium"
                onClick={() => navigateToConsolidatedTestcase()}
              >
                <FontAwesomeIcon icon={faSpider} /> All Tests
              </Button>
            </div>
          )}
          <table
            className={`basicui-table theme-default table-hover usecase-table ${classNameTable}`}
          >
            <thead>
              <tr>
                <th>Usecase</th>
                <th>Created on</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr key={index} tabIndex={0}>
                  <td>{item.description}</td>
                  <td>{item.createdDate}</td>
                  <td>
                    <div className="action_icons">
                      <Button
                        variant="outline"
                        size="large"
                        onClick={() => navigateToTestcase(item.id || "")}
                      >
                        <FontAwesomeIcon icon={faBug} size="sm" /> Tests
                      </Button>
                      {/* <IconButton circle={true} variant="outline" onClick={() => navigateToTestcase(item.id || "")}>
                    <FontAwesomeIcon
                      icon={faEye}
                    />
                    </IconButton> */}
                      {/* <IconButton circle={true} variant="fill" onClick={() => manageUseCase(item || "")}>
                    <FontAwesomeIcon className='edit_icon'
                      icon={faPenToSquare} 
                    />
                    </IconButton> */}
                      {/* <IconButton circle={true} variant="outline" onClick={() => confirmDelete(item.id || "")}>
                    <FontAwesomeIcon
                      icon={faTrash} 
                    />
                    </IconButton> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data?.length === 0 && (
            <div className="no_table_data">
              <h2>No Data Available </h2>
              <p>Please add usecases for the project</p>
              <Button
                theme={ThemeType.primary}
                onClick={() => setIsNewUsecaseDialogOpen(true)}
              >
                <FontAwesomeIcon icon={faPlus} /> Add Usecase
              </Button>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={isDeleteUsecaseDialogOpen}
        onClose={() => setIsDeleteUsecaseDialogOpen(false)}
      >
        <ModalHeader
          onClose={() => setIsDeleteUsecaseDialogOpen(false)}
          heading="Delete Usecase"
        />

        <ModalBody>
          <div className="new-project-dialog">
            <p>Are you sure you want to delete this usecase?</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button theme={ThemeType.danger} onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={() => setIsDeleteUsecaseDialogOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={isNewUsecaseDialogOpen}
        onClose={() => setIsNewUsecaseDialogOpen(false)}
      >
        <ModalHeader
          onClose={() => setIsNewUsecaseDialogOpen(false)}
          heading="Create new usecase"
        />

        <ModalBody>
          <div className="new-project-dialog">
            <Textarea
              name="description"
              value={newUsecaseForm.description}
              label="usecase name"
              onInput={handleChange}
              autoFocus
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button theme={ThemeType.primary} onClick={handleSaveNewUsecase}>
            Save
          </Button>
          <Button onClick={() => setIsNewUsecaseDialogOpen(false)}>
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
                <Button theme={ThemeType.danger} onClick={handleProjectDelete}>
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
              {/* <Input
                label="Project"
                name="name"
              /> */}
              <Textarea
                label="Usecase"
                name="description"
                value={useCaseToEdit?.description}
                onInput={handleUsecaseChange}
              />
            </form>
          </div>
        </ModalBody>
        <div className="editor_footer_container">
          <ModalFooter>
            {/* <Button theme={ThemeType.primary} onClick={updateUsecase}>
            Save
          </Button>
          <Button onClick={() => setIsEditUsecaseDialogOpen(false)}>
            Close
          </Button> */}
            <div className="editor_footer">
              <div className="footer_delete">
                <Button theme={ThemeType.danger} onClick={handleDelete}>
                  Delete
                </Button>
              </div>
              <div className="footer_save">
                <Button theme={ThemeType.primary} onClick={updateUsecase}>
                  Save
                </Button>
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

export default Usecases;
