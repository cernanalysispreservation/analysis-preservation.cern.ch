import React from "react";
import PropTypes from "prop-types";
import pdfjs from "pdfjs-dist";

import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import Viewer, { Worker } from "@phuocng/react-pdf-viewer";
import "@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

class PdfComponent extends React.Component {
  render() {
    return (
      <Worker workerUrl={pdfjsWorker}>
        <div style={{ height: "100%" }}>
          <Viewer fileUrl={this.props.url || ""} defaultScale={1} />
        </div>
      </Worker>
    );
  }
}

PdfComponent.propTypes = {
  url: PropTypes.string
};

export default PdfComponent;
