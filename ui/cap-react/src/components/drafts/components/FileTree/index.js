import React from "react";
import PropTypes from "prop-types";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";

import AddIcon from "grommet/components/icons/base/Add";

import { Route } from "react-router-dom";

import TreeNode from "./TreeNode";

import { arrangeIntoTree } from "./utils";
import HorizontalWithText from "../../../partials/HorizontalWithText";

import { filter } from "lodash";
import RepoTree from "./RepoTree";
import { AiOutlineInbox } from "react-icons/ai";
import { DRAFT_ITEM_EDIT } from "../../../routes";

class FileTree extends React.Component {
  constructor(props) {
    super(props);
    let data = this.constructTree(props.files);
    this.state = {
      renderList: this.props.renderList || ["files", "repositories", "title"],
      data
    };
  }

  componentWillReceiveProps(nextProps) {
    let data = this.constructTree(nextProps.files);
    this.setState({ data });
  }

  _renderAddFileIcon() {
    return (
      <Route
        path={DRAFT_ITEM_EDIT}
        render={() => (
          <Anchor
            onClick={this.props.toggleFilemanagerLayer}
            size="xsmall"
            icon={<AddIcon />}
          />
        )}
      />
    );
  }

  onToggle = (node, toggled) => {
    const { cursor, data } = this.state;
    if (cursor) {
      this.setState(() => ({ cursor, active: false }));
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    this.setState(() => ({ cursor: node, data: Object.assign({}, data) }));
  };

  constructTree = data => {
    let paths = [];

    data.mapEntries(item => {
      paths.push([item[0].split("/"), item[1]]);
    });

    let children = arrangeIntoTree(paths);

    return { children };
  };

  getContentFromProps = (value, displayTitle, repos, files) => {
    const choices = {
      repositories: (
        <React.Fragment>
          {displayTitle && (
            <HorizontalWithText
              text="All Repositories"
              background={this.props.background || "#f5f5f5"}
              color={this.props.color || "#000"}
            />
          )}
          <RepoTree
            repos={repos}
            onDirectoryClick={this.props.onDirectoryClick}
            onFileClick={this.props.onFileClick}
          />
        </React.Fragment>
      ),
      files: (
        <React.Fragment>
          {displayTitle && (
            <HorizontalWithText
              text="All Files"
              background={this.props.background || "#f5f5f5"}
              color={this.props.color || "#000"}
            />
          )}
          {files.children && files.children.length > 0 ? (
            <TreeNode
              data={files}
              onDirectoryClick={this.props.onDirectoryClick}
              onFileClick={this.props.onFileClick}
              root
            />
          ) : (
            <Box flex={true} pad="small" justify="center" align="center">
              <Box
                colorIndex="light-2"
                style={{ borderRadius: "50%", padding: "5px" }}
              >
                <AiOutlineInbox size={18} />
              </Box>
              No uploaded files yet
            </Box>
          )}
        </React.Fragment>
      )
    };

    return choices[value];
  };

  render() {
    let repos = filter(this.state.data.children, { name: "repositories" });
    let allFiles = {
      children: filter(
        this.state.data.children,
        item => item.name != "repositories"
      )
    };
    let displayTitle = this.state.renderList.includes("title");

    return (
      <Box style={{ marginLeft: "5px" }}>
        {this.state.renderList.map(item =>
          this.getContentFromProps(item, displayTitle, repos, allFiles)
        )}
      </Box>
    );
  }
}

FileTree.propTypes = {
  showSidebar: PropTypes.bool,
  toggleFilemanagerLayer: PropTypes.func,
  id: PropTypes.string,
  match: PropTypes.object,
  files: PropTypes.object,
  background: PropTypes.string,
  color: PropTypes.string,
  onFileClick: PropTypes.func,
  onDirectoryClick: PropTypes.func,
  hideFiles: PropTypes.bool,
  hideRepos: PropTypes.bool,
  hideTitle: PropTypes.bool,
  renderList: PropTypes.array
};

export default FileTree;
