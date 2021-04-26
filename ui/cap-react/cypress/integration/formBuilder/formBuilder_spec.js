describe("Form Builder", function() {
  // with respect to the current working folder

  it("Select the CMS Analysis from the predefined schems", function() {
    cy.goToFormBuilder();

    // select the div contains the CMS Analysis text
    cy.get("div")
      .contains("CMS Analysis")
      .click();

    cy.get("header span").contains("CMS Analysis");
  });

  it("Select the CMS Statistics Questionnaire from the predefined schems", function() {
    cy.goToFormBuilder();

    // select the div contains the CMS Analysis text
    cy.get("div")
      .contains("CMS Statistics Questionnaire")
      .click();

    cy.get("header span").contains("CMS Statistics Questionnaire");
  });

  it("Start a new schema on your own", function() {
    cy.goToFormBuilder();

    const name = "Name of the form";
    const description = "Description of the form";

    // Find the form and add a new name
    cy.get("input#root_name").type(name);
    cy.get("textarea#root_description").type(description);

    // create the form
    cy.get("form div")
      .contains("Create")
      .click();

    cy.get("header span").contains(name);
  });

  // it("Download Schema File", () => {
  //   cy.goToFormBuilder();

  //   const name = "Name of the form";
  //   const description = "Description of the form";
  //   const exportSchema = "Export Schema";
  //   const downloadedFilename = path.join(
  //     "Users/antoniospapadopoulos⁩/Downloads/",
  //     "fileName.json"
  //   );

  //   // Find the form and add a new name
  //   cy.wait(2000);
  //   cy.get("input#root_name").type(name);
  //   cy.get("textarea#root_description").type(description);

  //   // create the form
  //   cy.get("form div")
  //     .contains("Create")
  //     .click();

  //   cy.wait(2000);

  //   cy.get("header div")
  //     .contains(exportSchema)
  //     .click();

  //   cy.log("Start of download");

  //   // description is the same as the one entered when creating
  //   cy.readFile(downloadedFilename)
  //     .its("deposit_schema.description")
  //     .should("eq", description);
  //   cy.readFile(downloadedFilename)
  //     .its("fullname")
  //     .should("eq", name);
  // });
});
