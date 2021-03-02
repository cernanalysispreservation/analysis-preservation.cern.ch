describe("Create Draft", () => {
  let firstTitle = "Random Title";
  let updatedTitle = "This is my new title";
  it("Create a new Draft", () => {
    // create a new ALICE Analysis
    // given a random tiltle
    cy.createDraft("CMS Analysis", firstTitle);
  });

  it("Update the general title of the draft", () => {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");
    // get the title div
    // and enable editing
    cy.get("label")
      .contains(firstTitle)
      .click();

    // erase the previous title and insert the new one
    cy.get("[data-cy=general-title-input]")
      .should("have.value", firstTitle)
      .clear()
      .type("This is my new title{enter}");

    // search the new title
    cy.get("[data-cy=editable-value]").contains(updatedTitle);

    // make sure that the previous is not there and the update was succesfull
    cy.get("[data-cy=editable-value]")
      .contains(firstTitle)
      .should("not.exist");
  });
  it("Update the title but discard saving", () => {
    // get the title div
    // and enable editing
    cy.get("div")
      .contains(firstTitle)
      .click();

    // erase the previous title and insert the new one
    cy.get("[data-cy=general-title-input]")
      .should("have.value", firstTitle)
      .clear()
      .type(updatedTitle);

    // approve the changes
    cy.get("[data-cy=closeicon]").click();

    cy.wait(2000);

    // search the new title
    cy.get("div")
      .contains(firstTitle)
      .click();
    // make sure that the previous is not there and the update was succesfull
    cy.get("div")
      .contains(updatedTitle)
      .should("not.exist");
  });

  it("Does not allow to continue when anatype is not selected", () => {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    cy.get("div#ct-container").should("not.exist");
    // open the Create modal
    cy.get("div")
      .contains("Create")
      .click();

    // type in a General Title
    cy.get("input[type='text']").type("This is my new draft");

    // Start Preserving
    cy.get("div")
      .contains("Start Preserving")
      .click();

    cy.wait(1000);

    cy.url().should("eq", "http://localhost:3000/");
  });
  it("Delete Draft", () => {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    cy.get("[data-cy=drafts-list] a")
      .first()
      .click();

    // navoigate to settings tab
    cy.get("[data-cy=draft-settings]").click();

    cy.get("[data-cy=draft-delete-btn]").click();

    cy.get("[data-cy=layer-primary-action]").click();

    cy.url().should("eq", "http://localhost:3000/");
  });
});
