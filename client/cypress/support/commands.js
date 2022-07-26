// ---------------------------------------------------------------- //
//                                                                  //
//                 PLEASE DO NOT MODIFY THIS FILE.                  //
//               Hatchways automation depends on it.                //
//                                                                  //
// ---------------------------------------------------------------- //

Cypress.Commands.add("checkPath", (path) => {
  return cy.url().should("eq", `http://localhost:3000/${path}`);
});

Cypress.Commands.add("visitPath", (path) => {
  return cy.visit(`http://localhost:3000/${path}`);
});

Cypress.Commands.add("interceptRegister", () => {
  return cy.intercept(
    {
      method: "POST",
      url: "http://localhost:3000/auth/register",
    },
    {
      id: 8,
      username: "test",
      email: "test@test.com",
      password:
        "f146844e46abedfcfd10b04e3bd4276574fa74ae8102495aff19839f4993ec9f",
      updatedAt: "2022-05-25T16:11:33.581Z",
      createdAt: "2022-05-25T16:11:33.581Z",
      salt: "10DoTe1tmaW6nRhxQuxAZw==",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjUzNDk1MDkzLCJleHAiOjE2NTM1ODE0OTN9.-vvMle8g-MkuDIgTR0S6yyPP_cPeknFxPf0j3gc2JR8",
      completedOnboarding: false,
    }
  );
});

Cypress.Commands.add("interceptGetOnboarding", () => {
  return cy.intercept(
    {
      method: "GET",
      url: "http://localhost:3000/api/onboarding",
    },
    {
      steps: [
        [
          {
            name: "firstName",
            label: "First Name",
            type: "text",
            required: true,
          },
          {
            name: "lastName",
            label: "Last Name",
            type: "text",
          },
          {
            name: "bio",
            label: "Bio",
            type: "multiline-text",
          },
        ],
        [
          {
            name: "country",
            label: "Country",
            type: "text",
            required: true,
          },
          {
            name: "receiveNotifications",
            label:
              "I would like to receive email notifications for new messages when I'm logged out",
            type: "yes-no",
            required: true,
          },
          {
            name: "receiveUpdates",
            label:
              "I would like to receive updates about the product via email",
            type: "yes-no",
            required: true,
          },
        ],
      ],
    }
  );
});
