import React from "react"
import {render, screen, fireEvent} from '@testing-library/react'
import { create } from "react-test-renderer";
import ContactForm from "../ContactForm";
import Fields from "../Fields";

test('render and matches snapshot', () => {
    expect(create(<ContactForm />).toJSON()).toMatchSnapshot();
});

test('initial form state', () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name')
    const emailAddressInput = screen.getByLabelText('Email Address');
    const specialityInput = screen.getByLabelText('Speciality');
    const practiceNameInput = screen.getByLabelText('Practice Name');

    expect(firstNameInput.value).toBe('');
    expect(lastNameInput.value).toBe('');
    expect(emailAddressInput.value).toBe('');
    expect(specialityInput.value).toBe('N/A');
    expect(practiceNameInput.value).toBe('');
});

test('reset button clears all form fields', () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name')
    const emailAddressInput = screen.getByLabelText('Email Address');
    const specialityInput = screen.getByLabelText('Speciality');
    const practiceNameInput = screen.getByLabelText('Practice Name');

    firstNameInput.value = "Bob";
    lastNameInput.value = "Smith";
    emailAddressInput.value = "real@gmail.com";
    specialityInput.value = "Somnologist";
    practiceNameInput.value = "A Real Practice MD";
    
    expect(firstNameInput.value).toBe('Bob');
    expect(lastNameInput.value).toBe('Smith');
    expect(emailAddressInput.value).toBe('real@gmail.com');
    expect(specialityInput.value).toBe('Somnologist');
    expect(practiceNameInput.value).toBe('A Real Practice MD');

    fireEvent.click(screen.getByText('Reset'));
    
    expect(firstNameInput.value).toBe('');
    expect(lastNameInput.value).toBe('');
    expect(emailAddressInput.value).toBe('');
    expect(specialityInput.value).toBe('N/A');
    expect(practiceNameInput.value).toBe('');
});

test.each`
    meaning                          | value                          | expectedErrorMessages
    ${"email address has no @"}      | ${"igetspammed1234"}           | ${1}
    ${"email address has no domain"} | ${"igetspammed1234@"}          | ${1}
    ${"email address has no url"}    | ${"igetspammed1234@t."}        | ${1}
    ${"valid email address"}         | ${"igetspammed1234@gmail.com"} | ${0}
`('validate form change where $meaning', async ({field, value, expectedErrorMessages}) => {
    render(<ContactForm />);

    const emailAddressInput = screen.getByLabelText('Email Address');

    fireEvent.change(emailAddressInput, { target: { value: value}});
    
    expect(emailAddressInput.value).toBe(value);

    if (expectedErrorMessages === 1) {
        const errorMessage = await screen.findByText("Email Address must be in example@gmail.com format.");
        expect(errorMessage).toBeTruthy();
    } else {
        const errorMessage = screen.queryByText("Email Address must be in example@gmail.com format.");
        expect(errorMessage).toBeNull();
    }
});

test.each`
    meaning                          | value                          | expectedErrorMessages
    ${"first name includes number"}  | ${"B0b"}                       | ${1}
    ${"valid first name"}            | ${"Bob"}                       | ${0}
`('validate first name form change where $meaning', async ({field, value, expectedErrorMessages}) => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText('First Name');

    fireEvent.change(firstNameInput, { target: { value: value}});
    
    expect(firstNameInput.value).toBe(value);

    if (expectedErrorMessages === 1) {
        const errorMessage = await screen.findByText("First Name should not include numbers");
        expect(errorMessage).toBeTruthy();
    } else {
        const errorMessage = screen.queryByText("First Name should not include numbers`");
        expect(errorMessage).toBeNull();
    }
});

test.each`
    meaning                         | value                            | expectedErrorMessages
    ${"last name includes number"}  | ${"Sm1th"}                       | ${1}
    ${"valid last name"}            | ${"Smith"}                       | ${0}
`('validate first name form change where $meaning', async ({field, value, expectedErrorMessages}) => {
    render(<ContactForm />);

    const lastNameInput = screen.getByLabelText('Last Name');

    fireEvent.change(lastNameInput, { target: { value: value}});
    
    expect(lastNameInput.value).toBe(value);

    if (expectedErrorMessages === 1) {
        const errorMessage = await screen.findByText("Last Name should not include numbers");
        expect(errorMessage).toBeTruthy();
    } else {
        const errorMessage = screen.queryByText("Last Name should not include numbers`");
        expect(errorMessage).toBeNull();
    }
});

test.each`
    scenario                        | field              | errorMessage                                            | invalidValue           | fixedValue
    ${"remove invalid email"}       | ${'Email Address'} | ${"Email Address must be in example@gmail.com format."} | ${"igetspammed1234"}   | ${"igetspammed1234@gmail.com"}
    ${"remove first name has #"}    | ${'First Name'}    | ${"First Name should not include numbers"}              | ${"0"}                 | ${"Bob"}
    ${"remove last name has #"}     | ${'Last Name'}     | ${"Last Name should not include numbers"}               | ${"1"}                 | ${"Smith"}
    ${"empty email to fix invalid"} | ${'Email Address'} | ${"Email Address must be in example@gmail.com format."} | ${"igetspammed1234"}   | ${""}
    ${"empty first name to fix #"}  | ${'First Name'}    | ${"First Name should not include numbers"}              | ${"0"}                 | ${""}
    ${"empty last name to fix #"}   | ${'Last Name'}     | ${"Last Name should not include numbers"}               | ${"1"}                 | ${""}
`('should $scenario error message after fixing', async ({field, invalidValue, errorMessage, fixedValue}) => {
    // insert invalid value for field
    render(<ContactForm />);

    const inputNode = screen.getByLabelText(field);
    
    fireEvent.change(inputNode, { target: { value: invalidValue}});

    // error message should appear 
    const beforeFixErrorMessage = await screen.findByText(errorMessage);
    expect(beforeFixErrorMessage).toBeTruthy();

    // fix e-mail
    fireEvent.change(inputNode, { target: { value: fixedValue}});

    // error message should disappear
    const afterFixErrorMessage = screen.queryByText(errorMessage);
    expect(afterFixErrorMessage).toBeNull();
});

test('validate form submit', () => {

});

test('handleSubmit', () => {

});

test('handleFormChange', () => {

});
