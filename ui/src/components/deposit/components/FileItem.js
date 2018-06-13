import React from 'react';

import {
  Box,
  Label,
  Menu,
  Anchor,
  ListItem
} from 'grommet';

import Status from 'grommet/components/icons/Status';

import ArchiveIcon from 'grommet/components/icons/base/Archive';
import DocumentConfigIcon from 'grommet/components/icons/base/DocumentConfig';
import PieChartIcon from 'grommet/components/icons/base/PieChart';
import BookIcon from 'grommet/components/icons/base/Book';
import NoteIcon from 'grommet/components/icons/base/Note';
import MoreIcon from 'grommet/components/icons/base/More';

import prettyBytes from 'pretty-bytes';

const uploadStatusMap = {
  "uploading": "disabled",
  "error": "critical",
  "done": "ok"
};

class FileItem extends React.Component {
  constructor(props) {
    super(props);
  }

  _getIcon(type) {
    const catToIcon = {
      default: <ArchiveIcon type="status" size="xsmall"/>,
      archive: <ArchiveIcon type="status" size="xsmall"/>,
      configuration: <DocumentConfigIcon type="status" size="xsmall"/>,
      dataset: <PieChartIcon type="status" size="xsmall"/>,
      publication: <BookIcon type="status" size="xsmall"/>,
      plot: <PieChartIcon type="status" size="xsmall"/>,
    };

    return catToIcon[type] ? catToIcon[type] : <NoteIcon type="status" size="xsmall" />;
  }

  render() {
    let {file} = this.props;
    return (
      <ListItem
        key={file.key}
        onClick={this.props.action ? this.props.action(file.key) : null}
        justify="between"
        pad="none"
        flex={true}>
        <Box direction="row" flex={true} justify="between" wrap={false}>
          <Box  direction="row" flex={true}>
            <Box justify="center" margin={{horizontal: "small"}}>
              {this._getIcon(file.type)}
            </Box>
            <Box justify="center" flex={true} width="100" size="small" margin={{right: "small"}}>
              <Label justify="center" margin="none" size="small" truncate={true}>{file.key}</Label>
            </Box>
            {
              file.status ?
              <Box justify="center" margin={{right: "small"}}>
                <Status size="small" value={uploadStatusMap[file.status]} />
              </Box> : null
            }
          </Box>

          <Menu
            responsive={true}
            size="small"
            dropAlign={{right: "right", top: "bottom"}}
            icon={<MoreIcon size="xsmall" />}>
              <Box  justify="center" margin={{right: "small"}}>
                {file.size ? prettyBytes(parseInt(file.size)) : "No size"}
              </Box>
              <Anchor href="#" className="active">
                Download
              </Anchor>
              <Anchor href="#">
                More Info
              </Anchor>
          </Menu>
        </Box>
      </ListItem>
    );
  }
}

export default FileItem;

