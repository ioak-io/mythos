import React from 'react';
import './style.scss';

import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    ThemeType
} from "basicui";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight, faTrash, faEdit
} from "@fortawesome/free-solid-svg-icons";
import { deleteSingle, fetchRequirements, postRequirements, updateRequirement } from "./service";
import { space } from '../LandingPage';
import { appId } from '../ApplicationsPage';
import Topbar from '../../Topbar';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import MainSection from '../../MainSection';

export let reqId: string | null = null;

const RequirementsPage = () => {
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const searchParams = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModalOpen = () => setIsModalOpen(true);
    const [formData, setFormData] = useState({ reqDescription: "", });
    const [currentReqId, setCurrentReqId] = useState<string | null>(null);

    const handleModalClose = () => {
        setIsModalOpen(false);
        setFormData({ reqDescription: "" });
        setCurrentReqId(null);
    };

    useEffect(() => {
        const loadRequirements = async () => {
            try {
                const data = await fetchRequirements();
                setRequirements(data);
            } catch (err) {
                setError("Data Could Not Be Fetched");
            } finally {
                setLoading(false);
            }
        };

        loadRequirements();
    }, [appId]);


    const handleRequirementClick = (id: any) => {
        reqId = id;
        navigate(`/${space}/application/${appId}/requirement/${reqId}/usecase`);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const reqCreatePayload = { description: formData.reqDescription };
        setLoading(true);
        try {
          if (currentReqId) {
            await updateRequirement(currentReqId, reqCreatePayload);
          } else {
            await postRequirements(reqCreatePayload);
          }
    
          const updatedRequirements = await fetchRequirements();
          setRequirements(updatedRequirements);
          handleModalClose();
        } catch (error) {
          console.error("Error submitting Requirement:", error);
        } finally{
            setLoading(false);
        }
      };

    const handleDelete = async (id: string) => {
        try {
            await deleteSingle(id);
            const updated = await fetchRequirements();
            setRequirements(updated);
        } catch (error) {
            console.error("Error Deleting Requirement:", error);
        }
    };

    const handleUpdate = (id: string) => {
        const reqToEdit = requirements.find((requ) => requ._id === id);
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
                            New Requirement
                        </Button>
                        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                            <ModalHeader onClose={handleModalClose} heading={currentReqId? "Update Requirement" : "New Requirement"}></ModalHeader>
                            <ModalBody>
                                <Input
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
                                <Button onClick={handleModalClose} theme={ThemeType.danger}>
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
                                <th>Description</th>
                                <th>Created Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requirements?.length > 0 ? (
                                requirements.map((requ) => (
                                    <tr key={requ._id} >
                                        <td className="description-column">{requ.description}
                                        </td>
                                        <td>{new Date(requ.createdDate).toLocaleDateString()}</td>
                                        <td>Active</td>
                                        <td>
                                            <FontAwesomeIcon icon={faTrash} className='arrow-icon' onClick={() => handleDelete(requ._id)} />
                                            <FontAwesomeIcon icon={faEdit} className="arrow-icon" onClick={() => handleUpdate(requ._id)} />
                                            <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" onClick={() => handleRequirementClick(requ._id)} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>No Requirements Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </MainSection>
            </div>
        </>
    );

};

export default RequirementsPage;
