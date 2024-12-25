import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import IconsForVoucherType from "../../../Components/CPComponents/CPIcons/IconsForVoucherType";
import SimpleBar from "simplebar-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const ReviewPending = ({ queries }) => {
    const navigate = useNavigate();

    // Utility: Format date
    const formatDate = (date) => moment.utc(date).local().format("DD MMM - hh:mm A");

    // Utility: Render query status
    const renderQueryStatus = (query) => {
        // Exclude queries based on the new conditions
        if (!query.IsApproved) return false; // Exclude if IsApproved is false
        if (query.CurrentStatus === "Review Pending") return false; // Exclude if CurrentStatus is "Review Pending"
        if (query.CurrentStatus === "Done") return false; // Exclude if CurrentStatus is "Done"

        return true; // Include in filtered queries otherwise
    };

    // Filter queries based on the updated logic
    const filteredQueries = queries?.filter(renderQueryStatus) || [];


    // Handle card click: Navigate to ticket details page
    const handleCardClick = (queryData) => {
        navigate(`/Support/TrackQuery?QueryID=${queryData.SupportID}`);
    };

    // Render single query item
    const renderQueryItem = (query, index) => (
        <div
            key={query.SupportID}
            onClick={() => handleCardClick(query)}
            className="text-muted px-3 py-2"
            style={{
                cursor: "pointer",
                borderBottom: "1px solid #e9ecef",
                backgroundColor:
                    index % 2 === 0
                        ? "rgba(208, 233, 255, 0.2)"
                        : "rgba(208, 255, 214, 0.2)",
            }}
        >
            <div className="d-flex align-items-center">
                <div className="avatar-xs flex-shrink-0">
                    <span className="avatar-title bg-light rounded-circle">
                        {IconsForVoucherType(query.Module || "N/A")}
                    </span>
                </div>
                <div className="flex-grow-1 ms-2">
                    <h6 className="fs-14 mb-1">{query.Module || "N/A"}</h6>
                    <Row>
                        <span className="text-muted fs-12 mb-0">
                            <i className="mdi mdi-circle-medium text-success fs-15 me-1"></i>
                            Date: {formatDate(query.ReportDateTime)}
                        </span>
                        <span className="text-muted fs-12 mb-0">
                            <i className="mdi mdi-circle-medium text-success fs-15 me-1"></i>
                            User: {query.TicketUser}
                        </span>
                        <span className="text-muted fs-12 mb-0">
                            <i className="mdi mdi-circle-medium text-success fs-15 me-1"></i>
                            Subject: {query.QuerySubject}
                        </span>
                        <span className="text-muted fs-12 mb-0">
                            <i className="mdi mdi-circle-medium text-success fs-15 me-1"></i>
                            Support User: {query.SupportUser}
                        </span>
                        <span className="text-muted fs-12 mb-0">
                            <i className="mdi mdi-circle-medium text-success fs-15 me-1"></i>
                            Status: {query.Status}
                        </span>
                    </Row>
                </div>
            </div>
        </div>
    );

    if (filteredQueries.length === 0) {
        return <p className="text-muted">No Currently Active queries available.</p>;
    }

    return (
        <Col xxl={12}>
            <Card className="card-height-100">
                <CardHeader className="card-header align-items-center d-flex">
                    {IconsForVoucherType("Currently Active Queries")}
                    <h4 className="card-title mb-0 flex-grow-1">Currently Active Queries</h4>
                    <div className="fs-16 fw-bold">{filteredQueries.length}</div>
                </CardHeader>
                <CardBody className="p-0">
                    <SimpleBar style={{ height: "435px" }}>
                        <div className="p-0">
                            {filteredQueries.map(renderQueryItem)}
                        </div>
                    </SimpleBar>
                </CardBody>
            </Card>
        </Col>
    );
};

// PropTypes for validation
ReviewPending.propTypes = {
    queries: PropTypes.arrayOf(
        PropTypes.shape({
            CurrentStatus: PropTypes.string,
            SupportID: PropTypes.string.isRequired,
            ReportDateTime: PropTypes.string.isRequired,
            Module: PropTypes.string,
            TicketUser: PropTypes.string,
            QuerySubject: PropTypes.string,
            SupportUser: PropTypes.string,
            Status: PropTypes.string,
        })
    ),
};

export default ReviewPending;
