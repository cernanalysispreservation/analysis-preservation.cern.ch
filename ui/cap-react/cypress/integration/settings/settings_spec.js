describe("Settings Page", function() {
  const newIdTitle =
    "this is my new title" +
    new Date().toLocaleString("en-GB", { timeZone: "UTC" });
  it("add new token", function() {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    // open menu
    cy.get("[data-cy=header-menu]").click();

    // select settings
    cy.get("[data-cy=settings-menuitem]").click();

    // open the modal
    cy.get("[data-cy=settings-add-token]").click();

    // type a new id
    cy.get("[data-cy=settings-token-form] form input").type(
      `${newIdTitle}{enter}`
    );
    // check that the new id exists in the list
    cy.get("[data-cy=settings-table-token-id]").contains(newIdTitle);
  });

  it("Delete the Token from the list", function() {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    // open menu
    cy.get("[data-cy=header-menu]").click();

    // select settings
    cy.get("[data-cy=settings-menuitem]").click();

    cy.contains(newIdTitle)
      .parent("tr")
      .within(() => {
        cy.get("td")
          .eq(3)
          .click();
      });
  });
});
