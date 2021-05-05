import React from "react";
// import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Paragraph from "grommet/components/Paragraph";
import Label from "grommet/components/Label";

import SelectContentType from "../../containers/SelectContentType";
import CreateContentType from "../../containers/CreateContentType";
import DropZoneForm from "./DropZoneForm";

class CMSIndex extends React.Component {
  render() {
    return (
      <Box
        flex={true}
        colorIndex="light-2"
        justify="around"
        align="center"
        direction="row"
        pad="small"
      >
        <Box
          style={{
            boxShadow: "1px 1px 49px -22px rgba(0,0,0,0.3)",
            borderRadius: "3px"
          }}
          colorIndex="light-1"
        >
          <Header
            flex={true}
            colorIndex="neutral-1"
            pad="small"
            direction="column"
            wrap={true}
            style={{
              borderRadius: "3px"
            }}
          >
            <Label flex="true" size="medium" margin="none">
              Create your form dynamically
            </Label>
            <Paragraph
              flex="true"
              align="center"
              margin={{ top: "small", bottom: "none" }}
            >
              You can create/edit/update your form easily
            </Paragraph>
            <Paragraph flex="true" align="center" margin="none">
              by drag and drop elements
            </Paragraph>
          </Header>
          <Box
            direction="row"
            pad="small"
            flex
            wrap
            justify="center"
            style={{
              borderRadius: "3px"
            }}
            responsive={false}
          >
            <Box
              style={{
                display: "flex",
                flex: "0 1 300px",
                border: ".5px solid #d9d9d9",
                borderRadius: "2px"
              }}
              pad="small"
              margin="small"
            >
              <CreateContentType />
            </Box>
            <Box
              style={{
                display: "flex",
                flex: "0 1 300px",
                border: ".5px solid #d9d9d9",
                borderRadius: "2px"
              }}
              pad="small"
              margin="small"
            >
              <DropZoneForm />
            </Box>
            <Box
              style={{
                display: "flex",
                flex: "0 1 300px",
                border: ".5px solid #d9d9d9",
                borderRadius: "2px"
              }}
              pad="small"
              margin="small"
            >
              <SelectContentType />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default CMSIndex;
