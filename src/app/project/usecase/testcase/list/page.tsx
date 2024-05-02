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
        <h4>Testcases</h4>
        <div className="cards">
        <div className="information card">
              <h2 className="title">testCase.description</h2>
              <p className="info">testCase.summary</p>
              <dl className="details">
                <div>
                  <dt>Priority</dt>
                  <dd>testCase.priority</dd>
                </div>
                <div>
                  <dt>Comments</dt>
                  <dd>testCase.comments</dd>
                </div>
              </dl>
            </div>
          {testCases.map((testCase) => (
            <div key={testCase.id} className="information card">
              <h2 className="title">{testCase.description}</h2>
              <p className="info">{testCase.summary}</p>
              <dl className="details">
                <div>
                  <dt>Priority</dt>
                  <dd>{testCase.priority}</dd>
                </div>
                <div>
                  <dt>Comments</dt>
                  <dd>{testCase.comments}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default testcases;
