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
import { useState } from "react";
import { Project } from "@/types/Project";
import ContextBar from "@/components/ContextBar";
import "./style.css";

const usecase = () => {

  const [projectData, setProjectData] = useState<Project>({
    name: "",
  });

  const handleProjectDataChange = (event: any) => {
    setProjectData({
      ...projectData,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const saveUsecase = () =>{

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
                  value={projectData?.name}
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