"use client";
import {
  Button,
  Input,
  Tab,
  TabDetail,
  TabHeader,
  Tabs,
  Textarea,
  ThemeType
} from "basicui";
import { useEffect, useLayoutEffect, useState } from "react";
import { Project } from "@/types/Project";
import ContextBar from "@/components/ContextBar";
import { useRouter, useSearchParams } from "next/navigation";
import "./style.css";
import { AuthorizationState} from "@/store/AuthorizationStore";
import { Authorization } from "@/types/Authorization";
import { editUseCase, getUseCaseById } from "./list/service";
import { PermissionType, useRouteAuthorization } from "@/lib/RouteAuthorizationHook";

const usecase = () => {
  const { hasPermissions, isRouteAuthorized } = useRouteAuthorization("1");
  useLayoutEffect(() => {
    hasPermissions([PermissionType.USER]);
  }, []);
  const [authorization, setAuthorization] = useState<Authorization>({});
  const [projectData, setProjectData] = useState<Project>({
    description: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const [suiteId, setSuiteId] = useState<any>();

  useEffect(() => {
    setSuiteId(searchParams.get('suiteId'))
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

  useEffect(() => {
    if (searchParams.has("id")) {
      fetchUseCaseById();
    }
  }, [authorization, searchParams]);

  const fetchUseCaseById = () => {
    console.log(authorization);
    if (authorization.isAuth) {
      getUseCaseById(searchParams.get('suiteId'), searchParams.get("id"),authorization).then(
        (response) => {
          setProjectData(response);
        }
      );
    }
  };

  const saveUsecase = () =>{
    editUseCase(suiteId,projectData?.id || "", projectData,authorization).then(
      (response) => {
        fetchUseCaseById();
        router.back();
      }
    );
  }

  const handleDeleteProject = () =>{

  }

  if (!isRouteAuthorized) {
    return <></>;
  }
  
  return (
    <div className="page">
      {/* <h1>Use cases Page</h1>
      <p>This is the usecases page content.</p> */}
      <ContextBar title={projectData.name}>
        <Button onClick={saveUsecase} theme={ThemeType.primary}>
          Save
        </Button>
        <Button onClick={handleDeleteProject} theme={ThemeType.danger}>
          Delete
        </Button>
        <Button onClick={saveUsecase}>Close</Button>
      </ContextBar>
      <form className="project-detail-form">
                <Input
                  label="Usecase name"
                  name="description"
                  value={projectData?.description}
                  onInput={handleProjectDataChange}
                />
                <Textarea
                  label="Usecase description"
                  name="UsecaseDescription"
                  value={projectData?.jobDescription}
                  onInput={handleProjectDataChange}
                />
              </form>
    </div>
  );
};

export default usecase;