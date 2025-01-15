import React from "react";
import {
    Button, Modal, ModalBody, ModalFooter, ModalHeader
} from "basicui";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import "./style.scss";
import { fetchTestcases, generateTestcases, postTestcases } from "./service";
import Topbar from "../../Topbar";
import MainSection from "../../MainSection";

interface FormData {
    testcaseOverview: string;
    testcaseSteps: string;
    stepsArray: string[];
    testcaseOutcome: string;
    testcaseLabel: string;
    testcasePriority: string;
}

const TestcasesPage = () => {
    const [testcases, setTestcases] = useState<TestCase[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModalClose = () => setIsModalOpen(false);
    const handleModalOpen = () => setIsModalOpen(true);
    const [formData, setFormData] = useState<FormData>({ testcaseOverview: "", testcaseSteps: "", stepsArray: [], testcaseOutcome: "", testcaseLabel: "", testcasePriority: "" });

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const testcaseCreatePayload = {
            description: {
                overview: formData.testcaseOverview,
                steps: formData.stepsArray,
                expectedOutcome: formData.testcaseOutcome
            },
            comments: formData.testcaseLabel,
            priority: formData.testcasePriority
        };
        try {
            await postTestcases(testcaseCreatePayload);
            const newTestcases = await fetchTestcases();
            setTestcases(newTestcases);
            handleModalClose();
        } catch (error) {
            console.error("Error submitting Requirement:", error);
        }
    };

    const handleGenerateTestcase = async () => {
        try {
            await generateTestcases();
            const newtestcase = await fetchTestcases();
            setTestcases(newtestcase);
        } catch (error) {
            console.error("Error Submitting Usecase: ", error);
        }
    };

    if (loading) return <p>Loading Testcases...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="testcases-page">
            <Topbar title="Testcase">
                <div className="topbar-actions">
                    <Button onClick={handleModalOpen}>
                        <FontAwesomeIcon icon={faPlus} />
                        New Testcase
                    </Button>
                    <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                        <ModalHeader onClose={handleModalClose} heading="New Testcase"></ModalHeader>
                        <ModalBody>
                            <label>
                                Overview:{" "}
                                <input name="testcaseOverview" value={formData.testcaseOverview} onChange={handleChange} />
                            </label>
                            <label>
                                Steps Separated by Full Stop (.):
                                <input
                                    name="testcaseSteps"
                                    value={formData.testcaseSteps}
                                    onChange={(e) => {
                                        const stepsString = e.target.value;
                                        const stepsArray = stepsString.split('.').filter((step) => step.trim() !== "");
                                        setFormData((prevData) => ({
                                            ...prevData,
                                            testcaseSteps: stepsString,
                                            stepsArray,
                                        }));
                                    }}
                                />
                            </label>
                            <label>
                                Expected Outcome:{" "}
                                <input name="testcaseOutcome" value={formData.testcaseOutcome} onChange={handleChange} />
                            </label>
                            <label>
                                Label:{" "}
                                <select
                                    name="testcaseLabel"
                                    value={formData.testcaseLabel}
                                    onChange={handleChange}
                                >
                                    <option value="positive">Positive Testcase</option>
                                    <option value="negative">Negative Testcase</option>
                                    <option value="edge case">Edge case Testcase</option>
                                    <option value="alternative flow">Alternative Flow Testcase</option>
                                </select>
                            </label>
                            <label>
                                Priority Level:{" "}
                                <select
                                    name="testcasePriority"
                                    value={formData.testcasePriority}
                                    onChange={handleChange}
                                >
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
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
                    <Button onClick={handleGenerateTestcase}>
                        Generate Testcase
                    </Button>
                </div>
            </Topbar>
            <MainSection>
                <table className="basicui-table">
                    <thead>
                        <tr>
                            <th>Overview</th>
                            <th>Steps</th>
                            <th>Expected Outcome</th>
                            <th>Label</th>
                            <th>Priority</th>
                            <th>Created Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testcases.map((testcase) => (
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </MainSection>
        </div>
    );
};

export default TestcasesPage;
