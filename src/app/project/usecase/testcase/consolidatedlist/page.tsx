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
  generateConsolidatedTestcase,
} from "../../list/service";
import { getConsolidatedTestcases } from "./service";
import { TestCase } from "@/types/TestCase";
import {
  Button,
  ThemeType,
} from "basicui";
import ContextBar from "@/components/ContextBar/index";
import ChipsInput from "../labels/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesUp,
  faMagicWandSparkles,faRepeat,faXmark
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
  const classNameTable = data?.length === 0 ? "empty-table" : "data-table";
  const [isLoad,setIsload]=useState(false);

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      setAuthorization(message);
    });
  }, []);

  useEffect(() => {
    if (authorization?.access_token) {
      getTestcasesForSuite();
    }
  }, [authorization, searchParams]);



  const getTestcasesForSuite = () => {
    getConsolidatedTestcases(searchParams.get("suiteId"), authorization).then(
      (response: any) => {
        console.log(response);
        if (response?.length > 0) {
          setTestCases(response);
        }
      }
    );
  };

  const generateTestcaseForSuite = () => {
    setIsload(true);
    generateConsolidatedTestcase(
      searchParams.get("suiteId"),
      authorization
    ).then((response: any) => {
      setIsload(false);
      getTestcasesForSuite();
    });
  };


  const closeTestcases = () => {
    router.back();
  }



  return (
    <>
      <div>
        <ContextBar title="Testcases">
        {testCases?.length !== 0 &&
        <><Button onClick={closeTestcases}>
              <FontAwesomeIcon icon={faXmark} />Close
            </Button><Button
              theme={ThemeType.primary}
              onClick={() => generateTestcaseForSuite()}
            >
                <FontAwesomeIcon icon={faRepeat} /> Regenerate
                Testcases
              </Button></>
        }
        </ContextBar>
        <div className="page">
          {testCases?.length !== 0 && !isLoad &&(
            <table
              className={`basicui-table theme-default table-hover usecase-table ${classNameTable}`}
            >
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Priority</th>
                  <th>Description</th>
                  <th>Summary</th>
                  <th>Components</th>
                </tr>
              </thead>
              <tbody>
                {testCases?.map((testCase, index) => (
                  <tr key={index} tabIndex={0}>
                    <td>{index+1}.</td>
                    <td>
                      <div className="priority">
                        <span
                          className={`tag ${testCase.priority === "High" ? "red" : "yellow"}`}
                        >
                          <FontAwesomeIcon icon={faAnglesUp} size="sm" />
                        </span>
                        <p>{testCase.priority}</p>
                      </div>
                    </td>
                    <td>
                      <pre className="description">
                        {testCase.serializedDescription}
                      </pre>
                    </td>
                    <td>
                      <div className="summary">
                        {testCase.summary}{" "}
                        <ChipsInput labels={testCase.labels} />
                      </div>
                    </td>
                    <td>
                      <span className="components">{testCase.components}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {(testCases?.length === 0 && !isLoad &&
            <div className="no_table_data">
              <h2>No Testcases Available </h2>
              <p>Please generate Testcases for the project</p>
              <Button
                theme={ThemeType.primary}
                onClick={() => generateTestcaseForSuite()}
              >
                <FontAwesomeIcon icon={faMagicWandSparkles} /> Generate
                Testcases
              </Button>
            </div>
          )}
        </div>
      </div>
          
      {isLoad &&
      <div className="spinner-box">
      <div className="pulse-container">  
        <div className="pulse-bubble pulse-bubble-1"></div>
        <div className="pulse-bubble pulse-bubble-2"></div>
        <div className="pulse-bubble pulse-bubble-3"></div>
      </div>
      <p>Generating test cases, please hold on....</p>
      </div>
      } 
    </>
  );
};

export default testcases;
