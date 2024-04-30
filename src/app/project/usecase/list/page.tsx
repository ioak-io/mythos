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
import { redirect, useRouter, useSearchParams, usePathname } from "next/navigation";
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

  const manageUseCase = (id:string) => {
    router.push(`/project/usecase?id=${id}&suiteId=${suiteId}`);
  }

  const handleDelete = (useCaseId:string) => {
    deleteUseCase(suiteId, useCaseId, authorization).then((response) => {
      fetchUseCases();
    });
  }

  if (!isRouteAuthorized) {
    return <></>;
  }
  
  return (
    <>
      <div>
        
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

export default Usecases;