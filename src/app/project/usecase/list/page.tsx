"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ThemeType,
  IconButton
} from "basicui";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Project } from "@/types/Project";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,faEye
} from "@fortawesome/free-solid-svg-icons";
import { deleteUseCase, getAllUseCases } from "./service";
import { Authorization } from "@/types/Authorization";
import { AuthorizationState } from "@/store/AuthorizationStore";
import { SuiteIdState } from "@/store/AuthorizationStore";

const usecases = () => {
 
  const sampleData=[{
    createdBy: "user1",
    createdDate: "2024-04-11T18:42:05.698+05:30",
    id: "6617e1a5979a822b1045acbb",
    lastModifiedBy: null,
    lastModifiedDate: "2024-04-11T18:42:05.698+05:30",
    name: "usecase1"},
    {
    createdBy: "user2",
    createdDate: "2024-04-11T18:42:05.698+05:30",
    id: "6617e1a5979a822b1045acbb",
    lastModifiedBy: null,
    lastModifiedDate: "2024-04-11T18:42:05.698+05:30",
    name: "usecase2"
    }]
  const router = useRouter();
  const [suiteId, setSuiteId] = useState<any>();
  const [data, setData] = useState<Project[]>();
  const [authorization, setAuthorization] = useState<Authorization>({});

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      console.log(message)
      setAuthorization(message);
    });
  }, []);

  useEffect(() => {
    SuiteIdState.subscribe((id) =>{
      setSuiteId(id);
    })
    if (authorization.isAuth) {
      fetchUseCases();
    }
  }, [authorization]);


  const fetchUseCases = () => {
    getAllUseCases(suiteId,authorization).then((response: any) => {
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
  };


  const navigateToTestcase = (id:string) => {
    router.push(`testcase/list`);
  }

  const manageUseCase = (id:string) => {
    router.push(`/project/usecase?id=${id}`);
  }

  const handleDelete = (useCaseId:string) => {
    deleteUseCase(suiteId, useCaseId, authorization).then((response) => {
      fetchUseCases();
    });
  }

  
  return (
    <>
      <div>
        
        <div className="page">
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
                    <IconButton circle={true} onClick={() => manageUseCase(item.id || "")}>
                    <FontAwesomeIcon
                      icon={faPen} 
                    />
                    </IconButton>
                    <IconButton circle={true} onClick={() => handleDelete(item.id || "")}>
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
      </>
  );
};

export default usecases;