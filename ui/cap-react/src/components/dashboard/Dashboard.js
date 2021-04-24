import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Box from "grommet/components/Box";

import { withRouter } from "react-router-dom";
import { fetchDashboard } from "../../actions/dashboard";

import DashboardList from "./DashboardList";
import DashboardListItem from "./DashboardListItem";
import DashboardWorkflowListItem from "./DashboardWorkflowListItem";
import DashboardMeter from "./components/DashboardMeter";
import DashboardQuickSearch from "./DashboardQuickSearch";

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.fetchDashboard();
  }

  _getList = () => {
    return {
      drafts: {
        all: {
          list: this.props.results.drafts.data,
          more: this.props.results.drafts.more
        },
        yours: {
          list: this.props.results.user_drafts.data,
          more: this.props.results.user_drafts.more
        }
      },
      published: {
        all: {
          list: this.props.results.published.data,
          more: this.props.results.published.more
        },
        yours: {
          list: this.props.results.user_published.data,
          more: this.props.results.user_published.more
        }
      },
      workflows: {
        yours: {
          list: this.props.results.user_workflows.data,
          more: this.props.results.user_workflows.more
        }
      }
    };
  };

  render() {
    let lists = this._getList();

    return (
      <Box colorIndex="light-2" flex full pad={{ vertical: "small" }}>
        <Box flex direction="row" wrap pad={{ horizontal: "small" }}>
          <Box
            className="sm-order-1"
            basis="1/2"
            flex="grow"
            pad={{ horizontal: "medium" }}
            align="center"
            justify="center"
          >
            <DashboardList
              loading={this.props.loading}
              listType="draft"
              list={lists["drafts"]}
              header="drafts"
              ListItem={DashboardListItem}
              emptyMessage="Draft analyses that your collaborators have given you read/write access to."
            />
          </Box>
          <Box
            flex
            basis="1/2"
            pad={{ horizontal: "medium" }}
            align="center"
            justify="center"
            className="sm-order-2"
          >
            <DashboardMeter
              total={this.props.results.user_count}
              drafts={this.props.results.user_drafts_count}
              published={this.props.results.user_published_count}
            />
            <DashboardQuickSearch />
          </Box>
          <Box
            flex="grow"
            basis="1/2"
            pad={{ horizontal: "medium" }}
            align="center"
            justify="center"
            className="sm-order-3"
          >
            <DashboardList
              loading={this.props.loading}
              listType="published"
              list={lists["published"]}
              header="published in collaboration"
              ListItem={DashboardListItem}
              emptyMessage="All analyses published on CAP by members of your collaboration."
            />
          </Box>
          <Box
            flex="grow"
            basis="1/2"
            pad={{ horizontal: "medium" }}
            align="center"
            justify="center"
            className="sm-order-4"
          >
            <DashboardList
              loading={this.props.loading}
              listType="workflows"
              list={lists["workflows"]}
              header="workflows"
              ListItem={DashboardWorkflowListItem}
              emptyMessage="Recent workflows attached to your content"
            />
          </Box>
        </Box>
      </Box>
    );
  }
}

Dashboard.propTypes = {
  fetchDashboard: PropTypes.func,
  currentUser: PropTypes.object,
  results: PropTypes.object,
  history: PropTypes.object,
  loading: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    loading: state.dashboard.get("loading"),
    results: state.dashboard.getIn(["results"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchDashboard: () => dispatch(fetchDashboard())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Dashboard));
