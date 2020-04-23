import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Switch, Route, withRouter } from "react-router-dom";

import { Box, Label } from "grommet";

import DraftHeader from "./components/DraftHeader";

import PreviewUpload from "./components/PreviewUpload";

// Draft containers
import DraftIntegrations from "./components/DraftIntegrations";
import DraftWorkflows from "../workflows";
import DraftSettings from "./components/DepositSettings";
import DraftPreview from "./DraftPreview";
import DraftEditor from "./DraftEditor";

import customStyle from "./styles/tabs";
// import * as customStyle from "react-tabtab/src/themes/bulma";
// Actions
import {
  getDraftByIdAndInitForm,
  draftItemTabsChangeActiveIndex,
  draftItemTabsClose
} from "../../actions/draftItem";

import { Tabs, TabList, Tab, PanelList, Panel } from "react-tabtab";

import { matchPath } from "react-router";

class DraftsItemTabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPath: ""
    };
  }

  componentDidMount() {
    let { draft_id } = this.props.match.params;

    if (draft_id == this.props.id) return;
    // if (draft_id) {
    //   this.props.getDraftById(draft_id);
    // }
  }

  getMatchParams(path, pathToMatch, params) {
    let match = matchPath(path, { path: pathToMatch });

    let returnProps = {};
    if (match) {
      params.forEach(param => {
        if (match.params[param[0]])
          returnProps[param[1]] = match.params[param[0]];
      });
    }
    return returnProps;
  }
  _renderPanel = (path, draft_id) => {
    let pathArray = {
      "/drafts/:id": {
        component: DraftPreview
      },
      "/drafts/:id/edit": {
        component: DraftEditor,
        props: {
          formRef: this.props.formRef
        }
      },
      "/drafts/:id/settings": {
        component: DraftSettings
      },
      "/drafts/:id/integrations": {
        component: DraftIntegrations
      },
      "/drafts/:id/workflows": {
        component: DraftWorkflows,
        props: {
          draft_id: draft_id
        }
      },
      "/drafts/:id/files/:file_key": {
        component: PreviewUpload,
        props: this.getMatchParams(path, "/drafts/:id/files/:file_key", [
          ["file_key", "fileKey"]
        ])
      }
    };

    let active = null;

    Object.keys(pathArray).map(key => {
      console.log("PANEEEEL::", matchPath(path, { path: key }));
      if (matchPath(path, { path: key })) active = pathArray[key];
    });

    return (
      <Panel>
        <active.component {...active.props} />
      </Panel>
    );
  };

  _renderTab = path => {
    let pathArray = {
      "/drafts/:id": "Overview",
      "/drafts/:id/edit": "Metadata",
      "/drafts/:id/settings": "Settings",
      "/drafts/:id/integrations": "Integrations",
      "/drafts/:id/workflows": "Workflows",
      "/drafts/:id/files/:file_key": "Files"
    };

    let active = null;

    Object.keys(pathArray).map(key => {
      let _match = matchPath(path, { path: key });

      if (_match) {
        if (_match.params["file_key"]) active = _match.params["file_key"];
        else active = pathArray[key];
      }
    });

    return <Tab closable>{active}</Tab>;
  };

  render() {
    let { draft_id } = this.props.match.params;
    return (
      <Box id="draft-tabs" style={{ padding: "8px" }} flex={true}>
        <Tabs
          activeIndex={this.props.activeTab}
          customStyle={customStyle}
          showModalButton={false}
          showArrowButton={false}
          forceRenderTabPanel={true}
          onTabChange={index => this.props.changeTabsActiveIndex(index)}
          onTabEdit={({ type, index }) =>
            type == "delete" ? this.props.closeTab(index) : null
          }
        >
          <TabList>
            {this.props.tabs && this.props.tabs.size ? (
              this.props.tabs.map(path => this._renderTab(path, draft_id))
            ) : (
              <Tab>Preview</Tab>
            )}
          </TabList>

          <PanelList>
            {this.props.tabs && this.props.tabs.size ? (
              this.props.tabs.map(path => this._renderPanel(path, draft_id))
            ) : (
              <Panel>
                <DraftPreview />
              </Panel>
            )}
          </PanelList>
        </Tabs>
      </Box>
    );
  }
}

// <AsyncPanel loadContent={cb => cb(this.props.tabs.toJS())}
// render={path => this._renderPanel(path, draft_id)}
// renderLoading={() => (<div>Loading...</div>)}
// cache={true}
// />
DraftsItemTabs.propTypes = {
  getDraftById: PropTypes.func,
  match: PropTypes.object.isRequired,
  status: PropTypes.string,
  errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  message: PropTypes.string,
  draft_id: PropTypes.string,
  id: PropTypes.string,
  recid: PropTypes.string
};

function mapStateToProps(state) {
  return {
    id: state.draftItem.get("id"),
    tabs: state.draftItem.get("tabs"),
    activeTab: state.draftItem.get("activeTab"),
    status: state.draftItem.get("status"),
    errors: state.draftItem.get("errors"),
    recid: state.draftItem.get("recid")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDraftById: id => dispatch(getDraftByIdAndInitForm(id)),
    changeTabsActiveIndex: tab => dispatch(draftItemTabsChangeActiveIndex(tab)),
    closeTab: tab => dispatch(draftItemTabsClose(tab))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DraftsItemTabs)
);
