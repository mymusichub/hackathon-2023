describe("Page", () => {
  it("Should render home page", () => {
    cy.visit(`http://localhost:3000/home`);

    cy.get('[data-testid="home-page"]').should("exist");
  });
});

export {};
