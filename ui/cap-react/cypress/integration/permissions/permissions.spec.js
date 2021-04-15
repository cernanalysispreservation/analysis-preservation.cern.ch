describe("Validate Deposit Groups", () => {
  it("Deposit Groups for a  CMS member", () => {
    cy.login("cms@inveniosoftware.org", "cmscms");

    cy.visit("/create");

    // find out if the deposit groups are the correct ones
    // CMS Analysis and CMS Statistics Questionnaire
    cy.get("[data-cy=deposit-group-list] > div")
      .children()
      .each(value => {
        cy.wrap(value)
          .get("[data-cy=deposit-group-name]")
          .should(
            "have.attr",
            "name",
            "CMS Analysis" || "CMS Statistics Questionnaire"
          );
      });
  });
  it("Deposit Groups for an ATLAS member", () => {
    cy.login("atlas@inveniosoftware.org", "atlasatlas");

    cy.visit("/create");

    // find out if the deposit groups are the correct ones
    // CMS Analysis and CMS Statistics Questionnaire
    cy.get("[data-cy=deposit-group-list] > div")
      .children()
      .each(value => {
        cy.wrap(value)
          .get("[data-cy=deposit-group-name]")
          .should("have.attr", "name", "ATLAS Analysis");
      });
  });
  it("Deposit Groups for an Alice member", () => {
    cy.login("alice@inveniosoftware.org", "alicealice");

    cy.visit("/create");

    // find out if the deposit groups are the correct ones
    // CMS Analysis and CMS Statistics Questionnaire
    cy.get("[data-cy=deposit-group-list] > div")
      .children()
      .each(value => {
        cy.wrap(value)
          .get("[data-cy=deposit-group-name]")
          .should("have.attr", "name", "ALICE Analysis");
      });
  });
  it("Deposit Groups for an LHCB member", () => {
    cy.login("lhcb@inveniosoftware.org", "lhcblhcb");

    cy.visit("/create");

    // find out if the deposit groups are the correct ones
    // CMS Analysis and CMS Statistics Questionnaire
    cy.get("[data-cy=deposit-group-list] > div")
      .children()
      .each(value => {
        cy.wrap(value)
          .get("[data-cy=deposit-group-name]")
          .should("have.attr", "name", "LHCb Analysis");
      });
  });
});
