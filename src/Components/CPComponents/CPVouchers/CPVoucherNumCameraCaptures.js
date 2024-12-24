import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, Spinner } from "reactstrap";
import { GET_UploadMedia } from "../../../slices/thunks";
import { useSelector, useDispatch } from "react-redux";
import { resetState } from "../../../slices/Dashboards/SupportDashboard/TicketDetails/GetMedia/reducer"; // import resetState

const CPVoucherNumCameraCaptures = ({ voucherdata, labelTitle }) => {
  const dispatch = useDispatch(); // Used for API connection
  const data = useSelector((state) => state.UploadMedia.data);
  const loading = useSelector((state) => state.UploadMedia.loading);
  const error = useSelector((state) => state.UploadMedia.error);
  const success = useSelector((state) => state.UploadMedia.success);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleDownload = async () => {
    if (!loading) {
      dispatch(GET_UploadMedia(voucherdata));
    }
  };

  // Clear the data when the component is unmounted
  useEffect(() => {
    return () => {
      dispatch(resetState()); // Reset the state when the component unmounts
    };
  }, [dispatch]);

  return (
    <Card>
      <CardHeader className="align-items-center d-flex border-bottom-dashed">
        <h4 className="card-title mb-0 flex-grow-1">Attachments</h4>
        <div className="flex-shrink-0">
          <button className="btn btn-success btn-sm me-2" onClick={handleDownload}>
            {loading ? (
              <Spinner size="sm" />
            ) : (
              <i className="ri-download-2-fill align-middle me-0 fs-6"></i>
            )}
          </button>
        </div>
      </CardHeader>

      <CardBody>
        {data === null ? (
          !success ? ("No Images Available"): ("Please Download Images")
        ) : (
          <img
            src={`data:image/png;base64,${data}`}
            alt="Image"
            className="img-fluid"
          />
        )}
      </CardBody>
    </Card>
  );
};

export default CPVoucherNumCameraCaptures;
