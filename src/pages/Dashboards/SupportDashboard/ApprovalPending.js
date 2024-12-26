// Updated imports
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Label,
    Accordion,
    AccordionItem,
    Collapse
} from "reactstrap";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { POST_ApprovalPending} from "../../../slices/thunks";
import classnames from "classnames";
const ApprovalPendingModal = ({ modalOpen, selectedRow, onClose }) => {

    const data=useSelector((state)=>state.ApprovalPending.data);
    const error = useSelector((state) => state.ApprovalPending.error);
    const loading = useSelector((state) => state.ApprovalPending.loading);
    const success = useSelector((state) => state.ApprovalPending.success);
    const dispatch = useDispatch();
    const vendorUser = JSON.parse(localStorage.getItem("vendorUser"));
    const userRole = localStorage.getItem("userRole");
    const formatLocalDateTime = (date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 16);
    };
    const [clientName, setClientName] = useState("");
    const dummyData = {
        name: vendorUser.subUserName,
        mobile: localStorage.getItem("mobileNumber"),
        email: localStorage.getItem("userName"),
        ticketNo: (parent === "Dashboard") ? ticketData : selectedRow?.TicketNumber,
        clientName: clientName,
        dateTime: formatLocalDateTime(new Date()),
    };

    useEffect(() => {
        const storedClientName = vendorUser.subscriberName;
        setClientName(
            storedClientName || `${vendorUser.subscriberCode} - ${vendorUser.subscriberName}`
        );
    }, [vendorUser]);

    const [modal, setModal] = useState(modalOpen);

    useEffect(() => {
        setModal(modalOpen); // Sync modal state with parent
    }, [modalOpen]);

    const toggleModal = () => {
        setModal(!modal);
        if (onClose) onClose(); // Notify parent about closing
    };

    const validationSchema = Yup.object({
        ApprovalRemarks: Yup.string().required("Approval Remarks are required"),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const payload = {
                SupportID: selectedRow.SupportID,
                IsRejected: values.IsRejected,
                IsApproved: values.IsApproved,
                ApprovedOn: moment().format(),
                ApprovedBy: JSON.parse(localStorage.getItem("vendorUser")).subUserID,
                ApprovalRemarks: values.ApprovalRemarks,
            };

            await dispatch(POST_ApprovalPending({ body: payload }));
            toggleModal(); // Close modal after submission
        } catch (error) {
            alert(error)
            console.error("Error during form submission:", error);
        } finally {
            setSubmitting(false);
        }
    };
    const [col1, setCol1] = useState(true);
    const [col2, setCol2] = useState(false);
    const [col3, setCol3] = useState(false);

    const toggleCol1 = () => {
        setCol1(!col1);
        setCol2(false);
        setCol3(false);
    };

    const toggleCol2 = () => {
        setCol2(!col2);
        setCol1(false);
        setCol3(false);
    };
    const formControlSm = {
        height: "30px",
        fontSize: "12px",
        padding: "5px",
    };
    const toggleCol3 = () => {
        setCol3(!col3);
        setCol1(false);
        setCol2(false);
    };
    return (
        <Modal isOpen={modal} toggle={toggleModal} size="lg">
            <ModalHeader toggle={toggleModal}>Approval Pending Query</ModalHeader>
            <ModalBody>
                {selectedRow ? (
                    <Formik
                        initialValues={{
                            IsRejected: false,
                            IsApproved: false,
                            ApprovalRemarks: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ setFieldValue }) => (
                            <Form>
                                <Row className="gy-3">
                                    <Accordion id="query-details-accordion" flush>
                                        <AccordionItem className="material-shadow" style={{ border: "1px solid #dee2e6" }}>
                                            <h2 className="accordion-header" id="headingSubject">
                                                <button
                                                    className={classnames("accordion-button", { collapsed: !col1 })}
                                                    type="button"
                                                    onClick={toggleCol1}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    Query Details
                                                </button>
                                            </h2>
                                            <Collapse isOpen={col1} className="accordion-collapse">
                                                <div className="accordion-body">
                                                    <Row
                                                        style={{
                                                            margin: "0",
                                                            padding: "10px",
                                                            border: "1px solid #dee2e6",
                                                            borderRadius: "5px",
                                                            backgroundColor: "#f8f9fa",
                                                        }}
                                                    >
                                                        <Col xs={12} style={{ fontSize: "12px" }}>
                                                            {/* Name and Ticket No */}
                                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                <span style={{ fontWeight: "bold" }}>{dummyData.name}</span>
                                                                <div>
                                                                    <span style={{ fontWeight: "bold" }}>
                                                                        {dummyData.ticketNo}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Mobile No & Email */}
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    justifyContent: "space-between",
                                                                    alignItems: "center", // Align vertically for better appearance
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        color: "#6c757d",
                                                                        maxWidth: "50%", // Set a maximum width
                                                                        overflow: "hidden",
                                                                        whiteSpace: "nowrap",
                                                                        textOverflow: "ellipsis",
                                                                    }}
                                                                    title={`${dummyData.mobile} | ${dummyData.email}`} // Tooltip for full data
                                                                >
                                                                    {dummyData.mobile} | {dummyData.email}
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        maxWidth: "50%", // Set a maximum width
                                                                        overflow: "hidden",
                                                                        whiteSpace: "nowrap",
                                                                        textOverflow: "ellipsis",
                                                                    }}
                                                                    title={new Date(dummyData.dateTime).toLocaleString(undefined, {
                                                                        year: "numeric",
                                                                        month: "2-digit",
                                                                        day: "2-digit",
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    })} // Tooltip for full date and time
                                                                >
                                                                    {new Date(dummyData.dateTime).toLocaleString(undefined, {
                                                                        year: "numeric",
                                                                        month: "2-digit",
                                                                        day: "2-digit",
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    })}
                                                                </span>
                                                            </div>

                                                            {/* Client Name */}
                                                            <div>
                                                                <span>{dummyData.clientName}</span>
                                                            </div>

                                                            
                                                        </Col>
                                                    </Row>
                                                    {/* Query Menu */}
                                                    {/* Query Menu */}
                                                    {/* Query Menu */}
                                                    {/* Query Menu */}
                                                    <div style={{ marginTop: "10px" }}>
                                                        <label htmlFor="QueryMenu" style={{ fontWeight: "bold" }}>Query Menu:</label>
                                                        <input
                                                            type="text"
                                                            id="QueryMenu"
                                                            style={{
                                                                ...formControlSm,
                                                                backgroundColor: "#f8f9fa", // Light gray background for disabled look
                                                                color: "#6c757d",          // Muted text color
                                                                cursor: "not-allowed",     // Change cursor to indicate non-editable
                                                            }}
                                                            className="form-control"
                                                            value={selectedRow.MenuCode || "N/A"}
                                                            readOnly
                                                        />
                                                    </div>

                                                    {/* Query Subject */}
                                                    <div style={{ marginTop: "10px" }}>
                                                        <label htmlFor="QuerySubject" style={{ fontWeight: "bold" }}>Query Subject:</label>
                                                        <input
                                                            type="text"
                                                            id="QuerySubject"
                                                            style={{
                                                                ...formControlSm,
                                                                backgroundColor: "#f8f9fa", // Light gray background for disabled look
                                                                color: "#6c757d",          // Muted text color
                                                                cursor: "not-allowed",     // Change cursor to indicate non-editable
                                                            }}
                                                            className="form-control"
                                                            value={selectedRow.QuerySubject || "N/A"}
                                                            readOnly
                                                        />
                                                    </div>

                                                    {/* Query Description */}
                                                    <div style={{ marginTop: "10px" }}>
                                                        <label htmlFor="QueryDescription" style={{ fontWeight: "bold" }}>Query Description:</label>
                                                        <textarea
                                                            id="QueryDescription"
                                                            style={{
                                                                ...formControlSm,
                                                                backgroundColor: "#f8f9fa", // Light gray background for disabled look
                                                                color: "#6c757d",          // Muted text color
                                                                height: "100px",           // Adjust height as needed
                                                                resize: "none",            // Disable resizing if required
                                                                cursor: "not-allowed",     // Change cursor to indicate non-editable
                                                            }}
                                                            className="form-control"
                                                            value={selectedRow.QueryDescription || "N/A"}
                                                            readOnly
                                                        />
                                                    </div>



                                                </div>

                                            </Collapse>
                                        </AccordionItem>


                                    </Accordion>
                                    <Col xs={12}>
                                        <Label for="ApprovalRemarks">Approval Remarks:</Label>
                                        <Field
                                            name="ApprovalRemarks"
                                            as="textarea"
                                            rows="4"
                                            className="form-control"
                                        />
                                        <ErrorMessage
                                            name="ApprovalRemarks"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </Col>
                                </Row>
                                <br />
                                <ModalFooter>

                                    <Button
                                        color="success"
                                        onClick={() => {
                                            setFieldValue("IsRejected", false);
                                            setFieldValue("IsApproved", true);
                                        }}
                                        type="submit"
                                    >
                                        Approve Query
                                    </Button>
                                    <Button
                                        color="danger"
                                        onClick={() => {
                                            setFieldValue("IsRejected", true);
                                            setFieldValue("IsApproved", false);
                                        }}
                                        type="submit"
                                    >
                                        Reject Query
                                    </Button>
                                    <Button color="secondary" onClick={toggleModal}>
                                        Close
                                    </Button>
                                </ModalFooter>
                            </Form>
                        )}
                    </Formik>
                ) : (
                    <p>No data available.</p>
                )}
            </ModalBody>
        </Modal>
    );
};

export default ApprovalPendingModal;
