import React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import "./style.scss";
import { fetchUsecases, generateUsecases, postUsecases } from "./service";
import { useNavigate } from "react-router-dom";
import { space } from "../LandingPage";
import { appId } from "../ApplicationsPage";
import { reqId } from "../RequirementsPage";
import Topbar from "../../Topbar";
import MainSection from "../../MainSection";
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from "basicui";

export let useId: string | null = null;

const UsecasesPage = () => {
    const [usecases, setUsecases] = useState<Usecases[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModalClose = () => setIsModalOpen(false);
    const handleModalOpen = () => setIsModalOpen(true);
    const [formData, setFormData] = useState({ usecaseDescription: "", });

    useEffect(() => {
        const loadUsecases = async () => {
            try {
                const data = await fetchUsecases();
                setUsecases(data);
            } catch (err) {
                setError("Data Could Not Be Fetched");
            } finally {
                setLoading(false);
            }
        };

        loadUsecases();
    }, []);

    const handleUsecaseClick = (id: any) => {
        useId = id;
        navigate(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase`);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const usecaseCreatePayload = { description: formData.usecaseDescription };
        try {
            await postUsecases(usecaseCreatePayload);
            const newUsecases = await fetchUsecases();
            setUsecases(newUsecases);
            handleModalClose();
        } catch (error) {
            console.error("Error submitting Requirement:", error);
        }
    };

    const handleGenerateUsecase = async () => {
        try{
            await generateUsecases();
            const newData = await fetchUsecases();
            setUsecases(newData);
        } catch(error) {
            console.error("Error Generating Usecases: ");
        }
    };

    if (loading) return <p>Loading Usecases...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <Topbar title="Usecase">
                <div className="topbar-actions">
                    <Button onClick={handleModalOpen}>
                        <FontAwesomeIcon icon={faPlus} />
                        New Usecase
                    </Button>
                    <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                        <ModalHeader onClose={handleModalClose} heading="New Usecase"></ModalHeader>
                        <ModalBody>
                            <label>
                                Type your usecase:{" "}
                                <input name="usecaseDescription" value={formData.usecaseDescription} onChange={handleChange} />
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
                    <Button onClick={handleGenerateUsecase}>
                        Generate Usecase
                    </Button>
                </div>
            </Topbar>
            <MainSection>
                <table className="basicui-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Created Date</th>
                            <th>Updated Date</th>
                            <th>Status</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usecases.map((usecase) => (
                            <tr key={usecase._id} onClick={() => handleUsecaseClick(usecase._id)}>
                                <td className="description-column">{usecase.description}</td>
                                <td>{new Date(usecase.createdDate).toLocaleDateString()}</td>
                                <td>{new Date(usecase.lastModifiedDate).toLocaleDateString()}</td>
                                <td>"Active"</td>
                                <td >
                                    Available Options
                                    <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </MainSection>
        </div>
    )
};

export default UsecasesPage;
