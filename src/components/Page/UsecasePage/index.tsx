import React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faArrowRight,
    faTrash,
    faEdit,
} from "@fortawesome/free-solid-svg-icons";
import "./style.scss";
import { deleteSingle, fetchUsecases, generateUsecases, postUsecases, updateUsecase } from "./service";
import { useNavigate } from "react-router-dom";
import { space } from "../LandingPage";
import { appId } from "../ApplicationsPage";
import { reqId } from "../RequirementsPage";
import Topbar from "../../Topbar";
import MainSection from "../../MainSection";
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Input, ThemeType } from "basicui";

export let useId: string | null = null;

const UsecasesPage = () => {
    const [usecases, setUsecases] = useState<Usecases[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModalOpen = () => setIsModalOpen(true);
    const [formData, setFormData] = useState({ usecaseDescription: "", });
    const [currentUsecaseId, setCurrentUsecaseId] = useState<string | null>(null);

    const handleModalClose = () => {
        setIsModalOpen(false);
        setFormData({ usecaseDescription: "" });
        setCurrentUsecaseId(null);
    };

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
        setLoading(true);
        try {
            if (currentUsecaseId) {
                await updateUsecase(currentUsecaseId, usecaseCreatePayload);
            } else {
                await postUsecases(usecaseCreatePayload);
            };

            const newUsecases = await fetchUsecases();
            setUsecases(newUsecases);
            handleModalClose();
        } catch (error) {
            console.error("Error submitting Requirement:", error);
        } finally{
            setLoading(false);
        }
    };

    const handleGenerateUsecase = async () => {
        setLoading(true);
        try {
            await generateUsecases();
            const newData = await fetchUsecases();
            setUsecases(newData);
        } catch (error) {
            console.error("Error Generating Usecases: ");
        } finally{
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteSingle(id);
            const updated = await fetchUsecases();
            setUsecases(updated);
        } catch (error) {
            console.error("Error Deleting Usecase:");
        }
    };

    const handleUpdate = (id: string) => {
        const usecaseToEdit = usecases.find((usecase) => usecase._id === id);
        if (!usecaseToEdit) return;

        setFormData({ usecaseDescription: usecaseToEdit.description });
        setCurrentUsecaseId(id);
        handleModalOpen();
    };

    return (
        <div>
            <Topbar title="Usecase">
                <div className="topbar-actions">
                    <Button onClick={handleModalOpen}>
                        <FontAwesomeIcon icon={faPlus} />
                        New Usecase
                    </Button>
                    <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                        <ModalHeader onClose={handleModalClose} heading={currentUsecaseId ? "Update Usecase" : "New Usecase"}></ModalHeader>
                        <ModalBody>
                            <Input
                                id="usecase"
                                type="text"
                                name="usecaseDescription"
                                value={formData.usecaseDescription}
                                onChange={handleChange}
                                label="Usecase Description"
                                placeholder="Type your usecase description"
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={handleModalClose} theme={ThemeType.danger}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} theme={ThemeType.success} loading={loading}>
                                Save
                            </Button>
                        </ModalFooter>
                    </Modal>
                    <Button onClick={handleGenerateUsecase} loading={loading}>
                        Generate Usecase
                    </Button>
                </div>
            </Topbar>
            <MainSection>
                <table className="basicui-table table-hover">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Created Date</th>
                            <th>Updated Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usecases.map((usecase) => (
                            <tr key={usecase._id}>
                                <td className="description-column">{usecase.description}</td>
                                <td>{new Date(usecase.createdDate).toLocaleDateString()}</td>
                                <td>{new Date(usecase.lastModifiedDate).toLocaleDateString()}</td>
                                <td>Active</td>
                                <td >
                                    <FontAwesomeIcon icon={faTrash} className='arrow-icon' onClick={() => handleDelete(usecase._id)} />
                                    <FontAwesomeIcon icon={faEdit} className="arrow-icon" onClick={() => handleUpdate(usecase._id)} />
                                    <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" onClick={() => handleUsecaseClick(usecase._id)} />
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
