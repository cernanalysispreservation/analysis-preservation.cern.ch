import React from "react";
import PropTypes from "prop-types";

import _debounce from "lodash/debounce";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";

import Button from "../partials/Button";

import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";

export default class SearchUtils extends React.Component {
  constructor(props) {
    super(props);
  }

  _onPageChange = _debounce(page => {
    this.props.onPageChange(page);
  }, 300);

  _onPageSizeChange(size) {
    this.props.onPageSizeChange(size);
  }

  _onNextPage(numPages) {
    if (this.props.currentPage < numPages)
      this._onPageChange(this.props.currentPage + 1);
  }

  _onPrevPage() {
    if (this.props.currentPage > 1)
      this._onPageChange(this.props.currentPage - 1);
  }

  render() {
    let num_pages = Math.ceil(this.props.total / this.props.size);

    return (
      <Box
        colorIndex="light-2"
        direction="row"
        justify="between"
        alignContent="center"
        responsive={false}
      >
        <Box
          align="center"
          justify="between"
          direction="row"
          responsive={false}
        >
          <Button
            size="iconSmall"
            margin="0 5px"
            onClick={this._onPrevPage.bind(this)}
            icon={<AiOutlineLeft size={15} />}
          />
          {this.props.total != 0 ? (
            <Label size="small" uppercase={true}>
              Page <strong>{this.props.currentPage}</strong> of{" "}
              <strong>{num_pages}</strong>
            </Label>
          ) : null}
          <Button
            margin="0 5px"
            size="iconSmall"
            onClick={this._onNextPage.bind(this, num_pages)}
            icon={<AiOutlineRight size={15} />}
          />
        </Box>
      </Box>
    );
  }
}

SearchUtils.propTypes = {
  loading: PropTypes.bool.isRequired,
  total: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func
};
