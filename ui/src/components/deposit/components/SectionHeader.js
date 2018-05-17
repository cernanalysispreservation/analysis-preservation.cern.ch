import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Header
} from 'grommet';


export default function SectionHeader(props) {
  return (
    <Header
      justify="center"
      alignContent="center"
      size="small"
      colorIndex="neutral-1-t"
      pad="none">
      <Box flex={true}
        justify="between"
        alignContent="center"
        direction="row"
        pad={{horizontal: "small"}}
        responsive={false}>
        <span>{props.label}</span>
      </Box>
      { props.icon ? props.icon : null}
    </Header>
  );
}

SectionHeader.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.element
};