// describe('Table Component Visibility', () => {
//   it('passes', () => {
//     cy.visit("http://localhost:5173/supplier-dashboard/schedule/").should('exist').wait(1000);

//   });
// });

// // Add Schedule

// GET Request For the Schedule Page
describe("Get Requests", () => {
  it("GET Call", () => {
    cy.request('GET', 'http://127.0.0.1:8000/schedule/view/3/')
      .then((response) => {
        response = "Success!"
      });

  })
  it('Objects on Table Body', () => {
    cy.visit("http://localhost:5173/supplier-dashboard/schedule/").should('exist').wait(1000);
  }
  )
});

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








describe('POST Request', () => {
  it('Schedule Form', () => {
    cy.visit("http://localhost:5173/supplier-dashboard/schedule");
    cy.get('[id="add-schedule"]').wait(800).click();
    cy.get('[id="add-scheduleform"]').should('exist');
    cy.get('[id="weekday"]').contains('Sunday')

  });
});


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








