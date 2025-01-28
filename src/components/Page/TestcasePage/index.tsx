import React from "react";
import {
    Button, Modal, ModalBody, ModalFooter, ModalHeader, ThemeType
} from "basicui";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faClose,
    faEdit,
    faMagicWandSparkles,
    faPlus,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./style.scss";
import { deleteSingleTestcase, deleteTestcases, fetchTestcases, generateTestcases} from "./service";
import Topbar from "../../Topbar";
import MainSection from "../../MainSection";
import { useNavigate } from "react-router-dom";
import { space } from "../LandingPage";
import { appId } from "../ApplicationsPage";
import { reqId } from "../RequirementsPage";
import { useId } from "../UsecasePage";

export let testId: string | null = null;

const TestcasesPage = () => {
    const [testcases, setTestcases] = useState<TestCase[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [testcaseToDelete, setTestcaseToDelete] = useState<string | null>(null);

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
        setTestcaseToDelete(null);
    };

    useEffect(() => {
        const loadTestcases = async () => {
            try {
                const data = await fetchTestcases();
                setTestcases(data);
            } catch (err) {
                setError("Data Could Not Be Fetched");
            } finally {
                setLoading(false);
            }
        };

        loadTestcases();
    }, []);

    const handleGenerateTestcase = async () => {
        setLoading(true);
        await deleteTestcases();
        try {
            await generateTestcases();
            const newtestcase = await fetchTestcases();
            setTestcases(newtestcase);
        } catch (error) {
            console.error("Error Submitting Usecase: ", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id: string) => {
        setTestcaseToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!testcaseToDelete) return;
        setLoading(true);
        try {
            await deleteSingleTestcase(testcaseToDelete);
            const updated = await fetchTestcases();
            setTestcases(updated);
        } catch (error) {
            console.error("Error Deleting Usecase:", error);
        } finally {
            setLoading(false);
            handleDeleteModalClose();
        }
    };

    const handleEditTestcaseClick = async (id: string | null) => {
        testId = id;
        navigate(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase/edit${id ? `/${id}` : ''}`)
    };

    return (
        <div className="testcases-page">
            <Topbar title="Testcase">
                <div className="topbar-actions">
                    <Button onClick={()=>handleEditTestcaseClick(null)}>
                        <FontAwesomeIcon icon={faPlus} />
                        New Testcase
                    </Button>
                    <Button onClick={handleGenerateTestcase} loading={loading}>
                        <FontAwesomeIcon icon={faMagicWandSparkles}></FontAwesomeIcon>
                        Generate Testcase
                    </Button>
                </div>
            </Topbar>
            <MainSection>
                <table className="basicui-table table-hover">
                    <thead>
                        <tr>
                            <th>Overview</th>
                            <th>Steps</th>
                            <th>Expected Outcome</th>
                            <th>Label</th>
                            <th>Priority</th>
                            <th>Created Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {testcases?.length > 0 ? (
                        testcases.map((testcase) => (
                            <tr key={testcase._id}>
                                <td className="text-column">{testcase.description.overview}</td>
                                <td className="description-column">
                                    <ul>
                                        {testcase.description.steps.map((step: string, index: number) => (
                                            <li key={index}>{step.trim()}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="text-column">{testcase.description.expectedOutcome}</td>
                                <td className="text-column">{testcase.comments}</td>
                                <td>{testcase.priority}</td>
                                <td>{new Date(testcase.createdDate).toLocaleDateString()}</td>
                                <td className="options-column">
                                    <Button onClick={() => confirmDelete(testcase._id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                    <Button onClick={() => handleEditTestcaseClick(testcase._id)} >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Button>
                                </td>
                            </tr>))):(
                                <tr>
                                    <td colSpan={7}> No Testcases Found</td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </MainSection>
            <Modal isOpen={isDeleteModalOpen} onClose={handleDeleteModalClose}>
                <ModalHeader border={true} onClose={handleDeleteModalClose} heading="Confirm Deletion"></ModalHeader>
                <ModalBody>
                    Are you sure you want to delete this testcase? This action cannot be undone.
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
    );
};

export default TestcasesPage;
