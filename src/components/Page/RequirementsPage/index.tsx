import React from 'react';
import './style.scss';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ThemeType,
    Textarea
} from "basicui";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight, faTrashAlt, faPen,
    faClose,
    faCheck
} from "@fortawesome/free-solid-svg-icons";
import { deleteSingle, fetchRequirements, postRequirements, updateRequirement } from "./service";
import Topbar from '../../Topbar';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import MainSection from '../../MainSection';

const RequirementsPage = () => {
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModalOpen = () => setIsModalOpen(true);
    const [formData, setFormData] = useState({ reqDescription: "", });
    const [currentReqId, setCurrentReqId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reqToDelete, setReqToDelete] = useState<string | null>(null);
    const location = useLocation();
    const params = location.pathname.split('/');
    const space = params[1];
    const appId = params[2];
    const handleModalClose = () => {
        setIsModalOpen(false);
        setFormData({ reqDescription: "" });
        setCurrentReqId(null);
    };

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
        setReqToDelete(null);
    };

    useEffect(() => {
        const loadRequirements = async () => {
            try {
                const data = await fetchRequirements(space, appId);
                setRequirements(data);
            } catch (err) {
                setError("Data Could Not Be Fetched");
            } finally {
                setLoading(false);
            }
        };

        loadRequirements();
    }, []);


    const handleRequirementClick = (reqId: any) => {
        navigate(`/${space}/${appId}/${reqId}/usecase/search`);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const reqCreatePayload = {application: appId, description: formData.reqDescription };
        setLoading(true);
        try {
            if (currentReqId) {
                await updateRequirement(space, currentReqId, reqCreatePayload);
            } else {
                await postRequirements(space, reqCreatePayload);
            }

            const updatedRequirements = await fetchRequirements(space, appId);
            setRequirements(updatedRequirements);
            handleModalClose();
        } catch (error) {
            console.error("Error submitting Requirement:", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id: string) => {
        setReqToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!reqToDelete) return;
        setLoading(true);
        try {
            await deleteSingle(space, reqToDelete);
            const updated = await fetchRequirements(space, appId);
            setRequirements(updated);
        } catch (error) {
            console.error("Error Deleting Requirement:", error);
        } finally {
            setLoading(false);
            handleDeleteModalClose();
        }
    };

    const handleUpdate = (id: string) => {
        const reqToEdit = requirements.find((requ) => requ.reference === id);
        if (!reqToEdit) return;

        setFormData({ reqDescription: reqToEdit.description });
        setCurrentReqId(id);
        handleModalOpen();
    };

    return (
        <>
            <div className="requirements-page">
                <Topbar title="Requirements">
                    <div className="topbar-actions">
                        <Button onClick={handleModalOpen}>
                            <FontAwesomeIcon icon={faPlus} />
                            Requirement
                        </Button>
                        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                            <ModalHeader onClose={handleModalClose} heading={currentReqId ? "Update Requirement" : "New Requirement"}></ModalHeader>
                            <ModalBody>
                                <Textarea
                                    id="requirement"
                                    name="reqDescription"
                                    value={formData.reqDescription}
                                    onChange={handleChange}
                                    type='text'
                                    label='Requirement Description'
                                    placeholder='Type your requirement description'
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
                    </div>
                </Topbar>
                <MainSection>
                    <table className="basicui-table table-hover">
                        <thead>
                            <tr>
                                <th colSpan={2}>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requirements?.length > 0 ? (
                                requirements.map((requ) => (
                                    <tr key={requ._id} >
                                        <td className="description-column">{requ.description}
                                        </td>
                                        <td className="actions-column">
                                            <div className="actions-wrapper">
                                                <Button onClick={() => confirmDelete(requ.reference)}>
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </Button>
                                                <Button onClick={() => handleUpdate(requ.reference)} >
                                                    <FontAwesomeIcon icon={faPen} />
                                                </Button>
                                                <Button onClick={() => handleRequirementClick(requ.reference)} >
                                                    <FontAwesomeIcon icon={faArrowRight} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2}>No Requirements Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </MainSection>
                <Modal isOpen={isDeleteModalOpen} onClose={handleDeleteModalClose}>
                    <ModalBody>
                        Are you sure you want to delete this requirement? This action cannot be undone.
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
        </>
    );
};

export default RequirementsPage;
