import React from 'react';
import './style.scss';

import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "basicui";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { fetchRequirements, postRequirements } from "./service";
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
    const handleModalClose = () => setIsModalOpen(false);
    const handleModalOpen = () => setIsModalOpen(true);
    const [formData, setFormData] = useState({ reqDescription: "", });

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
        try {
            await postRequirements(reqCreatePayload);
            const newRequirements = await fetchRequirements();
            setRequirements(newRequirements);
            handleModalClose();
        } catch (error) {
            console.error("Error submitting Requirement:", error);
        }
    };

    if (loading) return <p>Loading Requirements...</p>;
    if (error) return <p>{error}</p>;

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
                            <ModalHeader onClose={handleModalClose} heading="New Requirement"></ModalHeader>
                            <ModalBody>
                                <label>
                                    Type your description:{" "}
                                    <input name="reqDescription" value={formData.reqDescription} onChange={handleChange} />
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
                                <th>Description</th>
                                <th>Created Date</th>
                                <th>Status</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requirements?.length > 0 ? (
                                requirements.map((requ) => (
                                    <tr key={requ._id} onClick={() => handleRequirementClick(requ._id)}>
                                        <td className="description-column">{requ.description}
                                        </td>
                                        <td>{new Date(requ.createdDate).toLocaleDateString()}</td>
                                        <td>"Active"</td>
                                        <td>
                                            Available Options
                                            <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
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
