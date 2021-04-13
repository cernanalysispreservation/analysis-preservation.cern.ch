import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";

import { FiSliders } from "react-icons/fi";
import Empty from "../../img/empty_search.svg";

import SearchFacets from "./SearchFacets";
import SearchUtils from "./SearchUtils";
import SearchResults from "./SearchResults";
import SearchTag from "./SearchTag";

import { fetchSearch } from "../../actions/search";
import queryString from "query-string";

import SearchResultHeading from "./SearchResultHeading";
import SearchResultsLoading from "./SearchResultsLoading";
import SearchFilterLayer from "./SearchFilterLayer";

import DocumentTitle from "../partials/Title";
import Button from "../partials/Button";

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layerActive: false
    };
  }

  componentDidMount() {
    this.props.fetchSearch(this.props.match);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.props.fetchSearch(this.props.match);
    }
  }

  _changePageSize(size) {
    let currentParams = queryString.parse(this.props.location.search);
    const location = {
      search: `${queryString.stringify(
        Object.assign(currentParams, { size: size })
      )}`
    };

    this.props.history.push(location);
    this.props.fetchSearch(this.props.match);
  }

  _updateParams = (parent, child) => {
    let currentParams = queryString.parse(this.props.location.search);

    if (Array.isArray(currentParams[parent])) {
      currentParams[parent] = currentParams[parent].filter(
        item => item != child
      );
    } else {
      delete currentParams[parent];
    }

    const location = {
      search: queryString.stringify(currentParams)
    };

    this.props.history.push(location);
  };

  _updateSearchQuery = (param, item) => {
    let currentParams = queryString.parse(this.props.location.search);
    if (param === "query") {
      currentParams["q"] = "";
    } else {
      if (Array.isArray(currentParams[param])) {
        currentParams[param] = currentParams[param].filter(i => i != item);
      } else {
        delete currentParams[param];
      }
    }
    const location = {
      search: queryString.stringify(currentParams)
    };
    this.props.history.push(location);
  };

  _changePage(page) {
    let currentParams = queryString.parse(this.props.location.search);

    const location = {
      search: `${queryString.stringify(
        Object.assign(currentParams, { page: page })
      )}`
    };
    this.props.history.push(location);
  }

  render() {
    let utils;
    let total = null;
    let results = null;
    let queryParams = 0;

    let _results = {};
    let _aggs;

    if (this.props.results) {
      _results = this.props.results.toJS();
      _aggs = _results.aggregations;
    }

    // count the number of filters in order to update the button text
    // for the responsive screens
    if (queryString.parse(this.props.location.search)) {
      let params = Object.entries(
        queryString.parse(this.props.location.search)
      );
      params = params.filter(item => item[0] !== "q" && item[0] !== "page");
      params.map(item => {
        queryParams += Array.isArray(item[1]) ? item[1].length : 1;
      });
    }

    if (_results && _results.hits) {
      total = _results.hits.total;
      utils = (
        <SearchUtils
          loading={this.props.loading}
          currentPage={
            this.props.selectedAggs.page
              ? parseInt(this.props.selectedAggs.page)
              : 1
          }
          size={
            this.props.selectedAggs.size
              ? parseInt(this.props.selectedAggs.size)
              : 10
          }
          total={total || 0}
          onPageChange={this._changePage.bind(this)}
          onPageSizeChange={this._changePageSize.bind(this)}
        />
      );

      results = this.props.loading ? (
        <Box flex={false} justify="center" align="center">
          <SearchResultsLoading />
        </Box>
      ) : this.props.error ? (
        <Box flex={false} justify="center" align="center">
          <Empty />
          <Label style={{ textAlign: "center" }}>
            There was an error with your request <br />
            please try again
          </Label>
        </Box>
      ) : total === 0 ? (
        <Box flex={false} justify="center" align="center">
          <Empty />
          <Label style={{ textAlign: "center" }}>
            No search results were found <br />or <br />you have no permission
            to see them
          </Label>
        </Box>
      ) : (
        <Box flex={false} justify="center" align="center">
          <SearchResults results={_results.hits.hits || []} />
          {utils}
        </Box>
      );
    }

    return (
      <DocumentTitle title="Search">
        <Box
          flex={false}
          align="center"
          colorIndex="light-2"
          style={{ minHeight: "100%" }}
        >
          <SearchFilterLayer
            active={this.state.layerActive}
            onClose={() => this.setState({ layerActive: false })}
            properties={
              <SearchFacets
                removeType={this.props.match.params.anatype}
                aggs={_aggs}
                selectedAggs={this.props.selectedAggs}
                onChange={this._toggleAggs}
              />
            }
          />
          <Box direction="row">
            <Box id="sidebar">
              <SearchFacets
                removeType={this.props.match.params.anatype}
                aggs={_aggs}
                regs={this.props.results.get("aggregations")}
                selectedAggs={this.props.selectedAggs}
                onChange={this._toggleAggs}
              />
            </Box>
            <Box pad="medium">
              <Box
                direction="row"
                align="start"
                justify="between"
                responsive={false}
                margin={{ bottom: "small" }}
              >
                <SearchResultHeading results={_results.hits.total} />
                <Button
                  id="sidebar_button"
                  primary
                  icon={<FiSliders />}
                  text={
                    queryParams > 0 ? `Filters (${queryParams})` : "Filters"
                  }
                  onClick={() => this.setState({ layerActive: true })}
                />
              </Box>
              <SearchTag
                params={
                  this.props.location
                    ? queryString.parse(this.props.location.search)
                    : undefined
                }
                anatype={
                  this.props.match.params
                    ? this.props.match.params.anatype
                    : null
                }
                removeAnatype={() => {
                  this.props.history.push(
                    `/search${this.props.location.search}`
                  );
                }}
                onClick={this._updateParams}
                removeQuery={this._updateSearchQuery}
              />
              {results}
            </Box>
          </Box>
        </Box>
      </DocumentTitle>
    );
  }
}

SearchPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  fetchSearch: PropTypes.func,
  history: PropTypes.object.isRequired,
  match: PropTypes.object,
  location: PropTypes.object.isRequired,
  selectedAggs: PropTypes.object.isRequired,
  results: PropTypes.object.isRequired,
  error: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    results: state.search.getIn(["results"]),
    loading: state.search.getIn(["loading"]),
    selectedAggs: state.search.getIn(["selectedAggs"]),
    error: state.search.getIn(["error"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSearch: match => dispatch(fetchSearch(match))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SearchPage));
