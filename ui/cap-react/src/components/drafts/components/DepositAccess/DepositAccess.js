import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import _sortBy from "lodash/sortBy";

import Box from "grommet/components/Box";

import Heading from "grommet/components/Heading";
import TextInput from "grommet/components/TextInput";

import Button from "../../../partials/Button";

import { handlePermissions } from "../../../../actions/draftItem";

import { AiOutlinePlus } from "react-icons/ai";
import AccessModal from "./DepositAccessModal";

import "./DepositAccess.css";
import DepositAccessPagination from "./DepositAccessPagination";

class DepositAccess extends React.Component {
  constructor() {
    super();
    this.state = {
      inputValue: "",
      showModal: false,
      filterResultsBy: "all",
      limits: { upper: 5, lower: 0 },
      selected: 0
    };
  }

  render() {
    if (!this.props.draft_id) return null;
    let permissions = this.props.permissions || {};

    let access = {};
    Object.keys(permissions).map(action => {
      permissions[action].users.map(user => {
        if (!access[user.email])
          access[user.email] = {
            actions: [],
            type: "user"
          };
        access[user.email].actions.push(action);
      });

      permissions[action].roles.map(role => {
        if (!access[role])
          access[role] = {
            actions: [],
            type: "egroup"
          };
        access[role].actions.push(action);
      });
    });

    // create arrays for all , users and egroups
    let users_roles = _sortBy(Object.keys(access));
    let all_roles_length = users_roles.length;
    let users_only = users_roles.filter(item => access[item].type === "user");
    let egroups_only = users_roles.filter(
      item => access[item].type === "egroup"
    );

    // check if the user has applied any filter and update the results
    if (this.state.filterResultsBy !== "all") {
      users_roles =
        this.state.filterResultsBy === "user" ? users_only : egroups_only;
    }
    // check if the user has provided any search filter
    if (this.state.inputValue) {
      users_roles = users_roles.filter(item =>
        item.includes(this.state.inputValue)
      );
    }
    let ceilMath = Math.ceil(users_roles.length / 5);
    if (this.state.limits.upper / 5 > ceilMath && users_roles.length > 5) {
      this.setState({
        selected: 1,
        limits: {
          upper: 5 * ceilMath,
          lower: 5 * ceilMath - 5
        }
      });
    }

    return (
      <Box className="deposit-access">
        <Box margin={{ bottom: "medium" }}>
          <Heading tag="h3">Access & Permissions</Heading>
          <Box
            pad="small"
            style={{
              border: "1px solid #e6e6e6",
              borderRadius: "3px",
              padding: "10px"
            }}
          >
            <Box pad={{ between: "small" }}>
              <Box direction="row" justify="center">
                <Box
                  flex
                  direction="row"
                  align="center"
                  justify="between"
                  responsive={false}
                >
                  <TextInput
                    placeHolder="Filter list by name or group"
                    value={this.state.inputValue}
                    onDOMChange={e =>
                      this.setState({ inputValue: e.target.value })
                    }
                  />
                  {this.props.canAdmin && (
                    <Button
                      size="small"
                      text="Add"
                      primary
                      icon={<AiOutlinePlus color="#fff" />}
                      onClick={() => this.setState({ showModal: true })}
                    />
                  )}
                </Box>
              </Box>
              <Box pad="small" align="start" margin={{ top: "small" }}>
                <Box direction="row" responsive={false}>
                  <Button
                    text={`All (${all_roles_length})`}
                    background={
                      this.state.filterResultsBy === "all" ? "#e1e1e1" : "#fff"
                    }
                    onClick={() => this.setState({ filterResultsBy: "all" })}
                    size="small"
                  />
                  <Button
                    text={`Users (${users_only.length})`}
                    margin="0 5px"
                    size="small"
                    background={
                      this.state.filterResultsBy === "user" ? "#e1e1e1" : "#fff"
                    }
                    onClick={() => this.setState({ filterResultsBy: "user" })}
                  />
                  <Button
                    text={`E-Groups (${egroups_only.length})`}
                    background={
                      this.state.filterResultsBy === "egroup"
                        ? "#e1e1e1"
                        : "#fff"
                    }
                    size="small"
                    onClick={() => this.setState({ filterResultsBy: "egroup" })}
                  />
                </Box>
              </Box>
              <Box className="deposit-acccess-table">
                <DepositAccessPagination
                  users_roles={users_roles}
                  access={access}
                />
                <AccessModal
                  open={this.state.showModal}
                  onClose={() => this.setState({ showModal: false })}
                  permissions={permissions}
                  access={access}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

DepositAccess.propTypes = {
  match: PropTypes.object,
  loading: PropTypes.bool,
  draft_id: PropTypes.string,
  draft: PropTypes.object,
  getUsers: PropTypes.func,
  permissions: PropTypes.object,
  handlePermissions: PropTypes.func,
  canAdmin: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    draft_id: state.draftItem.get("id"),
    draft: state.draftItem.get("data"),
    permissions: state.draftItem.get("access"),
    loading: state.draftItem.get("loading"),
    canAdmin: state.draftItem.get("can_admin")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handlePermissions: (draft_id, type, email, action, operation) =>
      dispatch(handlePermissions(draft_id, type, email, action, operation))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositAccess);
