import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./style.scss";
import { useLocation, useNavigate } from "react-router-dom";
import Topbar from "../../../components/Topbar";
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, ThemeType } from "basicui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowRight, faTrashAlt, faPen, faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import MainSection from "../../../components/MainSection";
import { deleteSingle, fetchData, postData, updateApp } from "./service";

interface Props {
  location: any;
  space: string;
}

const ApplicationsPage = (props: Props) => {
  const navigate = useNavigate();
  const authorization = useSelector((state: any) => state.authorization);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const [formData, setFormData] = useState({ appName: "", });
  const [currentAppId, setCurrentAppId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<string | null>(null);
  const location = useLocation();
  const params = location.pathname.split('/');
  const space = params[1];

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({ appName: "" });
    setCurrentAppId(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setAppToDelete(null);
  };

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await fetchData(space);
        setApplications(data);
      } catch (err) {
        setError("Data Could Not Be Fetched");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const handleApplicationClick = (appId: any) => {
    navigate(`/${space}/requirement/search`)
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
        await updateApp(space, currentAppId, appNamePayload);
      } else {
        await postData(space, appNamePayload);
      }

      const updatedApplications = await fetchData(space);
      setApplications(updatedApplications);
      handleModalClose();
    } catch (error) {
      console.error("Error submitting Application:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setAppToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!appToDelete) return;
    setLoading(true);

    try {
      await deleteSingle(space, appToDelete);
      const updated = await fetchData(space);
      setApplications(updated);
    } catch (error) {
      console.error("Error Deleting Application:", error);
    } finally {
      setLoading(false);
      handleDeleteModalClose();
    }
  };

  const handleUpdate = (id: string) => {
    const appToEdit = applications.find((app) => app.reference === id);
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
            Application
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
              <Button onClick={handleModalClose} theme={ThemeType.default}>
                <FontAwesomeIcon icon={faClose} />
              </Button>
              <Button onClick={handleSubmit} theme={ThemeType.primary} loading={loading}>
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
              <th colSpan={2}>Name</th>
            </tr>
          </thead>
          <tbody>
            {applications?.length > 0 ? (
              applications.map((app) => (
                <tr key={app._id}>
                  <td>{app.name}</td>
                  <td className="actions-column">
                    <div className="actions-wrapper">
                      <Button onClick={() => confirmDelete(app.reference)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </Button>
                      <Button onClick={() => handleUpdate(app.reference)}>
                        <FontAwesomeIcon icon={faPen} />
                      </Button>
                      <Button onClick={() => handleApplicationClick(app.reference)}>
                        <FontAwesomeIcon icon={faArrowRight} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>No Applications Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </MainSection>
      <Modal isOpen={isDeleteModalOpen} onClose={handleDeleteModalClose}>
        <ModalBody>
          Are you sure you want to delete this application? This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleDeleteModalClose} theme={ThemeType.primary}>
            No
          </Button>
          <Button onClick={handleDelete} theme={ThemeType.default} loading={loading}>
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ApplicationsPage;
