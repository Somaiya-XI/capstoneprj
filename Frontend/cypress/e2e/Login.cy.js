// Login Assertions
describe("Get Requests", () => {
    it("GET Call", () => {
      cy.visit('http://localhost:5173/login');
      cy.get('[id="email-test"]').type('userX@wise.me{enter}')
      cy.get('[id="password-test"]').type('Validpass0')
      cy.get('btn').click();
        
  
    })
  });


  

  // // Specified Product URL from a catalog => Success
// describe("Get Requests", () => {
//     it("GET Call", () => {
//       cy.request('GET', 'http://localhost:8000/product/catalog-product/c5f6100f-ba13-4d4a-bce0-c0ea736417ca/')
//         .then((response) => {
//           Cypress.log({
//             name: 'Response Body',
//             message: JSON.stringify(response.body)
//           });
  
//           expect(response.status).to.equal(200);
//         });
//     });
//   });