import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { matchPath } from "react-router";
import { withRouter } from "react-router-dom";
import DocumentIcon from "grommet/components/icons/base/Document";
import PlayIcon from "grommet/components/icons/base/Play";

import ConnectIcon from "grommet/components/icons/base/Connect";
import { Anchor, Box } from "grommet";
import ReactTooltip from "react-tooltip";

import TrashIcon from "grommet/components/icons/base/Trash";

// Actions
import {
  getDraftByIdAndInitForm,
  toggleActionsLayer,
  draftItemTabsChange
} from "../../actions/draftItem";

import ShareIcon from "grommet/components/icons/base/Share";

class DraftsItemIndex extends React.Component {
  componentDidMount() {
    let { draft_id } = this.props.match.params;

    if (draft_id == this.props.id) return;
    if (draft_id) {
      this.props.getDraftById(draft_id);
    }
  }

  _actionHandler = type => () => {
    this.props.toggleActionsLayer(type);
  };

  render() {
    let { draft_id } = this.props.match.params;
    let isDraft = this.props.status == "draft" ? true : false;
    let isPublishedOnce = this.props.recid ? true : false;

    return (
      <Box
        flex={false}
        colorIndex="light-2"
        justify="between"
        className="md-row"
      >
        <Box className="md-row" flex>
          <ReactTooltip />
          <Anchor
            onClick={() =>
              this.props.draftItemTabsChange(`/drafts/${draft_id}/edit`)
            }
          >
            <Box
              justify="center"
              align="center"
              pad="small"
              colorIndex={
                matchPath(this.props.location.pathname, {
                  path: "/drafts/:draft_id/edit",
                  exact: true
                })
                  ? "light-1"
                  : null
              }
            >
              <DocumentIcon />
            </Box>
          </Anchor>
          <Anchor
            onClick={() =>
              this.props.draftItemTabsChange(`/drafts/${draft_id}/integrations`)
            }
            data-tip="Connect your repositories"
          >
            <Box
              justify="center"
              align="center"
              pad="small"
              colorIndex={
                matchPath(this.props.location.pathname, {
                  path: "/drafts/:draft_id/integrations",
                  exact: true
                })
                  ? "light-1"
                  : null
              }
            >
              <ConnectIcon />
            </Box>
          </Anchor>
          <Anchor
            onClick={() =>
              this.props.draftItemTabsChange(`/drafts/${draft_id}/workflows`)
            }
            data-tip="Run workflows - in BETA soon"
            disabled
          >
            <Box
              justify="center"
              align="center"
              pad="small"
              colorIndex={
                matchPath(this.props.location.pathname, {
                  path: "/drafts/:draft_id/workflows",
                  exact: true
                })
                  ? "light-1"
                  : null
              }
            >
              <PlayIcon />
            </Box>
          </Anchor>
          <Anchor
            onClick={() =>
              this.props.draftItemTabsChange(`/drafts/${draft_id}/settings`)
            }
            data-tip="Share with others"
          >
            <Box
              justify="center"
              align="center"
              pad="small"
              colorIndex={
                matchPath(this.props.location.pathname, {
                  path: "/drafts/:draft_id/settings",
                  exact: true
                })
                  ? "light-1"
                  : null
              }
            >
              <ShareIcon />
            </Box>
          </Anchor>
        </Box>

        {isDraft && !isPublishedOnce ? (
          <Anchor
            icon={<TrashIcon />}
            onClick={this._actionHandler("delete")}
            data-tip="Delete your analysis"
          />
        ) : null}
      </Box>
    );
  }
}

DraftsItemIndex.propTypes = {
  getDraftById: PropTypes.func,
  match: PropTypes.object.isRequired,
  status: PropTypes.string,
  errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  message: PropTypes.string,
  draft_id: PropTypes.string,
  id: PropTypes.string,
  toggleActionsLayer: PropTypes.func,
  recid: PropTypes.string,
  location: PropTypes.object
};

function mapStateToProps(state) {
  return {
    id: state.draftItem.get("id"),
    status: state.draftItem.get("status"),
    errors: state.draftItem.get("errors"),
    recid: state.draftItem.get("recid")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDraftById: id => dispatch(getDraftByIdAndInitForm(id)),
    toggleActionsLayer: type => dispatch(toggleActionsLayer(type)),
    draftItemTabsChange: tab => dispatch(draftItemTabsChange(tab))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DraftsItemIndex)
);
