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
  IconButton
} from "basicui";
import { redirect, useRouter, useSearchParams, usePathname } from "next/navigation";
import { Project } from "@/types/Project";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,faEye
} from "@fortawesome/free-solid-svg-icons";
import { deleteUseCase, editUseCaseById, getAllUseCases, getUseCaseById, saveUseCase } from "./service";
import { Authorization } from "@/types/Authorization";
import { AuthorizationState } from "@/store/AuthorizationStore";
import { PermissionType, useRouteAuthorization } from "@/lib/RouteAuthorizationHook";
import ExportDropdown from "../export/page";

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
  const [isDeleteUsecaseDialogOpen, setIsDeleteUsecaseDialogOpen] = useState(false);
  const [isNewUsecaseDialogOpen, setIsNewUsecaseDialogOpen] = useState(false);
  const [isEditUsecaseDialogOpen,setIsEditUsecaseDialogOpen] =useState(false);
  const [useCaseToEdit, setUseCaseToEdit] = useState<Project>({
    description:"",
    id:""
  });
  const [toDeleteUsecaseId, setToDeleteUsecaseId] = useState("");
  const [newUsecaseForm, setNewUsecaseForm] = useState<any>({
    description: "",
});

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      console.log(message)
      setAuthorization(message);
    });
  }, []);


  useEffect(() => {
    setSuiteId(searchParams.get('suiteId'))
    if (searchParams.get('suiteId')) {
      fetchUseCases();
    }
  }, [authorization,searchParams]);


  const fetchUseCases = () => {
    if (authorization.isAuth) {
    getAllUseCases(searchParams.get('suiteId'),authorization).then((response: any) => {
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
    }
  };


  const navigateToTestcase = (id:string) => {
    router.push(`testcase/list?id=${id}&suiteId=${suiteId}`);
  }

  const manageUseCase = (item:any) => {
    // router.push(`/project/usecase?id=${id}&suiteId=${suiteId}`);
    setIsEditUsecaseDialogOpen(true)
    fetchUseCaseById(item.id)
  }

  const handleDelete = () => {
    deleteUseCase(suiteId, toDeleteUsecaseId, authorization).then((response) => {
      fetchUseCases();
      setIsDeleteUsecaseDialogOpen(false)
    });
  }

  const confirmDelete = (useCaseId:string) => {
    setIsDeleteUsecaseDialogOpen(true)
    setToDeleteUsecaseId(useCaseId);
  }

  const handleChange = (event: any) => {
    setNewUsecaseForm({
      ...newUsecaseForm,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSaveNewUsecase = () => {
    saveUseCase(suiteId,newUsecaseForm, authorization).then((response: any) => {
      setIsNewUsecaseDialogOpen(false);
      fetchUseCases();
    });
  };

  const handleUsecaseChange = (event: any) => {
    setUseCaseToEdit({
      ...useCaseToEdit,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const fetchUseCaseById = (id:string) => {
    if (authorization.isAuth) {
      getUseCaseById(
        suiteId,
        id,
        authorization
      ).then((response) => {
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
      setIsEditUsecaseDialogOpen(false)
    });
  };

  if (!isRouteAuthorized) {
    return <></>;
  }
  
  return (
    <>
      <div>
      <ContextBar title="Usecase list">
          <Button onClick={() => setIsNewUsecaseDialogOpen(true)}>
            New Usecase
          </Button>
        </ContextBar>
        <div className="page">
          <ExportDropdown suiteId={suiteId}></ExportDropdown>
          <table className="basicui-table theme-default table-hover">
            <thead>
              <tr>
                <th>Usecase name</th>
                <th>Created on</th>
               <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr
                  key={index}
                  tabIndex={0}
                >
                  <td>{item.description}</td>
                  <td>{item.createdDate}</td>
                  <td>
                    <div className="action_icons">
                  <IconButton circle={true} onClick={() => navigateToTestcase(item.id || "")}>
                    <FontAwesomeIcon
                      icon={faEye}
                    />
                    </IconButton>
                    <IconButton circle={true} onClick={() => manageUseCase(item || "")}>
                    <FontAwesomeIcon
                      icon={faPen} 
                    />
                    </IconButton>
                    <IconButton circle={true} onClick={() => confirmDelete(item.id || "")}>
                    <FontAwesomeIcon
                      icon={faTrash} 
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
        isOpen={isDeleteUsecaseDialogOpen}
        onClose={() => setIsDeleteUsecaseDialogOpen(false)}
      >
        <ModalHeader
          onClose={() => setIsDeleteUsecaseDialogOpen(false)}
          heading="Delete Usecase"
        />

        <ModalBody>
          <div className="new-project-dialog">
            <p>Are you sure to delete this usecase?</p>
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
            <Input
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
                value={useCaseToEdit?.description}
                onInput={handleUsecaseChange}
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

export default Usecases;