"use client";

import ContextBar from "@/components/ContextBar";
import ObjectiveQuestion from "@/components/ObjectiveQuestion";
import {
  Button,
  Input,
  Tab,
  TabDetail,
  TabHeader,
  Tabs,
  Textarea,
  ThemeType,
} from "basicui";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import "./style.css";
import { Project } from "@/types/Project";
import {
  deleteProjectById,
  getProjectById,
  saveProjectById,
} from "./service";
import withAuthValidation from "@/components/Authorization/withAuthValidation";
import {
  PermissionType,
  useRouteAuthorization,
} from "@/lib/RouteAuthorizationHook";
import { Authorization } from "@/types/Authorization";
import { AuthorizationState } from "@/store/AuthorizationStore";

const sampleData = require("./data.json");

const EditProjectPage = () => {
  const { hasPermissions, isRouteAuthorized } = useRouteAuthorization("1");
  useLayoutEffect(() => {
    hasPermissions([PermissionType.USER]);
  }, []);
  const [authorization, setAuthorization] = useState<Authorization>({});

  const [projectData, setProjectData] = useState<Project>({
    name: "",
  });
  const [state, setState] = useState<any>({ ...sampleData });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      setAuthorization(message);
    });
  }, []);

  const handleProjectDataChange = (event: any) => {
    setProjectData({
      ...projectData,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleQuestionChange = (data: any) => {
    console.log(data);
  };

  const saveProject = () => {
    saveProjectById(projectData?.id || "", projectData,authorization).then(
      (response) => {
        fetchProjectById();
        router.back();
      }
    );
  };

  const handleDeleteProject = () => {
    deleteProjectById(projectData?.id || "").then((response) => {
      router.back();
    });
  };

  const [tab, setTab] = useState("1");

  const handleTabChange = (_tab: string) => {
    setTab(_tab);
  };

  useEffect(() => {
    if (searchParams.has("id")) {
      fetchProjectById();
    }
  }, [authorization, searchParams]);

  const fetchProjectById = () => {
    console.log(authorization);
    if (authorization.isAuth) {
      getProjectById(authorization, searchParams.get("id") || "").then(
        (response) => {
          setProjectData(response);
        }
      );
    }
  };

  if (!isRouteAuthorized) {
    return <></>;
  }

  return (
    <div>
      <ContextBar title={projectData.name}>
        <Button onClick={saveProject} theme={ThemeType.primary}>
          Save
        </Button>
        <Button onClick={handleDeleteProject} theme={ThemeType.danger}>
          Delete
        </Button>
        <Button onClick={saveProject}>Close</Button>
      </ContextBar>
      <div className="page">
        <Tabs activeTabId={tab} onChange={handleTabChange}>
          <Tab id="1">
            <TabHeader>Details</TabHeader>
            <TabDetail>
              <form className="project-detail-form">
                <Input
                  label="Project name"
                  name="name"
                  value={projectData?.name}
                  onInput={handleProjectDataChange}
                />
                <Textarea
                  label="Job description"
                  name="jobDescription"
                  value={projectData?.jobDescription}
                  onInput={handleProjectDataChange}
                />
              </form>
            </TabDetail>
          </Tab>
          <Tab id="2">
            <TabHeader>Test cases</TabHeader>
            <TabDetail>
              <div className="project-questions">
                {state.questions.map((item: any, index: number) => (
                  <ObjectiveQuestion
                    onChange={handleQuestionChange}
                    key={item.question}
                    question={item}
                    index={index}
                  />
                ))}
              </div>
            </TabDetail>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default EditProjectPage;
