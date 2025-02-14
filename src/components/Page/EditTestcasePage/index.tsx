import React, { useEffect, useState } from "react";
import Topbar from "../../Topbar";
import './style.scss';
import { Button, Input, Label, Select, Textarea, ThemeType } from "basicui";
import { OptionsObjectType } from "basicui/components/shared/OptionsList";
import MainSection from "../../MainSection";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchSingleTestcase, postTestcases, updateTestcase } from "./service";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { BlockQuote, Bold, BulletList, ClearFormatting, Editor, HeadingDropdown, HighlightColor, Italic, OrderedList, Underline } from "writeup";
import { getEditorConfig } from "../../../utils/EditorUtils";

interface FormData {
    testcaseOverview: string;
    testcaseSteps: string;
    testcaseOutcome: string;
    testcaseLabel: string;
    testcasePriority: string;
};

const labelOptions: OptionsObjectType[] = [
    { name: "Positive Testcase", value: "Positive" },
    { name: "Negative Testcase", value: "Negative" },
    { name: "Edge Case Testcase", value: "Edge Case" },
    { name: "Alternative Flow Testcase", value: "Alternative Flow" },
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
        testcaseOutcome: "",
        testcaseLabel: "",
        testcasePriority: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const location = useLocation();
    const params = location.pathname.split('/');
    const space = params[1];
    const appId = params[3];
    const reqId = params[5];
    const useId = params[7];
    const testId = params[10] ? params[10] : null;
    const isEdit = Boolean(testId);

    useEffect(() => {
        if (isEdit && id) {
            loadTestcase(id);
        }
    }, [isEdit, id]);

    const loadTestcase = async (testcaseId: string) => {
        setLoading(true);
        try {
            const testcases = await fetchSingleTestcase(space, appId, reqId, useId, testcaseId);
            const testcase = Array.isArray(testcases) ? testcases[0] : testcases;

            if (!testcase) {
                throw new Error('Testcase not found');
            }

            setFormData({
                testcaseOverview: testcase.description.overview,
                testcaseSteps: testcase.description.steps.join(". "),
                testcaseOutcome: testcase.description.expectedOutcome,
                testcaseLabel: testcase.label || '',
                testcasePriority: testcase.priority
            });
        } catch (err) {
            setError("Failed to load testcase");
        } finally {
            setLoading(false);
        }
    };

    const editor = getEditorConfig();

    useEffect(() => {
        if (editor && formData.testcaseSteps) {
            setTimeout(() => {
                editor.commands.setContent(formData.testcaseSteps);
            }, 100);
        }
    }, [editor, formData.testcaseSteps]);
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const htmlContent = editor?.getHTML() || '';
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const listItems = doc.querySelectorAll('li');

        let steps: string[];
        if (listItems.length > 0) {
            steps = Array.from(listItems).map(li => li.textContent?.trim() || '');
        } else {
            const textContent = editor?.getText() || '';
            steps = (textContent.split(/\.|\n/) as string[])
                .map(step => step.trim())
                .filter(step => step);
        }

        const testcasePayload = {
            description: {
                overview: formData.testcaseOverview,
                steps: steps,
                expectedOutcome: formData.testcaseOutcome
            },
            comments: formData.testcaseLabel,
            priority: formData.testcasePriority
        };

        try {
            if (testId) {
                await updateTestcase(space, appId, reqId, useId, testId, testcasePayload);
            } else {
                await postTestcases(space, appId, reqId, useId, testcasePayload);
            }
            navigate(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase`, {
                state: { refresh: true }
            });
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
                    <Label>Enter the testcase steps</Label>
                    <Editor editor={editor} >
                        <HeadingDropdown editor={editor} />
                        <Bold editor={editor} />
                        <Italic editor={editor} />
                        <Underline editor={editor} />
                        <BulletList editor={editor} />
                        <OrderedList editor={editor} />
                        <BlockQuote editor={editor} />
                        <HighlightColor editor={editor} />
                        <ClearFormatting editor={editor} />
                    </Editor>
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