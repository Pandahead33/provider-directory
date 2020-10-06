import React from "react"
import {render, screen, fireEvent} from '@testing-library/react'
import { create } from "react-test-renderer";

import ProviderDirectoryApp from "../ProviderDirectoryApp";

window.scrollTo = jest.fn()

test('render and matches snapshot', () => {
    expect(create(<ProviderDirectoryApp />).toJSON()).toMatchSnapshot();
});

test('add action should prepend to list on submit', () => {
    const {container} = render(<ProviderDirectoryApp />);

    fireEvent.click(screen.getByText("➕ Add New Provider"));

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const emailAddressInput = screen.getByLabelText('Email Address');

    fireEvent.change(firstNameInput, { target: { value: "David"}});
    fireEvent.change(lastNameInput, { target: { value: "Hasselhoff"}});
    fireEvent.change(emailAddressInput, { target: { value: "the@dave.co"}});

    fireEvent.click(screen.getByText('➕ Add Provider'))

    expect(screen.getAllByText("Hasselhoff").length).toBeGreaterThan(0);
});