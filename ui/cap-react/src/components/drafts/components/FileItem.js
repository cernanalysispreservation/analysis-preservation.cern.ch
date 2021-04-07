import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Route } from "react-router-dom";

import Anchor from "../../partials/Anchor";
import Label from "grommet/components/Label";
import Box from "grommet/components/Box";

import Heading from "grommet/components/Heading";

import Modal from "../../partials/Modal";

import NoteIcon from "grommet/components/icons/base/Note";
import CloseIcon from "grommet/components/icons/base/Close";
import DownloadIcon from "grommet/components/icons/base/Download";
import ImageIcon from "grommet/components/icons/base/Image";
import ServerIcon from "grommet/components/icons/base/Servers";
import PdfIcon from "grommet/components/icons/base/DocumentPdf";
import ZipIcon from "grommet/components/icons/base/DocumentZip";
import LockIcon from "grommet/components/icons/base/FormLock";
import MusicIcon from "grommet/components/icons/base/Music";
import BookIcon from "grommet/components/icons/base/Bookmark";
import D3Icon from "grommet/components/icons/base/3d";
import TextIcon from "grommet/components/icons/base/DocumentText";
import CsvIcon from "grommet/components/icons/base/DocumentCsv";
import HtmlIcon from "grommet/components/icons/base/StandardsHtml5";
import VideoIcon from "grommet/components/icons/base/Video";
import Code from "grommet/components/icons/base/Code";
import CSSIcon from "grommet/components/icons/base/StandardsCss3";
import PlatformReactjs from "grommet/components/icons/base/PlatformReactjs";
import Cli from "grommet/components/icons/base/Cli";
import Info from "grommet/components/icons/base/CircleInformation";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import { toggleFilePreviewEdit } from "../../../actions/draftItem";

import prettyBytes from "pretty-bytes";

import { deleteFileByUri, getFileVersions } from "../../../actions/files";
import Spinning from "grommet/components/icons/Spinning";
import Tag from "../../partials/Tag";
import { DRAFT_ITEM } from "../../routes";

const uploadStatusMap = {
  uploading: "disabled",
  error: "critical",
  done: "ok"
};

class FileItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      menu: false,
      fileInfo: false
    };
  }

  _getIcon(mimetype) {
    if (!mimetype) {
      return <NoteIcon type="status" size="xsmall" />;
    }

    let type, subtype;
    type = mimetype.split("/")[0];
    subtype = mimetype.split("/")[1];

    const typeToIcon = {
      application: {
        "octet-stream": <ServerIcon type="status" size="xsmall" />,
        pdf: <PdfIcon type="status" size="xsmall" />,
        pkcs8: <LockIcon type="status" size="xsmall" />,
        zip: <ZipIcon type="status" size="xsmall" />,
        gzip: <ZipIcon type="status" size="xsmall" />,
        "x-sh": <Cli type="status" size="xsmall" />,
        javascript: <PlatformReactjs type="status" size="xsmall" />
      },
      audio: {
        default: <MusicIcon type="small" size="xsmall" />
      },
      font: {
        default: <BookIcon type="status" size="xsmall" />
      },
      image: {
        default: <ImageIcon type="status" size="xsmall" />
      },
      model: {
        default: <D3Icon type="status" size="xsmall" />
      },
      text: {
        plain: <TextIcon type="status" size="xsmall" />,
        csv: <CsvIcon type="status" size="xsmall" />,
        json: <HtmlIcon type="status" size="xsmall" />,
        html: <HtmlIcon type="status" size="xsmall" />,
        css: <CSSIcon type="status" size="xsmall" />,
        "x-python": <Code type="status" size="xsmall" />
      },
      video: {
        default: <VideoIcon type="status" size="xsmall" />
      }
    };

    if (typeToIcon[type][subtype]) {
      return typeToIcon[type][subtype];
    } else if (typeToIcon[type]["default"]) {
      return typeToIcon[type]["default"];
    } else {
      return <NoteIcon type="status" size="xsmall" />;
    }
  }

  _toggleHover = hover => {
    this.setState({ hover });
  };
  _toggleMenu = () => {
    this.setState({ menu: !this.state.menu });
  };
  render() {
    let { file } = this.props;

    let { links: { self: file_link = null } = {}, key: filePath } =
      file.data || file;

    // TO_REMOVE after fixings links from backend
    file_link = file_link
      ? file_link
      : `/api/files/${this.props.file.bucket}/${this.props.file.key}`;

    const timeOptions = {
      day: "numeric",
      month: "long",
      year: "numeric"
    };

    return file ? (
      <Box
        key={file.key}
        colorIndex={this.state.hover ? "light-2" : null}
        pad="none"
        flex={true}
        onMouseOver={() => this._toggleHover(true)}
        onMouseLeave={() => this._toggleHover(false)}
      >
        <Box direction="row" flex={true} wrap={false} responsive={false}>
          <Box
            direction="row"
            flex={true}
            onClick={this.props.action}
            responsive={false}
          >
            <Box justify="center">{this._getIcon(file.mimetype)}</Box>
            <Box
              justify="center"
              flex={true}
              size="small"
              style={{ padding: "0 5px" }}
            >
              <Label
                justify="center"
                margin="none"
                size="small"
                truncate={true}
              >
                {this.props.filename ? this.props.filename : filePath}{" "}
              </Label>
            </Box>
          </Box>

          <Box
            flex={false}
            direction="row"
            justify="end"
            align="center"
            responsive={false}
          >
            <span style={{ color: "#aaa" }}>
              {file.size ? prettyBytes(parseInt(file.size)) : null}
            </span>

            <Box justify="center" style={{ width: "9px", marginLeft: "5px" }}>
              {file.status ? (
                <Box
                  colorIndex={uploadStatusMap[file.status]}
                  style={{ width: "9px", borderRadius: "50%", height: "9px" }}
                />
              ) : null}
            </Box>

            {this.state.hover || this.state.menu ? (
              <Box>
                <Box
                  onClick={this._toggleMenu}
                  justify="center"
                  align="center"
                  style={{ padding: "5px 4px 5px 10px" }}
                >
                  {this.state.menu ? (
                    <FaChevronUp style={{ width: "8px" }} />
                  ) : (
                    <FaChevronDown style={{ width: "8px" }} />
                  )}
                </Box>
              </Box>
            ) : null}
          </Box>
        </Box>
        {this.state.fileInfo && (
          <Modal
            title="File Versions"
            onClose={() => this.setState({ fileInfo: false })}
          >
            <Box pad="large" size={{ width: "xlarge" }} wrap={false} flex>
              <Box direction="row" align="center" margin={{ bottom: "small" }}>
                <Box>
                  <Heading tag="h3">
                    {this.props.filename ? this.props.filename : filePath}
                  </Heading>
                  <Box style={{ color: "rgba(0,0,0,0.4)", marginLeft: "5px" }}>
                    <Heading tag="h5">{file.checksum}</Heading>
                  </Box>
                </Box>
              </Box>
              <Box direction="row" wrap margin={{ bottom: "medium" }}>
                {Object.entries(file.tags).map(item => (
                  <Box key={item.version_id} style={{ margin: "0 5px 5px 0 " }}>
                    <Tag text={`${item[0]}=${item[1]}`} />
                  </Box>
                ))}
              </Box>

              {this.props.versionLoading ? (
                <Box align="center" justify="center">
                  <Spinning />
                </Box>
              ) : (
                this.props.versions
                  .filter(item => item.get("key") === this.props.filename)
                  .map((item, index) => (
                    <Box
                      margin={{ vertical: "small" }}
                      key={index}
                      pad="small"
                      direction="row"
                      responsive={false}
                      align="center"
                      justify="between"
                      flex
                      colorIndex="light-2"
                    >
                      <Box direction="row" responsive={false} align="center">
                        <Box margin={{ right: "small" }}>
                          {this._getIcon(item.get("mimetype"))}
                        </Box>
                        {item.get("checksum")}
                      </Box>
                      <Box style={{ opacity: item.get("is_head") ? 1 : 0 }}>
                        <Tag
                          text="latest"
                          color={{
                            bgcolor: "#f5f5f5",
                            border: "#28a745",
                            color: "#22863a"
                          }}
                        />
                      </Box>
                      <Box>
                        {new Date(item.get("created")).toLocaleString(
                          "en-GB",
                          timeOptions
                        )}
                      </Box>

                      <Box>{prettyBytes(parseInt(file.size))}</Box>
                      <Box
                        onClick={() =>
                          this.downloadVersionFile(
                            item.getIn(["links", "self"])
                          )
                        }
                      />
                      <Box>
                        <Anchor
                          icon={<DownloadIcon size="xsmall" />}
                          href={item.getIn(["links", "self"])}
                          download
                        />
                      </Box>
                    </Box>
                  ))
              )}
            </Box>
          </Modal>
        )}
        {this.state.menu ? (
          <Box colorIndex="light-2" alignSelf="end" pad="small">
            <Route
              path={DRAFT_ITEM}
              render={() => (
                <Anchor
                  size="small"
                  icon={<Info size="xsmall" />}
                  label={<Label size="small">Info</Label>}
                  onClick={() => {
                    this.props.getFileVersions();
                    this.setState({ fileInfo: true });
                  }}
                />
              )}
            />

            <Anchor
              size="small"
              icon={<DownloadIcon size="xsmall" />}
              label={<Label size="small">Download</Label>}
              href={file_link}
              download
            />
            <Route
              path={DRAFT_ITEM}
              render={() =>
                this.props.canUpdate && (
                  <Anchor
                    size="small"
                    icon={<CloseIcon size="xsmall" />}
                    label={<Label size="small">Delete</Label>}
                    disabled={this.props.status === "published"}
                    onClick={() => {
                      this.props.deleteFile(file_link, filePath);
                    }}
                  />
                )
              }
            />
          </Box>
        ) : null}
      </Box>
    ) : null;
  }
}

FileItem.propTypes = {
  file: PropTypes.object,
  action: PropTypes.func,
  deleteFile: PropTypes.func,
  bucket_id: PropTypes.string,
  filePreview: PropTypes.func,
  status: PropTypes.string,
  canUpdate: PropTypes.bool,
  match: PropTypes.object,
  filename: PropTypes.string,
  versions: PropTypes.array,
  versionLoading: PropTypes.bool,
  getFileVersions: PropTypes.func
};

const mapStateToProps = state => {
  return {
    status: state.draftItem.get("status"),
    canUpdate: state.draftItem.get("can_update"),
    versions: state.draftItem.get("fileVersions"),
    versionLoading: state.draftItem.get("versionLoading")
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteFile: (file_uri, filepath) =>
      dispatch(deleteFileByUri(file_uri, filepath)),
    filePreview: file => dispatch(toggleFilePreviewEdit(file.data || file)),
    getFileVersions: () => dispatch(getFileVersions())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FileItem)
);
