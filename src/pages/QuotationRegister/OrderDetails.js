import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TermsAndConditions from "./TermsAndConditions";


import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Label,
  Input,
} from "reactstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const OrderDetails = () => {
  const { state } = useLocation();
  const { order: initialOrder } = state || {};
  const [order, setOrder] = useState(initialOrder);
  const [modal, setModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [availability, setAvailability] = useState("available");
  const [freight, setFreight] = useState("");
  const [gst, setGst] = useState("");
  const [discount, setDiscount] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [vendorNo, setVendorNo] = useState("");
  const [vendorDate, setVendorDate] = useState(today);
  
  const validationSchemaIfPending = (availability==="available")?(Yup.object({
    quantity: Yup.number()
      .min(0, "Quantity must be 0 or greater")
      .required("Quantity is required")
      .max(((selectedItem)?(selectedItem.RequiredQuantity):(0)),"Quantity must be less than or equal to required quantity"),
    rate: Yup.number()
      .min(0, "Rate must be 0 or greater")
      .required("Rate is required"),
    discount: Yup.number().min(0, "Discount cannot be negative"),
    hsn: Yup.number()
      .integer("HSN must be a whole number")
      .required("HSN is required"),
    unit: Yup.string()
      .oneOf(["MTS", "KG"], "Unit is required") // Validate that the unit is either MTS or KG
      .required("Unit is required"), // Ensure unit is selected
  })) : (Yup.object({
    quantity: 0,
    rate: 0,
    discount: 0,
    hsn: 0,
    unit: 0
  }));
  const validationSchemaIfNotPending = (availability === "available") ? (Yup.object({
    quantity: Yup.number()
      .min(0, "Quantity must be 0 or greater"),
      
    rate: Yup.number()
      .min(0, "Rate must be 0 or greater"),
      
    discount: Yup.number().min(0, "Discount cannot be negative"),
    hsn: Yup.number()
      .integer("HSN must be a whole number"),
      
    unit: Yup.string()
      .oneOf(["MTS", "KG"], "Unit is required"), // Validate that the unit is either MTS or KG
       // Ensure unit is selected
  })) : (Yup.object({
    quantity: 0,
    rate: 0,
    discount: 0,
    hsn: 0,
    unit: 0
  }));
  const calculateAmount = (quantity, rate, discount, tax) => {
    const totalAmount = quantity * rate;
    const discountAmount = (totalAmount * discount) / 100;
    const discountedAmount = totalAmount - discountAmount;
    const taxAmount = (discountedAmount * tax) / 100;
    const finalAmount = Math.max(discountedAmount + taxAmount, 0);

    return parseFloat(finalAmount.toFixed(2));
  };

  const calculateGSTTotal = () => {
    let subtotal = parseFloat(order.items.reduce((total, item) => total + (item.amount || 0), 0)).toFixed(2);
    const freightValue = parseFloat(freight) || 0;
    const discountValue = parseFloat(discount) || 0;
    const gstValue = parseFloat(gst) || 0;

    const discountAmount = (subtotal * discountValue) / 100;
    subtotal -= discountAmount;
    const gstAmount = (subtotal * gstValue) / 100;
    subtotal += gstAmount;
    subtotal += freightValue;

    return parseFloat(subtotal.toFixed(2));
  };

  const calculateSubTotal = () => {
    let subtotal = parseFloat(order.items.reduce((total, item) => total + (item.amount || 0), 0)).toFixed(2);
    return parseFloat(subtotal);
  };

  const calculateTotal = () => {
    let subtotal = parseFloat(order.items.reduce((total, item) => total + (item.amount || 0), 0)).toFixed(2);
    const freightValue = parseFloat(freight) || 0;
    const discountValue = parseFloat(discount) || 0;
    const gstValue = parseFloat(gst) || 0;

    const discountAmount = (subtotal * discountValue) / 100;
    subtotal -= discountAmount;
    const gstAmount = (subtotal * gstValue) / 100;
    subtotal += gstAmount;
    subtotal += freightValue;

    return parseFloat(subtotal.toFixed(2));
  };

  const handleSave = (values) => {
    const updatedItems = [...order.items];
    const newAmount =
      availability === "regret"
        ? 0
        : calculateAmount(
            values.quantity,
            values.rate,
            values.discount,
            values.tax
          );

    updatedItems[selectedIndex] = {
      ...selectedItem,
      VendorStatus:availability,
      VendorQuantity: availability === "regret" ? 0 : values.quantity,
      VendorRate: availability === "regret" ? 0 : values.rate,
      amount: newAmount,
      description: values.description,
      tax: values.tax,
      hsn: availability === "regret" ? 0 : values.hsn, // Setting HSN to 0 on regret
      discount: availability === "regret" ? 0 : values.discount,
      unit: availability === "regret" ? "" : values.unit,
      
    };
    setOrder({ ...order, items: updatedItems });
    toggleModal();
    // console.log("order in save "+JSON.stringify(order));
  };
 

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "won":
        return "badge bg-success-subtle text-success";
      case "expired":
        return "badge bg-danger-subtle text-danger";
      case "lost":
        return "badge bg-light-subtle text-muted";
      default:
        return "badge bg-warning-subtle text-warning";
    }
  };
  const toggleModal = () => setModal(!modal);
  //data for terms and conditions
  const [termsData, setTermsData] = useState({ vendorInputs: {}, checkboxes: {} });

  const handleDataChange = (data) => {
    setTermsData(data);
    // console.log("Updated Terms Data:", data);
  };
  const handleSaveButton=()=>{
    const OrderAndTerms={
      order:order,
      terms:termsData,
    };
    console.log(OrderAndTerms);
  }
  return (
    <div className="page-content">
      <Container fluid>
        <Col>
          <Card>
            <CardHeader>
              <Row>
                <Col>
                  <div className="d-flex align-items-center">
                    <h5
                      onClick={() => setModal(true)}
                      className="flex-grow-1 cursor-pointer"
                    >
                      {order.vendor}
                    </h5>
                  </div>
                </Col>
                <Col>
                  <p className="text-muted text-end">
                    Order Status:{" "}
                    <span className={getStatusClass(order.status)}>
                      {order.status}
                    </span>
                  </p>
                </Col>
              </Row>
              <Row>
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <div className="d-flex align-items-center">
                    <i className="ri-map-pin-2-line text-primary me-1"></i>
                    <span>Vendor: {order.vendor}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="ri-time-line text-primary me-1"></i>
                    <span>Order: {order.rfqNo}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="ri-time-line text-primary me-1"></i>
                    <span>Vendor Quotation No:</span>
                    <input
                      type="text"
                      value={vendorNo}
                      onChange={(e) => setVendorNo(e.target.value)}
                      className="form-control ms-2 w-auto"
                      style={{ maxWidth: "150px" }}
                    />
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="ri-time-line text-primary me-1"></i>
                    <span>Vendor Quotation Date:</span>
                    <input
                      type="date"
                      value={vendorDate}
                      onChange={(e) => setVendorDate(e.target.value)}
                      className="form-control ms-2 w-auto"
                      style={{ maxWidth: "150px" }}
                    />
                  </div>
                </div>
              </Row>
            </CardHeader>
            <CardBody>
              <div className="table-responsive table-card">
                <table className="table table-borderless align-middle mb-0 table-sm">
                  <thead className="table-light text-muted">
                    <tr>
                      <th colSpan="2" scope="col">
                        Particulars
                      </th>
                      <th scope="col" className="text-end">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td
                          colSpan="2"
                          onClick={() => {
                            setSelectedItem(item);
                            setSelectedIndex(index);
                            toggleModal();
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <h5 className="fs-14">
                            {`${item.RequiredQuantity} ${item.name}`}{" "}
                          </h5>

                          {item.amount ? (
                            <p className="text-muted mb-0">
                              &#8377; {item.VendorRate} x {item.RequiredQuantity} {item.unit}{" "}
                              | Discount: {item.discount}%
                            </p>
                          ) : item.VendorStatus === "regret" ? (
                            <p className="text-danger mb-0">Regret</p>
                          ) : (
                            <p className="text-warning mb-0">Not filled yet</p>
                          )}
                        </td>
                        <td className="text-end">₹{item.amount || "0"}</td>
                      </tr>
                    ))}
                    <tr className="table-active">
                      <th colSpan="2">Sub Total:</th>
                      <td className="text-end">
                        <span className="fw-semibold">
                          ₹{calculateSubTotal()}
                        </span>
                      </td>
                    </tr>
                    <tr className="table-active">
                      <th colSpan="2">Discount (%)</th>
                      <td className="text-end">
                        <Input
                          type="number"
                          min="0"
                          value={discount}
                          onChange={(e) =>
                            setDiscount(parseFloat(e.target.value) || 0)
                          }
                          className="form-control-sm text-end"
                          style={{ width: "80px", display: "inline-block" }}
                        />
                      </td>
                    </tr>
                    <tr className="table-active">
                      <th colSpan="2">Freight</th>
                      <td className="text-end">
                        <Input
                          type="number"
                          min="0"
                          value={freight}
                          onChange={(e) =>
                            setFreight(parseFloat(e.target.value) || 0)
                          }
                          className="form-control-sm text-end"
                          style={{ width: "80px", display: "inline-block" }}
                        />
                      </td>
                    </tr>
                    <tr className="table-active">
                      <th colSpan="2">GST</th>
                      <td className="text-end">
                        <span className="fw-semibold">₹{calculateTotal()}</span>
                      </td>
                    </tr>
                    <tr className="table-active">
                      <th colSpan="2">Total</th>
                      <td className="text-end">
                        <span className="fw-semibold">₹{calculateTotal()}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col>
          <TermsAndConditions onDataChange={handleDataChange} />
        </Col>
        <Col>
          <div style={{ display: 'flex', justifyContent: 'center' ,paddingTop:'10px'}}>
            <Button color="primary" onClick={handleSaveButton} className="mt-6">
              Save
            </Button>
          </div>
        </Col>
        

      </Container>

      {selectedItem && (
        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>
            <div className="w-100 ">
              <div className="d-flex flex-column align-items-start mb-2">
                <span className="flex-grow-1">
                  {`${selectedItem.name} (${selectedItem.RequiredMake}) - ${selectedItem.RequiredQuantity}`}
                </span>
                <small className="text-muted">{selectedItem.RequiredDescription}</small>
              </div>


              <Row className="align-items-center mb-3">
                <Col xs="auto">
                  <span className="text-success fw-bold">Status:</span>
                </Col>
                <Col xs="auto">
                  <div className="d-flex">
                    <div className="form-check me-3">
                      <Input
                        type="radio"
                        name="availability"
                        value="available"
                        id="available"
                        checked={availability === "available"}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="form-check-input"
                      />
                      <label className="form-check-label" htmlFor="available">
                        Available
                      </label>
                    </div>
                    <div className="form-check">
                      <Input
                        type="radio"
                        name="availability"
                        value="regret"
                        id="regret"
                        checked={availability === "regret"}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="form-check-input"
                      />
                      <label className="form-check-label" htmlFor="regret">
                        Regret
                      </label>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </ModalHeader>

          <ModalBody>
            
            <Formik
              initialValues={{
                quantity: selectedItem.VendorQuantity||"",
                rate: selectedItem.VendorRate || "",
                discount: selectedItem.discount || "",
                description: selectedItem.description || "",
                tax: selectedItem.tax || "0",
                hsn: selectedItem.hsn || "",
                unit: selectedItem.unit || "MTS", // Initialize unit with default value
                amount: calculateAmount(
                  selectedItem.quantity || 0,
                  selectedItem.rate || 0,
                  selectedItem.discount || 0
                ),
              }}
              validationSchema={(order.status!="Pending")?(validationSchemaIfNotPending):(validationSchemaIfPending)}
              onSubmit={handleSave}
            >
              {({ values, errors, touched, handleChange, setFieldValue }) => (
                <Form>
                  
                  <Row>
                    <Col>
                      <Label for="quantity">Quantity</Label>
                      <Input
                        type="number"
                        name="quantity"
                        id="quantity"
                        value={values.quantity}
                        min="0"
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue(
                            "amount",
                            calculateAmount(
                              e.target.value,
                              values.rate,
                              values.discount
                            )
                          );
                        }}
                        disabled={availability==="regret"||order.status!="Pending"}
                      />
                      <div className="text-danger">
                        {touched.quantity && errors.quantity}
                      </div>
                    </Col>
                    <Col>
                      <Label for="rate">Rate</Label>
                      <Input
                        type="number"
                        name="rate"
                        id="rate"
                        value={values.rate}
                        min="0"
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue(
                            "amount",
                            calculateAmount(
                              values.quantity,
                              e.target.value,
                              values.discount
                            )
                          );
                        }}
                        disabled={availability === "regret" || order.status != "Pending"}
                      />
                      <div className="text-danger">
                        {touched.rate && errors.rate}
                      </div>
                    </Col>

                    <Col>
                      <Label for="unit">Unit</Label>
                      <Input
                        type="select"
                        name="unit"
                        id="unit"
                        value={values.unit}
                        onChange={(e) => handleChange(e)}
                        disabled={availability === "regret" || order.status != "Pending"}
                      >
                        <option value="MTS">MTS</option>
                        <option value="KG">KG</option>
                      </Input>
                    </Col>

                    <Col>
                      <Label for="discount">Discount (%)</Label>
                      <Input
                        type="number"
                        name="discount"
                        id="discount"
                        value={values.discount}
                        min="0"
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue(
                            "amount",
                            calculateAmount(
                              values.quantity,
                              values.rate,
                              e.target.value
                            )
                          );
                        }}
                        disabled={availability === "regret" || order.status != "Pending"}
                      />
                      <div className="text-danger">
                        {touched.discount && errors.discount}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Label for="description">Description</Label>
                      <Input
                        type="text"
                        name="description"
                        id="description"
                        value={values.description}
                        onChange={handleChange}
                        disabled={availability === "regret" || order.status != "Pending"}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Label for="hsn">HSN Code</Label>
                      <Input
                        type="number"
                        name="hsn"
                        id="hsn"
                        value={values.hsn}
                        min="0"
                        onChange={handleChange}
                        disabled={availability === "regret" || order.status != "Pending"}
                      />
                      <div className="text-danger">
                        {touched.hsn && errors.hsn}
                      </div>
                    </Col>
                    <Col>
                      <Label for="tax">Tax (%)</Label>
                      <Input
                        type="select"
                        name="tax"
                        id="tax"
                        value={values.tax}
                        min="0"
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue(
                            "amount",
                            calculateAmount(
                              values.quantity,
                              values.rate,
                              values.discount,
                              e.target.value
                            )
                          );
                        }}
                        disabled={availability === "regret" || order.status != "Pending"}
                      >
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                      </Input>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Label for="amount">Amount</Label>
                      <Input
                        type="number"
                        name="amount"
                        id="amount"
                        value={values.amount}
                        disabled
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="text-end">
                      <Button type="submit" color="primary">
                        Save
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
};

export default OrderDetails;