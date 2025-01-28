import React, { useEffect, useState } from "react";
import Topbar from "../../Topbar";
import './style.scss';
import { Button, Input, Select, Textarea, ThemeType } from "basicui";
import { OptionsObjectType } from "basicui/components/shared/OptionsList";
import MainSection from "../../MainSection";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { testId } from "../TestcasePage";
import { fetchSingleTestcase, postTestcases, updateTestcase } from "./service";
import { faClose } from "@fortawesome/free-solid-svg-icons";

interface FormData {
    testcaseOverview: string;
    testcaseSteps: string;
    stepsArray: string[];
    testcaseOutcome: string;
    testcaseLabel: string;
    testcasePriority: string;
};

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

const EditTestcasePage = () => {
    const [formData, setFormData] = useState<FormData>({
        testcaseOverview: "",
        testcaseSteps: "",
        stepsArray: [],
        testcaseOutcome: "",
        testcaseLabel: "",
        testcasePriority: ""
    });
    const [testcases, setTestcases] = useState<TestCase[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentTestcaseId, setCurrentTestcaseId] = useState<string | null>(null);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const isEdit = Boolean(testId);

    useEffect(() => {
        if (isEdit && id) {
            loadTestcase(id);
        }
    }, [isEdit, id]);

    const loadTestcase = async (testcaseId: string) => {
        setLoading(true);
        try {
            const testcases = await fetchSingleTestcase(testcaseId);
            const testcase = Array.isArray(testcases) ? testcases[0] : testcases;

            if (!testcase) {
                throw new Error('Testcase not found');
            }

            setFormData({
                testcaseOverview: testcase.description.overview,
                testcaseSteps: testcase.description.steps.join(". "),
                stepsArray: testcase.description.steps,
                testcaseOutcome: testcase.description.expectedOutcome,
                testcaseLabel: testcase.comments || '',
                testcasePriority: testcase.priority
            });
        } catch (err) {
            setError("Failed to load testcase");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const testcasePayload = {
            description: {
                overview: formData.testcaseOverview,
                steps: formData.stepsArray,
                expectedOutcome: formData.testcaseOutcome
            },
            comments: formData.testcaseLabel,
            priority: formData.testcasePriority
        };

        try {
            if (id) {
                await updateTestcase(id, testcasePayload);
            } else {
                await postTestcases(testcasePayload);
            }
            navigate(-1);
        } catch (err) {
            setError("Failed to save testcase");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChange = (e: any, name: string) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: e.currentTarget.value,
        }));
    };

    const handleStepsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const stepsString = e.target.value;
        const stepsArray = stepsString.split('.').filter(step => step.trim() !== '');

        setFormData(prevData => ({
            ...prevData,
            testcaseSteps: stepsString,
            stepsArray: stepsArray,
        }));
    };

    return (
        <div>
            <Topbar title={isEdit ? "Edit Testcase" : "New Testcase"} />
            <MainSection>
                <form>
                    {error && <div className="error-message">{error}</div>}
                    <Textarea
                        id="testcaseOverview"
                        name="testcaseOverview"
                        label="Overview"
                        value={formData.testcaseOverview}
                        placeholder="Enter the testcase overview"
                        onChange={handleTextChange}
                    />
                    <Textarea
                        id="testcaseSteps"
                        name="testcaseSteps"
                        label="Steps Separated by Full Stop (.)"
                        value={formData.testcaseSteps}
                        placeholder="Enter steps separated by a full stop"
                        onChange={handleStepsChange}
                    />
                    <Textarea
                        id="testcaseOutcome"
                        name="testcaseOutcome"
                        label="Expected Outcome"
                        value={formData.testcaseOutcome}
                        placeholder="Enter the expected outcome"
                        onChange={handleTextChange}
                    />
                    <Select
                        name="testcaseLabel"
                        options={labelOptions}
                        label="Label"
                        value={formData.testcaseLabel ? [formData.testcaseLabel] : []}
                        placeholder="Select a label"
                        onChange={(e: any) => handleSelectChange(e, 'testcaseLabel')}
                    />
                    <Select
                        name="testcasePriority"
                        options={priorityOptions}
                        label="Priority Level"
                        value={formData.testcasePriority ? [formData.testcasePriority] : []}
                        placeholder="Select priority level"
                        onChange={(e: any) => handleSelectChange(e, 'testcasePriority')}
                    />
                    <div className="footer">
                        <div className="footer-right">

                            <Button onClick={handleCancel} theme={ThemeType.default}>
                                <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
                            </Button>
                            <Button theme={ThemeType.default} loading={loading} onClick={handleSubmit}>
                                {isEdit ? "Update" : "Create"} Testcase
                            </Button>
                        </div>
                    </div>
                </form>
            </MainSection>
        </div>
    );
};

export default EditTestcasePage;