import React, { Component } from "react"
import ReactDOM from 'react-dom';
import { create, ReactTestRenderer, ReactTestRendererJSON } from "react-test-renderer";
import AddContactForm from "../ContactForm";
import Fields from "../Fields";

let container; 

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

test('render and matches snapshot', () => {
    expect(create(<AddContactForm />).toJSON()).toMatchSnapshot();
});

test('reset button empties inputs', () => {
    ReactDOM.render(<AddContactForm />, container);

    const resetButton = container.querySelector('.reset-button');
    const firstNameInput = container.querySelector('#firstName');
    const lastNameInput = container.querySelector('#lastName');
    const emailAddressInput = container.querySelector('#emailAddress');
    const specialityInput = container.querySelector('#speciality');
    const practiceNameInput = container.querySelector('#practiceName');
    
    // fill in the add contact form 
    firstNameInput.value = "Bob";
    lastNameInput.value = "Smith";
    emailAddressInput.value = "real@gmail.com"
    specialityInput.value = "Somnologist"
    practiceNameInput.value = "A Real Practice MD"

    expect(firstNameInput.value).toBe("Bob");
    expect(lastNameInput.value).toBe("Smith");
    expect(emailAddressInput.value).toBe("real@gmail.com");
    expect(specialityInput.value).toBe("Somnologist");
    expect(practiceNameInput.value).toBe("A Real Practice MD");

    // simulate reset button press
    resetButton.dispatchEvent(new MouseEvent('click', {bubbles: true}));

    expect(firstNameInput.value).toBe("");
    expect(lastNameInput.value).toBe("");
    expect(emailAddressInput.value).toBe("");
    expect(specialityInput.value).toBe("N/A");
    expect(practiceNameInput.value).toBe("");
});

test.each`
    meaning                          | field                     | value                          | expectedErrorMessages
    ${"email address has no @"}      | ${Fields.EMAIL_ADDRESS}   | ${"igetspammed1234"}           | ${1}
    ${"email address has no domain"} | ${Fields.EMAIL_ADDRESS}   | ${"igetspammed1234@"}          | ${1}
    ${"email address has no url"}    | ${Fields.EMAIL_ADDRESS}   | ${"igetspammed1234@t."}        | ${1}
    ${"valid email addresss"}        | ${Fields.EMAIL_ADDRESS}   | ${"igetspammed1234@gmail.com"} | ${0}
    ${"first name includes number"}  | ${Fields.FIRST_NAME}      | ${"B0b"}                       | ${1}
    ${"valid last name"}             | ${Fields.FIRST_NAME}      | ${"Bob"}                       | ${0}
    ${"last name includes number"}   | ${Fields.LAST_NAME}       | ${"Sm1th"}                     | ${1}
    ${"valid last name"}             | ${Fields.LAST_NAME}       | ${"Smith"}                     | ${0}
`('validate form change where $meaning', ({field, value, expectedErrorMessages}) => {
    let form = new AddContactForm();
    let inputElement = document.createElement('input');
    inputElement.name = field.toString();
    inputElement.value = value;
    const errorMessages = form.validateFormInput(inputElement);

    expect(errorMessages.size).toBe(expectedErrorMessages);
    expect(errorMessages.has(field)).toBe(expectedErrorMessages > 0);
});

test.each`
    scenario                        | field                   | invalidValue           | fixedValue
    ${"remove invalid email"}       | ${Fields.EMAIL_ADDRESS} | ${"igetspammed1234"}   | ${"igetspammed1234@gmail.com"}
    ${"remove first name has #"}    | ${Fields.FIRST_NAME}    | ${"0"}                 | ${"Bob"}
    ${"remove last name has #"}     | ${Fields.LAST_NAME}     | ${"1"}                 | ${"Smith"}
    ${"empty email to fix invalid"} | ${Fields.EMAIL_ADDRESS} | ${"igetspammed1234"}   | ${""}
    ${"empty first name to fix #"}  | ${Fields.FIRST_NAME}    | ${"0"}                 | ${""}
    ${"empty last name to fix #"}   | ${Fields.LAST_NAME}     | ${"1"}                 | ${""}
`('should $scenario error message after fixing', ({field, invalidValue, fixedValue}) => {
    // insert incorrect e-mail
    let form = new AddContactForm();
    let inputElement = document.createElement('input');
    inputElement.name = field.toString();
    inputElement.value = invalidValue;
    let errorMessages = form.validateFormInput(inputElement);

    // error message should appear 
    expect(errorMessages.size).toBe(1);
    expect(errorMessages.has(field)).toBeTruthy();
    // fix e-mail
    inputElement.value = fixedValue;
    
    errorMessages = form.validateFormInput(inputElement);

    // error message should disappear
    expect(errorMessages.size).toBe(0);
    expect(errorMessages.has(Fields.EMAIL_ADDRESS)).toBeFalsy();
});

test('validate form submit', () => {

});

test('handleSubmit', () => {

});

test('handleFormChange', () => {

});

function testInitialState(instance) {
    expect(instance.state.firstName).toBe("");
    expect(instance.state.lastName).toBe("");
    expect(instance.state.emailAddress).toBe("");
    expect(instance.state.speciality).toBe("N/A");
    expect(instance.state.practiceName).toBe("");
    expect(instance.state.errorMessages).toBeInstanceOf(Map);
}

