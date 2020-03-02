import React from "react";

import Box from "grommet/components/Box";

import Header from "./Header";
import Intro from "./Intro";
import Discover from "./Discover";
import Explain from "./Explain";
import Integrations from "./Integrations";
import Documentation from "./Documentation";
import Footer from "./Footer";

class WelcomePage extends React.Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
    this.IntroRef = React.createRef();
    this.DiscoverRef = React.createRef();
    this.ExplainRef = React.createRef();
    this.IntegrationsRef = React.createRef();
    this.DocumentationRef = React.createRef();

    this.nav = {
      intro: {
        title: "Home",
        ref: this.IntroRef
      },
      discover: {
        title: "What is CAP?",
        ref: this.DiscoverRef
      },
      explain: {
        title: "Get Started",
        ref: this.ExplainRef
      },
      integrations: {
        title: "Integrations",
        ref: this.IntegrationsRef
      },
      docs: {
        title: "Documentation",
        ref: this.DocumentationRef
      }
    };
  }

  scrollToRef = ref => {
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  render() {
    return (
      <Box>
        <Header nav={this.nav} scrollToRef={this.scrollToRef} />

        <Intro scrollToRef={this.IntroRef} />

        <Discover scrollToRef={this.DiscoverRef} />

        <Explain scrollToRef={this.ExplainRef} />

        <Integrations scrollToRef={this.IntegrationsRef} />

        <Documentation scrollToRef={this.DocumentationRef} />

        <Footer />
      </Box>
    );
  }
}

export default WelcomePage;
