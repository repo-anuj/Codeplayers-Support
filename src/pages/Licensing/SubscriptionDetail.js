import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Badge, Row, Col, Button, Collapse } from "reactstrap";
import { GET_License_History } from "../../slices/Licensing/thunk";

// Utility function to format date
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const LicenseDetails = () => {
  const dispatch = useDispatch();
  const licenseHistoryData = useSelector((state) => state.LicenseHistory.data) || [];
  const [activeAccordion, setActiveAccordion] = useState(null); // State to track active accordion

  useEffect(() => {
    dispatch(GET_License_History());
  }, [dispatch]);

  const subscriptionDetails = {
    subscriptionKey: "50928300000",
    product: "Hotel Management",
    edition: "Enterprise Edition",
    additionalInfo: "Unlimited Multi User",
    amcValidTill: "31-Aug-2020",
    status: "Trial",
    computerName: "DEVELOPMENT",
    operatingSystem: "Microsoft Windows 11 Pro for Workstations",
    user: "DEVELOPMENT\\Codeplayers",
    publicIp: "45.124.144.253",
    localIp: "192.168.0.99",
  };

  // Toggle accordion section
  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <div
      style={{
        padding: "20px",
        marginTop: "50px",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Subscription Details */}
      <Card className="mt-3">
        <CardBody>
          <Row className="text-center">
            <Col xs="12" md="3" className="mb-3">
              <h6 style={{ fontWeight: "bold" }}>Subscription Key</h6>
              <h4 style={{ color: "#e83e8c" }}>{subscriptionDetails.subscriptionKey}</h4>
            </Col>
            <Col xs="12" md="2" className="mb-3">
              <h6 style={{ fontWeight: "bold" }}>Product</h6>
              <p style={{ fontSize: "1.1rem" }}>{subscriptionDetails.product}</p>
            </Col>
            <Col xs="12" md="3" className="mb-3">
              <h6 style={{ fontWeight: "bold" }}>Edition</h6>
              <p style={{ fontSize: "1.1rem" }}>
                {subscriptionDetails.edition}
                <Badge
                  color="dark"
                  style={{
                    marginLeft: "10px",
                    padding: "5px 10px",
                    fontSize: "0.85rem",
                  }}
                >
                  {subscriptionDetails.additionalInfo}
                </Badge>
              </p>
            </Col>
            <Col xs="12" md="2" className="mb-3">
              <h6 style={{ fontWeight: "bold" }}>AMC Valid Till</h6>
              <p style={{ fontSize: "1.1rem" }}>{subscriptionDetails.amcValidTill}</p>
            </Col>
            <Col xs="12" md="2" className="mb-3">
              <h6 style={{ fontWeight: "bold" }}>Status</h6>
              <Badge
                color="danger"
                style={{
                  padding: "5px 10px",
                  fontSize: "0.85rem",
                }}
              >
                {subscriptionDetails.status}
              </Badge>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Activation Details */}
      <Card className="mt-4 shadow-sm">
        <CardBody>
          <h5 style={{ fontWeight: "bold", marginBottom: "20px" }}>Activation Details</h5>
          <div className="d-flex flex-wrap justify-content-between align-items-start">
            <div style={{ flex: "1 1 25%", minWidth: "200px", marginBottom: "15px" }}>
              <h6 style={{ fontWeight: "bold", marginBottom: "8px", color: "#495057" }}>
                Computer Name
              </h6>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#212529" }}>
                {subscriptionDetails.computerName}
              </p>
            </div>
            <div style={{ flex: "1 1 25%", minWidth: "200px", marginBottom: "15px" }}>
              <h6 style={{ fontWeight: "bold", marginBottom: "8px", color: "#495057" }}>
                Operating System
              </h6>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#212529" }}>
                {subscriptionDetails.operatingSystem}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Activation History */}
      <Card style={{ marginTop: "20px" }}>
        <CardBody>
          <h5 style={{ fontWeight: "bold", marginBottom: "20px" }}>Activation History</h5>
          {licenseHistoryData.map((history, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <div
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e9ecef",
                  cursor: "pointer",
                }}
                onClick={() => toggleAccordion(index)}
              >
                <strong>Time:</strong> {formatDate(history.RequestDateTime)}
                <span
                  style={{
                    float: "right",
                    transform: activeAccordion === index ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                >
                  ▼
                </span>
              </div>
              <Collapse isOpen={activeAccordion === index}>
                <div
                  style={{
                    padding: "15px",
                    border: "1px solid #e9ecef",
                    borderTop: "none",
                  }}
                >
                  <p>
                    <strong>Action:</strong>{" "}
                    <Badge color="success">{history.Action}</Badge>
                  </p>
                  <p>
                    <strong>Mode:</strong> {history.Mode}
                  </p>
                  <p>
                    <strong>Computer:</strong>
                  </p>
                  <ul>
                    <li>
                      <strong>Name:</strong> {history.ComputerName}
                    </li>
                    <li>
                      <strong>OS:</strong> {history.OS}
                    </li>
                    <li>
                      <strong>User:</strong> {history.ComputerUserName}
                    </li>
                    <li>
                      <strong>IP Address:</strong> {history.RequestIP}
                    </li>
                  </ul>
                </div>
              </Collapse>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default LicenseDetails;
