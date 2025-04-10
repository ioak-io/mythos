import React from "react";
import {
    Button, Modal, ModalBody, ModalFooter, ModalHeader, ThemeType
} from "basicui";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faClose,
    faPen,
    faMagicWandSparkles,
    faPlus,
    faTrashAlt,
    faFileExport,
} from "@fortawesome/free-solid-svg-icons";
import "./style.scss";
import { deleteSingleTestcase, deleteTestcases, fetchTestcases, generateTestcases } from "./service";
import Topbar from "../../Topbar";
import MainSection from "../../MainSection";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

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
    const location = useLocation();
    const params = location.pathname.split('/');
    const space = params[1];
    const appId = params[3];
    const reqId = params[5];
    const useId = params[7];

    useEffect(() => {
        if (location.state?.refresh) {
            fetchTestcases(space, appId, reqId, useId);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state]);

    useEffect(() => {
        const loadTestcases = async () => {
            try {
                const data = await fetchTestcases(space, appId, reqId, useId);
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
        await deleteTestcases(space, appId, reqId, useId);
        try {
            await generateTestcases(space, appId, reqId, useId);
            const newtestcase = await fetchTestcases(space, appId, reqId, useId);
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
            await deleteSingleTestcase(space, appId, reqId, useId, testcaseToDelete);
            const updated = await fetchTestcases(space, appId, reqId, useId);
            setTestcases(updated);
        } catch (error) {
            console.error("Error Deleting Usecase:", error);
        } finally {
            setLoading(false);
            handleDeleteModalClose();
        }
    };

    const handleEditTestcaseClick = async (id: string | null) => {
        navigate(`/${space}/application/${appId}/requirement/${reqId}/usecase/${useId}/testcase/edit${id ? `/${id}` : ''}`)
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Testcases");
    
        worksheet.columns = [
            { header: "ApplicationID", key: "appId", width: 20 },
            { header: "RequirementID", key: "reqId", width: 20 },
            { header: "UsecaseID", key: "useId", width: 20 },
            { header: "Overview", key: "overview", width: 30 },
            { header: "Steps", key: "steps", width: 50 },
            { header: "Expected Outcome", key: "expectedOutcome", width: 30 },
            { header: "Label", key: "label", width: 20 },
            { header: "Priority", key: "priority", width: 15 },
        ];
    
        testcases.forEach((testcase) => {
            worksheet.addRow({
                appId: appId,
                reqId: reqId,
                useId: useId,
                overview: testcase.description.overview,
                steps: testcase.description.steps.join("\n"),
                expectedOutcome: testcase.description.expectedOutcome,
                label: testcase.label,
                priority: testcase.priority,
            });
        });
    
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFEEEEEE' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
    
        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.alignment = { wrapText: true, vertical: 'top' };
            });
        });
    
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, "testcases.xlsx");
    };
    

    return (
        <div className="testcases-page">
            <Topbar title="Testcase">
                <div className="topbar-actions">
                    <Button onClick={() => handleEditTestcaseClick(null)} disabled={loading}>
                        <FontAwesomeIcon icon={faPlus} />
                        Testcase
                    </Button>
                    <Button onClick={handleGenerateTestcase} loading={loading} disabled={loading}>
                        <FontAwesomeIcon icon={faMagicWandSparkles}></FontAwesomeIcon>
                        Generate Testcase
                    </Button>
                    <Button onClick={exportToExcel} disabled={loading}>
                        <FontAwesomeIcon icon={faFileExport}></FontAwesomeIcon>
                        Export
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
                            <th colSpan={2}>Priority</th>
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
                                    <td className="text-column">{testcase.label}</td>
                                    <td className="text-column">{testcase.priority}</td>
                                    <td className="actions-column">
                                        <div className="actions-wrapper">
                                            <Button onClick={() => confirmDelete(testcase._id)} disabled={loading}>
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </Button>
                                            <Button onClick={() => handleEditTestcaseClick(testcase._id)} disabled={loading}>
                                                <FontAwesomeIcon icon={faPen} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>))) : (
                            <tr>
                                <td colSpan={6}> No Testcases Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </MainSection>
            <Modal isOpen={isDeleteModalOpen} onClose={handleDeleteModalClose}>
                <ModalBody>
                    Are you sure you want to delete this testcase? This action cannot be undone.
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
    );
};

export default TestcasesPage;
