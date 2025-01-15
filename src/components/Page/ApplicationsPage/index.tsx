import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./style.scss";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Topbar from "../../../components/Topbar";
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "basicui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import MainSection from "../../../components/MainSection";
import { fetchData, postData } from "./service";
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
  const handleModalClose = () => setIsModalOpen(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const [formData, setFormData] = useState({ appName: "", });

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

  const handleSubmit = async() => {
    const appNamePayload = {name: formData.appName};
    try {
      await postData(appNamePayload);
      const updatedApplications = await fetchData();
      setApplications(updatedApplications);
      handleModalClose();
    } catch (error) {
      console.error("Error submitting Application Name:", error);
    }
  };

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Topbar title="Applications">
        <div className="topbar-actions">
          <Button onClick={handleModalOpen}>
            <FontAwesomeIcon icon={faPlus} />
            New app
          </Button>
          <Modal isOpen={isModalOpen} onClose={handleModalClose}>
            <ModalHeader onClose={handleModalClose} heading="New Application"></ModalHeader>
            <ModalBody>
              <label>
                Application Name:{" "}
                <input name="appName" value={formData.appName} onChange={handleChange} />
              </label>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleModalClose} variant="danger">
                Cancel
              </Button>
              <Button onClick={handleSubmit} variant="success">
                Save
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </Topbar>
      <MainSection>
        <table className="basicui-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Created Date</th>
              <th>Updated Date</th>
              <th>Status</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} onClick={() => handleApplicationClick(app._id)}>
                <td>{app.name}</td>
                <td>{app.createdDate.slice(0, 10)}</td>
                <td>{app.lastModifiedDate.slice(0, 10)}</td>
                <td>Active</td>
                <td>Available Options
                  <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
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
