describe('city weather component', () => {
  it('Searches weather for valid city', () => {
    cy.visit('/');
    cy.get("[data-cy='cityName']").type('London');
    cy.get("[data-cy='submitCity']").click();
    cy.get("[data-cy='weatherDisplay']").contains('London');
  });
  it('Searches weather for invalid city', () => {
    cy.visit('/');
    cy.get("[data-cy='cityName']").type('invalidcity');
    cy.get("[data-cy='submitCity']").click();
    cy.request({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather?q=invalidcity&appid=ff1bc4683fc7325e9c57e586c20cc03e`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body.message).to.eq('city not found');
    });
  });
  it('does not add any value to the input', () => {
    cy.visit('/');
    cy.get("[data-cy='submitCity']").click();
    cy.request({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather?q=invalidcity&appid=ff1bc4683fc7325e9c57e586c20cc03e`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body.message).to.eq('city not found');
    });
  });
});
