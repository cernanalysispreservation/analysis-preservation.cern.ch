describe("Published Tests", function() {
  const firstTitle = "My First CMS Analysis";
  it("Publish a CMS Draft", () => {
    // create a new ALICE Analysis
    // given a random tiltle
    cy.createDraft("CMS Analysis", firstTitle, "cms");

    cy.visit("/");

    cy.get("[data-cy=drafts-list] a")
      .first()
      .click();

    // navoigate to settings tab
    cy.get("[data-cy=draft-settings]").click();

    // click publish button
    cy.get("[data-cy=settings-publish-btn]").click();

    // confirm publish action
    cy.get("[data-cy=layer-primary-action]").click();

    // check if it was moved to the publised
    cy.url().should("include", "/published");
  });
  it("A published report would not be deleted", () => {
    cy.loginUrl("cms@inveniosoftware.org", "cmscms");

    cy.get("[data-cy=publishedincollaboration-list] a")
      .first()
      .click();

    cy.get("[data-cy=edit-published]").click();

    // navoigate to settings tab
    cy.get("[data-cy=draft-settings]").click();

    cy.get("[data-cy=draft-delete-btn]").should("have.attr", "disabled");
  });
  it("Change a published into a Draft", () => {
    cy.createDraft("CMS Analysis", firstTitle, "cms");

    cy.visit("/");

    cy.get("[data-cy=drafts-list] a")
      .first()
      .click();

    // navoigate to settings tab
    cy.get("[data-cy=draft-settings]").click();

    // click publish button
    cy.get("[data-cy=settings-publish-btn]").click();

    // confirm publish action
    cy.get("[data-cy=layer-primary-action]").click();
    cy.get("[data-cy=edit-published]").click();

    // check the status to be published
    cy.get("[data-cy=deposit-status-tag]").contains("published");

    // find the button to change the status to draft
    cy.get("[data-cy=change-to-draft]").click();

    // check the status to be published
    cy.get("[data-cy=deposit-status-tag]").contains("draft");
  });
});
