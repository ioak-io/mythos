import React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faArrowRight,
    faTrash,
    faEdit,
    faClose,
    faCheck,
    faMagicWandSparkles,
} from "@fortawesome/free-solid-svg-icons";
import "./style.scss";
import { deleteSingle, deleteUsecases, fetchUsecases, generateUsecases, postUsecases, updateUsecase } from "./service";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Topbar from "../../Topbar";
import MainSection from "../../MainSection";
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Input, ThemeType, Textarea } from "basicui";
import { deleteTestcases, deleteTestcasesByUsecase } from "../TestcasePage/service";

const UsecasesPage = () => {
    const [usecases, setUsecases] = useState<Usecases[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModalOpen = () => setIsModalOpen(true);
    const [formData, setFormData] = useState({ usecaseDescription: "", });
    const [currentUsecaseId, setCurrentUsecaseId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [usecaseToDelete, setUsecaseToDelete] = useState<string | null>(null);
    const location = useLocation();
    const params = location.pathname.split('/');
    const space = params[1];
    const appId = params[3];
    const reqId = params[5];

    const handleModalClose = () => {
        setIsModalOpen(false);
        setFormData({ usecaseDescription: "" });
        setCurrentUsecaseId(null);
    };

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
        setUsecaseToDelete(null);
    };

    useEffect(() => {
        const loadUsecases = async () => {
            try {
                const data = await fetchUsecases(space, appId, reqId);
                setUsecases(data);
            } catch (err) {
                setError("Data Could Not Be Fetched");
            } finally {
                setLoading(false);
            }
        };

        loadUsecases();
    }, []);

    const handleUsecaseClick = (useId: any) => {
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
                await updateUsecase(space, appId, reqId,currentUsecaseId, usecaseCreatePayload);
            } else {
                await postUsecases(space, appId, reqId,usecaseCreatePayload);
            };

            const newUsecases = await fetchUsecases(space, appId, reqId);
            setUsecases(newUsecases);
            handleModalClose();
        } catch (error) {
            console.error("Error submitting Requirement:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateUsecase = async () => {
        setLoading(true);
        try {
            const usecases = await fetchUsecases(space, appId, reqId);
            const usecaseIds = usecases.map((usecase: { _id: string }) => usecase._id);

            for (const id of usecaseIds) {
                await deleteTestcasesByUsecase(space, appId, reqId,id);
            };

            await deleteUsecases(space, appId, reqId);

            await generateUsecases(space, appId, reqId);
            const newData = await fetchUsecases(space, appId, reqId);
            setUsecases(newData);
        } catch (error) {
            console.error("Error Generating Usecases: ");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id: string) => {
        setUsecaseToDelete(id);
        setIsDeleteModalOpen(true);
    };



    const handleDelete = async () => {
        if (!usecaseToDelete) return;
        try {
            await deleteSingle(space, appId, reqId,usecaseToDelete);
            const updated = await fetchUsecases(space, appId, reqId);
            setUsecases(updated);
        } catch (error) {
            console.error("Error Deleting Usecase:", error);
        } finally {
            handleDeleteModalClose();
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
                        Usecase
                    </Button>
                    <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                        <ModalHeader onClose={handleModalClose} heading={currentUsecaseId ? "Update Usecase" : "New Usecase"}></ModalHeader>
                        <ModalBody>
                            <Textarea
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
                            <Button onClick={handleModalClose} theme={ThemeType.default}>
                                <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
                            </Button>
                            <Button onClick={handleSubmit} theme={ThemeType.default} loading={loading}>
                                <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                            </Button>
                        </ModalFooter>
                    </Modal>
                    <Button onClick={handleGenerateUsecase} loading={loading}>
                        <FontAwesomeIcon icon={faMagicWandSparkles}></FontAwesomeIcon>
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
                        {usecases?.length > 0 ? (
                            usecases.map((usecase) => (
                                <tr key={usecase._id}>
                                    <td className="description-column">{usecase.description}</td>
                                    <td>{new Date(usecase.createdDate).toLocaleDateString()}</td>
                                    <td>{new Date(usecase.lastModifiedDate).toLocaleDateString()}</td>
                                    <td>Active</td>
                                    <td>
                                        <Button onClick={() => confirmDelete(usecase._id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                        <Button onClick={() => handleUpdate(usecase._id)} >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button onClick={() => handleUsecaseClick(usecase._id)} >
                                            <FontAwesomeIcon icon={faArrowRight} />
                                        </Button>
                                    </td>
                                </tr>
                            ))) : (
                            <tr>
                                <td colSpan={5}>No Usecases Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </MainSection>
            <Modal isOpen={isDeleteModalOpen} onClose={handleDeleteModalClose}>
                <ModalHeader border={true} onClose={handleDeleteModalClose} heading="Confirm Deletion"></ModalHeader>
                <ModalBody>
                    Are you sure you want to delete this usecase? This action cannot be undone.
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleDeleteModalClose} theme={ThemeType.default}>
                        <FontAwesomeIcon icon={faClose} />
                    </Button>
                    <Button onClick={handleDelete} theme={ThemeType.default} loading={loading}>
                        <FontAwesomeIcon icon={faCheck} />
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
};

export default UsecasesPage;
