// describe('Table Component Visibility', () => {
//   it('passes', () => {
//     cy.visit("http://localhost:5173/supplier-dashboard/schedule/").should('exist').wait(1000);

//   });
// });

// Suppl

// Cypress.Commands.add('getDataTest', (testSelector) => {
//   return cy.get(`[data-test="${testSelector}"]`); 
// });

// describe('', () => {
//   it('Successful Login', () => {
//     cy.visit('http://localhost:5173/login');
//     cy.getDataTest('email-test').type('retailer@wiser.co{enter}');
//     cy.getDataTest('pwd-test').type('Validpass0');
//     cy.contains('button', 'Log In').click()
//   });
// });


describe('Supplier Login', () => {
  let data; // closure variable

  before(() => {
    cy.fixture('credentials').then((fData) => {
      data = fData;
    });
  });

  it('Login correct', () => {
    cy.visit('http://localhost:5173/login');

    cy.get('email-test').type(data.supplier.username); // usage of closure variable to get the values from the fixtures
    cy.get('pwd-test').type(data.supplier.password);
    cy.get('form-confirm-test').click();

    // assertion
    cy.contains('Dashboard').should('be.visible');
  });
});






// describe("GET Request For the Schedule Page", () => {
//   it("GET Call", () => {
//     cy.request('GET', 'http://127.0.0.1:8000/schedule/view/3/')
//       .then((response) => {
//         response = "Success!"
//       });

//   })
//   it('Objects on Table Body', () => {
//     cy.visit("http://localhost:5173/supplier-dashboard/schedule/").should('exist').wait(1000);
//   }
//   )
// });


// describe("Get Requests", () => {
//   it("GET Call", () => {
//     cy.request('GET', 'http://127.0.0.1:8000/schedule/view/3/')
//       .then((response) => {
//         response = "Success!"
//       });

//   })
//   it('Objects on Table Body', () => {
//     cy.visit("http://localhost:5173/supplier-dashboard/schedule/").should('exist').wait(1000);
//   }
//   )
// });

// describe('POST Request', () => {
//   it('Schedule Form', () => {
//     cy.visit("http://localhost:5173/supplier-dashboard/schedule");
//     cy.get('[id="add-schedule"]').wait(800).click();
//     cy.get('[id="add-scheduleform"]').should('exist');
//     cy.get('[id="weekday"]').contains('Sunday');
//     // cy.request('POST', 'http://127.0.0.1:8000/schedule/create/', {})
//     //   .then((response) => {
//     //     response = "Success!"
//     //   });


//   });
// });


// DELETE Request For the Schedule Page
// describe("DELETE Requests", () => {
//   it("DELETE Call", () => {
//     cy.request('DELETE', 'http://127.0.0.1:8000/schedule/delete')
//       .then((response) => {
//         Cypress.log({
//           name: 'Response Body',
//           message: JSON.stringify(response.body)
//         });
//       });

//   })
// });







// Here 
// it('Check Delete Schedule', () => {
//   cy.visit("http://localhost:5173/supplier-dashboard/schedule");
//   cy.get('[id="delete-schedule"]').wait(800).click({ multiple: true });
//   // cy.get(':nth-child(5) > .ant-popover > .ant-popover-content > .ant-popover-inner > .ant-popover-inner-content > .ant-popconfirm-inner-content > .ant-popconfirm-buttons > .ant-btn-primary').click()
//   cy.intercept('DELETE', 'http://127.0.0.1:8000/schedule/delete/').as('deleteRequest');

// // Assuming 'key' holds the value of the ID you want to delete
// const key = '5';

// cy.get(':nth-child(5) > .ant-popover > .ant-popover-content > .ant-popover-inner > .ant-popover-inner-content > .ant-popconfirm-inner-content > .ant-popconfirm-buttons > .ant-btn-primary').click();


// }
// )






// describe('Schedule Component', () => {
//   beforeEach(() => {
//     cy.visit('http://localhost:5173/supplier-dashboard/schedule/'); // Replace with the actual URL or route of your component
//   });

//   it('renders schedule component correctly', () => {
//     cy.get('[data-testid="schedule-test"]').should('exist');
//   });

//   it('adds a new schedule', () => {
//     cy.get('#add-schedule').click(); // Click on the add button to open the modal
//     cy.get('#weekday').contains('Sunday'); // Select Sunday from the dropdown
//     cy.get('#add-schedule-time').type('08:00'); // Type time into the input field
//     cy.get('#add-schedule-submit').click(); // Click on the submit button

//     // Check if the new schedule card is added
//     cy.get('.ScheduleCard').should('exist'); // Assuming you have a class for ScheduleCard
//   });

// You can write more tests for edge cases, validation, etc.
// });









// describe('Choose a weekday',() => {
//   it('passes', () => {
//     cy.visit("http://localhost:5173/supplier-dashboard/schedule");
//     cy.get('[id="weekday"]').click('Sunday');
//   });
// });








