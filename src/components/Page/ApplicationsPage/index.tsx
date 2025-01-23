import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./style.scss";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Topbar from "../../../components/Topbar";
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, ThemeType } from "basicui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowRight, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import MainSection from "../../../components/MainSection";
import { deleteSingle, fetchData, postData, updateApp } from "./service";
import { space } from "../LandingPage";

interface Props {
  location: any;
  space: string;
}

export let appId: string | null = null;

const ApplicationsPage = (props: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  const authorization = useSelector((state: any) => state.authorization);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const [formData, setFormData] = useState({ appName: "", });
  const [currentAppId, setCurrentAppId] = useState<string | null>(null); 


  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({ appName: "" }); 
    setCurrentAppId(null); 
  };

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await fetchData();
        setApplications(data);
      } catch (err) {
        setError("Data Could Not Be Fetched");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const handleApplicationClick = (id: any) => {
    appId = id;
    navigate(`/${space}/application/${appId}/requirement`)
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const appNamePayload = { name: formData.appName };
    setLoading(true);
    try {
      if (currentAppId) {
        await updateApp(currentAppId, appNamePayload);
      } else {
        await postData(appNamePayload);
      }

      const updatedApplications = await fetchData();
      setApplications(updatedApplications);
      handleModalClose();
    } catch (error) {
      console.error("Error submitting Application:", error);
    } finally{
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSingle(id);
      const updated = await fetchData();
      setApplications(updated);
    } catch (error) {
      console.error("Error Deleting Application:", error);
    }
  };

  const handleUpdate = (id: string) => {
    const appToEdit = applications.find((app) => app._id === id);
    if (!appToEdit) return;

    setFormData({ appName: appToEdit.name });
    setCurrentAppId(id); 
    handleModalOpen();
  };

  return (
    <>
      <Topbar title="Applications">
        <div className="topbar-actions">
          <Button onClick={handleModalOpen}>
            <FontAwesomeIcon icon={faPlus} />
            New app
          </Button>
          <Modal isOpen={isModalOpen} onClose={handleModalClose}>
            <ModalHeader border={true} onClose={handleModalClose} heading={currentAppId ? "Update Application" : "New Application"}></ModalHeader>
            <ModalBody>
              <Input 
              id="application"
              type="text"
              name="appName"
              label="Application Name"
              value={formData.appName}
              placeholder="Type your application name"
              onChange={handleChange}
              ></Input>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleModalClose}  theme={ThemeType.danger}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} theme={ThemeType.success} loading={loading}>
                Save
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </Topbar>
      <MainSection>
        <table className="basicui-table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Created Date</th>
              <th>Updated Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} >
                <td>{app.name}</td>
                <td>{app.createdDate.slice(0, 10)}</td>
                <td>{app.lastModifiedDate.slice(0, 10)}</td>
                <td>Active</td>
                <td>
                  <FontAwesomeIcon icon={faTrash} className='arrow-icon' onClick={() => handleDelete(app._id)} />
                  <FontAwesomeIcon icon={faEdit} className="arrow-icon" onClick={() => handleUpdate(app._id)} />
                  <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" onClick={() => handleApplicationClick(app._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </MainSection>
    </>
  );
};

export default ApplicationsPage;
