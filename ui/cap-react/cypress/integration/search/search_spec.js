describe("Search Integration Suite", function() {
  it("Navigate to search page for published results", function() {
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    // find the search bar
    cy.get("input[type='search']")
      .should("have.attr", "id", "searchbar")
      .type("cern{enter}");

    cy.url().should("include", "search?q=cern");

    cy.get("input#search_facet_published_checkbox").should(
      "have.attr",
      "checked"
    );
    cy.get("input#search_facet_yours_checkbox").should("have.attr", "checked");
  });

  it("Navigate search page for drafts results", function() {
    // login first
    cy.loginUrl("info@inveniosoftware.org", "infoinfo");

    // find the search bar
    cy.get('input[type="search"]')
      .should("have.attr", "id", "searchbar")
      .type("cern");
    // find the draft div
    cy.get("div.grommetux-search__suggestion")
      .first()
      .click();

    cy.get("input#search_facet_published_checkbox").should(
      "not.have.attr",
      "checked"
    );

    // validate the url
    cy.url().should("include", "/drafts?q=cern");
  });
});
