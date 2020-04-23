import React from "react";
import PropTypes from "prop-types";
import NoteIcon from "grommet/components/icons/base/Note";
import ServerIcon from "grommet/components/icons/base/Servers";
import ZipIcon from "grommet/components/icons/base/DocumentZip";
import LockIcon from "grommet/components/icons/base/FormLock";
import MusicIcon from "grommet/components/icons/base/Music";
import BookIcon from "grommet/components/icons/base/Bookmark";
import D3Icon from "grommet/components/icons/base/3d";
import VideoIcon from "grommet/components/icons/base/Video";

import mime from "mime-types";
import { Image, Box } from "grommet";
import PDFViewer from "./PDFViewer";
import TextEditor from "./TextEditor";

const GetIcon = ({ key, mimetype }, url) => {
  if (!mimetype) {
    return <NoteIcon type="status" size="xlarge" />;
  }

  let type, subtype;
  type = mimetype.split("/")[0];
  subtype = mimetype.split("/")[1];

  if (subtype == "octet-stream") {
    let lookup_mimetype = mime.lookup(key);
    if (lookup_mimetype) {
      type = lookup_mimetype.split("/")[0];
      subtype = lookup_mimetype.split("/")[1];
    }
  }
  const typeToIcon = {
    application: {
      "octet-stream": <ServerIcon type="status" size="xlarge" />,
      pdf: <PDFViewer url={url} />,
      pkcs8: <LockIcon type="status" size="xlarge" />,
      zip: <ZipIcon type="status" size="xlarge" />,
      json: <TextEditor url={url} type="json" />,
      javascript: <TextEditor url={url} type="javascript" />
    },
    audio: {
      default: <MusicIcon type="small" size="xlarge" />
    },
    font: {
      default: <BookIcon type="status" size="xlarge" />
    },
    image: {
      // default: <Image src={url}   />,
      default: <Image src={url} />
      // default: <ImageIcon type="status" size="xlarge" />,
    },
    model: {
      default: <D3Icon type="status" size="xlarge" />
    },
    text: {
      default: (
        <TextEditor
          url={url}
          type={
            ["html", "x-scss", "css", "csv", "python"].indexOf(subtype) > -1
              ? subtype
              : null
          }
        />
      )
      // plain: <TextIcon type="status" size="xlarge" />,
      // csv: <CsvIcon type="status" size="xlarge" />,
      // html: <HtmlIcon type="status" size="xlarge" />
    },
    video: {
      default: <VideoIcon type="status" size="xlarge" />
    }
  };

  let toRender;
  if (typeToIcon[type][subtype]) {
    toRender = typeToIcon[type][subtype];
  } else if (typeToIcon[type]["default"]) {
    toRender = typeToIcon[type]["default"];
  } else {
    toRender = <NoteIcon type="status" size="xlarge" />;
  }

  return (
    <Box flex={true}>
      <Box flex={false} full>
        {toRender}
      </Box>
    </Box>
  );
};

GetIcon.propTypes = {
  mimetype: PropTypes.string
};

export default GetIcon;
