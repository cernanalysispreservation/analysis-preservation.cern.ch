import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  List,
  ListItem,
} from 'grommet';

import ArrayUtils from '../components/ArrayUtils';

class AccordionArrayField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box size={{height: {max: "small"}}} >
        <List>
          { this.props.items.length > 0 ?
            this.props.items.map(element => (
              <ListItem key={element.index} margin="none" pad="none">
                <Box flex={true}>
                  {element.children}
                </Box>
                <ArrayUtils
                  hasRemove={element.hasRemove}
                  hasMoveDown={element.hasMoveDown}
                  hasMoveUp={element.hasMoveUp}
                  onDropIndexClick={element.onDropIndexClick}
                  onReorderClick={element.onReorderClick}
                  index={element.index}
                />
              </ListItem>
            )) : null
          }
        </List>
      </Box>
    );
  }
}

AccordionArrayField.propTypes = {
  items: PropTypes.object
};

export default AccordionArrayField;