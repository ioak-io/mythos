import React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faArrowRight,
    faTrashAlt,
    faPen,
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
import TestcasesPage from "../TestcasePage";

const UsecasesPage = () => {
    const [usecases, setUsecases] = useState<Usecases[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModalOpen = () => setIsModalOpen(true);
    const [formData, setFormData] = useState({ usecaseTitle: "", usecaseDescription: "", });
    const [currentUsecaseId, setCurrentUsecaseId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [usecaseToDelete, setUsecaseToDelete] = useState<string | null>(null);
    const location = useLocation();
    const params = location.pathname.split('/');
    const space = params[1];
    const appId = params[2];
    const reqId = params[3];
    const handleModalClose = () => {
        setIsModalOpen(false);
        setFormData({ usecaseTitle: "", usecaseDescription: "" });
        setCurrentUsecaseId(null);
    };

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
        setUsecaseToDelete(null);
    };

    useEffect(() => {
        const loadUsecases = async () => {
            try {
                const data = await fetchUsecases(space, reqId);
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
        const title = usecases.find((usecase: any) => usecase.reference === useId)?.title;
        navigate(`/${space}/${appId}/${reqId}/${useId}/testcase/search`, {state: { usecaseTitle: title},});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const usecaseCreatePayload = { requirement: reqId ,title: formData.usecaseTitle, description: formData.usecaseDescription };
        setLoading(true);
        try {
            if (currentUsecaseId) {
                await updateUsecase(space, reqId, currentUsecaseId, usecaseCreatePayload);
            } else {
                await postUsecases(space, reqId, usecaseCreatePayload);
            };

            const newUsecases = await fetchUsecases(space, reqId);
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
            const usecases = await fetchUsecases(space, reqId);
            const usecaseIds = usecases.map((usecase: { reference: string }) => usecase.reference);
            for (const id of usecaseIds) {
                await deleteTestcasesByUsecase(space, id);
            };
            await deleteUsecases(space);
            await generateUsecases(space, reqId);
            const newData = await fetchUsecases(space, reqId);
            setUsecases(newData);
        } catch (error) {
            console.error("Error Generating Usecases: ", error);
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
        setLoading(true);
        try {
            await deleteSingle(space, reqId, usecaseToDelete);
            const updated = await fetchUsecases(space, reqId);
            setUsecases(updated);
        } catch (error) {
            console.error("Error Deleting Usecase:", error);
        } finally {
            setLoading(false);
            handleDeleteModalClose();
        }
    };

    const handleUpdate = (id: string) => {
        const usecaseToEdit = usecases.find((usecase) => usecase.reference === id);
        if (!usecaseToEdit) return;

        setFormData({ usecaseTitle: usecaseToEdit.title, usecaseDescription: usecaseToEdit.description });
        setCurrentUsecaseId(id);
        handleModalOpen();
    };

    return (
        <div>
            <Topbar title="Usecase">
                <div className="topbar-actions">
                    <Button onClick={handleModalOpen} disabled={loading}>
                        <FontAwesomeIcon icon={faPlus} />
                        Usecase
                    </Button>
                    <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                        <ModalHeader onClose={handleModalClose} heading={currentUsecaseId ? "Update Usecase" : "New Usecase"}></ModalHeader>
                        <ModalBody>
                            <Input
                                id="usecase"
                                type="text"
                                name="usecaseTitle"
                                value={formData.usecaseTitle}
                                onChange={handleChange}
                                label="Title"
                                placeholder="Enter your Title"
                            />
                            <Textarea
                                id="usecase"
                                type="text"
                                name="usecaseDescription"
                                value={formData.usecaseDescription}
                                onChange={handleChange}
                                label="Description"
                                placeholder="Enter your Description"
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={handleModalClose} theme={ThemeType.default}>
                                <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
                            </Button>
                            <Button onClick={handleSubmit} theme={ThemeType.primary} loading={loading}>
                                Save
                            </Button>
                        </ModalFooter>
                    </Modal>
                    <Button onClick={handleGenerateUsecase} loading={loading} disabled={loading}>
                        <FontAwesomeIcon icon={faMagicWandSparkles}></FontAwesomeIcon>
                        Generate Usecase
                    </Button>
                </div>
            </Topbar>
            <MainSection>
                <table className="basicui-table table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th colSpan={2}>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usecases?.length > 0 ? (
                            usecases.map((usecase) => (
                                <tr key={usecase._id}>
                                    <td className="text-column">{usecase.title}</td>
                                    <td className="description-column">{usecase.description}</td>
                                    <td className="actions-column">
                                        <div className="actions-wrapper">
                                            <Button onClick={() => confirmDelete(usecase.reference)} disabled={loading}>
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </Button>
                                            <Button onClick={() => handleUpdate(usecase.reference)} disabled={loading} >
                                                <FontAwesomeIcon icon={faPen} />
                                            </Button>
                                            <Button onClick={() => handleUsecaseClick(usecase.reference)} disabled={loading}>
                                                <FontAwesomeIcon icon={faArrowRight} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))) : (
                            <tr>
                                <td colSpan={3}>No Usecases Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </MainSection>
            <Modal isOpen={isDeleteModalOpen} onClose={handleDeleteModalClose}>
                <ModalBody>
                    Are you sure you want to delete this usecase? This action cannot be undone.
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
        </div>
    )
};

export default UsecasesPage;
