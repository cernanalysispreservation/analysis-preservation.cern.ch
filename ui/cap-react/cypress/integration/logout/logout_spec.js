describe("Logout Process", function() {
  it("Test Logout Process", function() {
    //login first
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    // logout
    cy.get(".headerMenuAppp").click();
    cy.get("a.not-underline span")
      .contains("Logout")
      .click({ force: true });

    cy.url().should("include", "/login?next=/");
  });
});
