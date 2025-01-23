import React from "react";
import {
    Button, Modal, ModalBody, ModalFooter, ModalHeader, Input,
    Select,
    ThemeType
} from "basicui";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEdit,
    faPlus,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./style.scss";
import { deleteSingle, fetchTestcases, generateTestcases, postTestcases, updateTestcase } from "./service";
import Topbar from "../../Topbar";
import MainSection from "../../MainSection";
import { OptionsObjectType } from "basicui/components/shared/OptionsList";

interface FormData {
    testcaseOverview: string;
    testcaseSteps: string;
    stepsArray: string[];
    testcaseOutcome: string;
    testcaseLabel: string;
    testcasePriority: string ;
}

const labelOptions: OptionsObjectType[] = [
    { name: "Positive Testcase", value: "positive" },
    { name: "Negative Testcase", value: "negative" },
    { name: "Edge Case Testcase", value: "edge case" },
    { name: "Alternative Flow Testcase", value: "alternative flow" },
];

const priorityOptions: OptionsObjectType[] = [
    { name: "High", value: "high" },
    { name: "Medium", value: "medium" },
    { name: "Low", value: "low" },
];

const TestcasesPage = () => {
    const [testcases, setTestcases] = useState<TestCase[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModalOpen = () => setIsModalOpen(true);
    const [formData, setFormData] = useState<FormData>({ testcaseOverview: "", testcaseSteps: "", stepsArray: [], testcaseOutcome: "", testcaseLabel: "", testcasePriority: "" });
    const [currentTestcaseId, setCurrentTestcaseId] = useState<string | null>(null);

    const handleModalClose = () => {
        setIsModalOpen(false);
        setFormData({ testcaseOverview: "", testcaseSteps: "", stepsArray: [], testcaseOutcome: "", testcaseLabel: "", testcasePriority: "" });
        setCurrentTestcaseId(null);
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
        setLoading(true);
        try {
            if (currentTestcaseId) {
                await updateTestcase(currentTestcaseId, testcaseCreatePayload);
            } else {
                await postTestcases(testcaseCreatePayload);
            };
            const newTestcases = await fetchTestcases();
            setTestcases(newTestcases);
            handleModalClose();
        } catch (error) {
            console.error("Error submitting Requirement:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateTestcase = async () => {
        setLoading(true);
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

    const handleDelete = async (id: string) => {
        try {
            await deleteSingle(id);
            const updated = await fetchTestcases();
            setTestcases(updated);
        } catch (error) {
            console.error("Error Deleting Testcase:");
        }
    };

    const handleUpdate = (id: string) => {
        const testcaseToEdit = testcases.find((testcase) => testcase._id === id);
        if (!testcaseToEdit) return;

        setFormData({
            testcaseOverview: testcaseToEdit.description?.overview || "",
            testcaseSteps: testcaseToEdit.description?.steps.join(". ") || "",
            stepsArray: testcaseToEdit.description?.steps || [],
            testcaseOutcome: testcaseToEdit.description?.expectedOutcome || "",
            testcaseLabel: testcaseToEdit.comments || "",
            testcasePriority: testcaseToEdit.priority || "",
        });
        setCurrentTestcaseId(id);
        handleModalOpen();
    };

    const handleSelectChange = (selected: any) => {
        const value = selected ? selected[0]?.value : "";
        setFormData((prevData) => ({
            ...prevData,
            testcaseLabel: value,
        }));
    };

    return (
        <div className="testcases-page">
            <Topbar title="Testcase">
                <div className="topbar-actions">
                    <Button onClick={handleModalOpen}>
                        <FontAwesomeIcon icon={faPlus} />
                        New Testcase
                    </Button>
                    <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                        <ModalHeader onClose={handleModalClose} heading={currentTestcaseId ? "Update Testcase" : "New Testcase"}></ModalHeader>
                        <ModalBody>
                            {/* <label>
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
                            </label> */}
                            <label>
                                Overview:{" "}
                                <Input
                                    id="testcaseOverview"
                                    name="testcaseOverview"
                                    type="text"
                                    value={formData.testcaseOverview}
                                    placeholder="Enter the testcase overview"
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                Steps Separated by Full Stop (.):
                                <Input
                                    id="testcaseSteps"
                                    name="testcaseSteps"
                                    type="text"
                                    value={formData.testcaseSteps}
                                    placeholder="Enter steps separated by a full stop"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                                <Input
                                    id="testcaseOutcome"
                                    name="testcaseOutcome"
                                    type="text"
                                    value={formData.testcaseOutcome}
                                    placeholder="Enter the expected outcome"
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                Label:{" "}
                                <Select
                                    name="testcaseLabel"
                                    options={labelOptions}
                                    value={formData.testcaseLabel ? [formData.testcaseLabel] : []}
                                    placeholder="Select a label"
                                    onChange={(selected:any) => {
                                        setFormData((prevData) => ({
                                            ...prevData,
                                            testcaseLabel: selected.currentTarget.value,
                                        }));
                                    }}
                                />
                            </label>
                            <label >
                                Priority Level:{" "}
                                <Select
                                    name="testcasePriority"
                                    options={priorityOptions}
                                    value={formData.testcasePriority ? [formData.testcasePriority] : []}
                                    placeholder="Select priority level"
                                    onChange={(selected:any) => {
                                        setFormData((prevData) => ({
                                            ...prevData,
                                            testcasePriority: selected.currentTarget.value,
                                        }));
                                    }}
                                />
                            </label>
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
                    <Button onClick={handleGenerateTestcase} loading={loading}>
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
                                <td className="options-column">
                                    <FontAwesomeIcon icon={faTrash} className='arrow-icon' onClick={() => handleDelete(testcase._id)} />
                                    <FontAwesomeIcon icon={faEdit} className="arrow-icon" onClick={() => handleUpdate(testcase._id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </MainSection>
        </div>
    );
};

export default TestcasesPage;
