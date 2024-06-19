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
  deleteUseCase,
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
import ChipsInput from "../labels/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,faEye,faPlus,faPenToSquare,faCircleDot,faTurnUp,faStar, faAnglesUp
} from "@fortawesome/free-solid-svg-icons";

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
  const classNameTable = data?.length === 0 ? "empty-table" : "data-table";

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

  const handleDelete = () => {
    deleteUseCase(searchParams.get("suiteId"),
    searchParams.get("id"), authorization).then((response) => {
      router.back();
    });
  }

  return (
    <>
      <div>
        <ContextBar title="Testcases">
          <Button onClick={() => setIsEditUsecaseDialogOpen(true)}>
          <FontAwesomeIcon icon={faPen}/>Edit Usecase
          </Button>
        </ContextBar>
        <div className="page">
          {/* <div className="main-wrapper">
            <div className="cards">
              {testCases.map((testCase) => (
                <div key={testCase.id} className="information card">
                  <div className="priority">
                  <span className={`tag ${testCase.priority==='High'?'red':'yellow'}`}>
                  <FontAwesomeIcon icon={faStar} size="sm" /></span><p>{testCase.priority}</p>
                  </div>
                  <h2 className="title">{testCase.description.overview}</h2>
                  <p className="info">{testCase.summary}</p>
                  <span className="components">{testCase.components}</span>
                  {testCase.description.steps.map((step)=>(
                    <p>{step}</p>
                  ))}
                  <span className="outcome">
                  <p>Expected outcome:&nbsp; </p>
                  <p>{testCase.description.expectedOutcome}</p>
                  </span>
                  
                  <dl className="details">
                    <div>
                      <dt>Labels</dt>
                      <dd><ChipsInput labels={testCase.labels} /></dd>
                    </div>
                    { <div>
                    //   <dt>Comments</dt>
                    //   <dd>{testCase.comments}</dd>
                    // </div> }
                  </dl>
                </div>
              ))}
            </div>
          </div> */}
          <table className={`basicui-table theme-default table-hover usecase-table ${classNameTable}`}>
            <thead>
              <tr>
                <th>Priority</th>
                <th>Description</th>
                <th>Summary</th>
                <th>Components</th> 
              </tr>
            </thead>
            <tbody>
              {testCases?.map((testCase, index) => (
                <tr
                  key={index}
                  tabIndex={0}
                >
                  <td><div className="priority">
                  <span className={`tag ${testCase.priority==='High'?'red':'yellow'}`}>
                  <FontAwesomeIcon icon={faAnglesUp} size="sm" /></span><p>{testCase.priority}</p>
                  </div></td>
                  <td><pre className="description">{testCase.serializedDescription}</pre></td>
                  <td><div className="summary">{testCase.summary} <ChipsInput labels={testCase.labels} /></div></td>
                  <td><span className="components">{testCase.components}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
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
        <div className="editor_footer_container">
          <ModalFooter>
            <div className="editor_footer">
              <div className="footer_delete">
                <Button theme={ThemeType.danger}  onClick={handleDelete}>
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

export default testcases;
