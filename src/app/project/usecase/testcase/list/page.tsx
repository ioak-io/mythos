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
import { getAllUseCases, getUseCaseById } from "../../list/service";
import { getTestcases } from "./service";
import { TestCase } from "@/types/TestCase";

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

  return (
    <div className="page">
      <div className="main-wrapper">
        <div className="left">
          <h4>Usecase</h4>
          <div>
            <div className="item">
              <div className="description">{projectData.description}</div>
            </div>
          </div>
        </div>
        <div className="right">
          <h4>Testcases</h4>
          {testCases.map(testCase => (
        <div key={testCase.id}>
          <h2>{testCase.description}</h2>
          <p>{testCase.summary}</p>
          <p>Priority: {testCase.priority}</p>
          <p>Comments: {testCase.comments}</p>
        </div>
      ))}
        </div>
      </div>
    </div>
  );
};

export default testcases;
