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
import { useEffect, useState } from "react";
import { Project } from "@/types/Project";
import ContextBar from "@/components/ContextBar";
import { useRouter, useSearchParams } from "next/navigation";
import "./style.css";
import { AuthorizationState, SuiteIdState } from "@/store/AuthorizationStore";
import { Authorization } from "@/types/Authorization";
import { editUseCase, getUseCaseById } from "./list/service";

const usecase = () => {

  const [authorization, setAuthorization] = useState<Authorization>({});
  const [projectData, setProjectData] = useState<Project>({
    description: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const [suiteId, setSuiteId] = useState<any>();

  useEffect(() => {
    SuiteIdState.subscribe((id:string) =>{
      setSuiteId(id);
    })
    AuthorizationState.subscribe((message) => {
      setAuthorization(message);
    });
  }, []);


  const handleProjectDataChange = (event: any) => {
    setProjectData({
      ...projectData,
      [event.currentTarget.description]: event.currentTarget.value,
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
      getUseCaseById(suiteId, searchParams.get("id"),authorization).then(
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
      }
    );
  }

  const handleDeleteProject = () =>{

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
                  name="name"
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