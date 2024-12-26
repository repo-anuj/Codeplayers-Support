import React, { useState, useEffect } from "react";
import { Spinner, Card, CardHeader, CardBody, Button, Collapse } from "reactstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import CPBreadCrumbMasters from "../../Components/CPComponents/CPLayouts/CPBreadCrumbMasters";

const LicenseHistory = () => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState(null); // Track which accordion is active
  const navigate = useNavigate(); // Initialize useNavigate

  // Simulate data fetching
  useEffect(() => {
    setLicenses([
      {
        subscriptionKey: "50928300000",
        product: "Hotel Management",
        edition: "Enterprise Edition",
        additionalInfo: "Unlimited Multi User",
        issueDate: "16-Aug-2020",
        amcValidTill: "31-Aug-2020",
        status: "Trial",
      },
    ]);
    setLoading(false); // Stop loading after data is fetched
  }, []);

  // Navigate to subscription details
  const handleSubscriptionClick = (key) => {
    navigate("/subscription-details", { state: { subscriptionKey: key } });
  };

  // Toggle accordion section
  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: "#f4f5f7",
      }}
    >
      <CPBreadCrumbMasters title={"Licence History"} pageTitle={"Subscription"} />
      {/* Card Section */}
      <Card
        style={{
          width: "100%",
          maxWidth: "1200px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <CardHeader
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", margin: "10px 0" }}>Subscriptions</h1>
          <Button
            color="primary"
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              borderRadius: "5px",
            }}
            onClick={() => alert("Redirecting to Buy Page...")}
          >
            Buy
          </Button>
        </CardHeader>

        <CardBody>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
              <Spinner color="primary" />
            </div>
          ) : (
            licenses.map((license, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  border: "1px solid #e9ecef",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {/* Accordion Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 15px",
                    cursor: "pointer",
                    backgroundColor: "#f8f9fa",
                  }}
                  onClick={() => toggleAccordion(index)}
                >
                  <span style={{ fontWeight: "bold", color: "#007bff", fontSize: "1.1rem" }}>
                    {license.product}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {/* Status Badge */}
                    <span
                      style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                      className={`badge ${
                        license.status === "Trial"
                          ? "text-danger"
                          : "text-success"
                      }`}
                    >
                      {license.status}
                    </span>
                    <span
                      style={{
                        transform: activeAccordion === index ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    >
                      ▼
                    </span>
                  </span>
                </div>

                {/* Accordion Details */}
                <Collapse isOpen={activeAccordion === index}>
                  <div style={{ padding: "15px", backgroundColor: "#ffffff" }}>
                    <p>
                      <strong>Subscription Key:</strong> {license.subscriptionKey}
                    </p>
                    <p>
                      <strong>Edition:</strong> {license.edition}{" "}
                      <span
                        className="badge bg-secondary"
                        style={{
                          padding: "5px 10px",
                          borderRadius: "5px",
                          fontSize: "0.85rem",
                        }}
                      >
                        {license.additionalInfo}
                      </span>
                    </p>
                    <p>
                      <strong>Issue Date:</strong> {license.issueDate}
                    </p>
                    <p>
                      <strong>AMC Valid Till:</strong> {license.amcValidTill}
                    </p>
                    <Button
                      color="primary"
                      size="sm"
                      style={{
                        marginTop: "10px",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                      }}
                      onClick={() => handleSubscriptionClick(license.subscriptionKey)}
                    >
                      View Details
                    </Button>
                  </div>
                </Collapse>
              </div>
            ))
          )}
        </CardBody>

        <div
          style={{
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            fontSize: "0.9rem",
            color: "#6c757d",
          }}
        >
          <span>© 2024 - CODEPLAYERS Business System Private Limited</span>
          <div style={{ display: "flex", gap: "15px" }}>
            <a href="#terms" style={{ color: "#007bff", textDecoration: "none" }}>
              Terms of Use
            </a>
            <a href="#privacy" style={{ color: "#007bff", textDecoration: "none" }}>
              Privacy Policy
            </a>
            <a href="#contact" style={{ color: "#007bff", textDecoration: "none" }}>
              Contact Us
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LicenseHistory;
