import React, { Component } from "react"
import {render, screen, fireEvent} from '@testing-library/react'
import { create } from "react-test-renderer";
import ProviderList from "../ProviderList";

const multipleValidContacts = [
    {
        id: "ecf54597-f668-48f0-af8f-1a654d80f5ec",
        firstName: "Sleepy",
        lastName: "Jimbo",
        emailAddress: "nick@nite.neutron",
        speciality: "Somnologist",
        practiceName: "Sleepy Hollows Clinic",
    },
    {
        id: "98e5eccc-1f6d-47f3-9882-e57cd93a73f9",
        firstName: "Adam",
        lastName: "Smith",
        emailAddress: "westward@expansion.com",
        speciality: "General Medicine",
        practiceName: "Capital Practitioners Primary Care",
    },
    {
        id: "7494e300-d378-4095-a362-dc452d3f8f27",
        firstName: "Zebra",
        lastName: "Elephantress",
        emailAddress: "safari@joe.tech",
        speciality: "Other",
        practiceName: "Safari Joe Veterinary Institute",
    },
    {
        id: "dbd8f84c-79ac-430f-8463-56057a53158a",
        firstName: "Dan",
        lastName: "Smith",
        emailAddress: "sam@last.name",
        speciality: "Podiatrist",
        practiceName: "Generic Foot Meds",
    },
];

test('render and matches snapshot', () => {
    expect(create(<ProviderList contacts={[]}/>).toJSON()).toMatchSnapshot();
});

test('should display "No providers found." message if zero contacts provider', () => {
    render(<ProviderList contacts={[]}/>);

    expect(screen.getByText("0 results").textContent).toBe("0 results");
    expect(screen.getByText("No providers found.").textContent).toBe("No providers found.");
});

test("should display all provided contacts", () => {
    render(<ProviderList contacts={multipleValidContacts}/>);
    expect(screen.getByText(`${multipleValidContacts.length} results`).textContent).toBe(`${multipleValidContacts.length} results`);
});

test("should sort list by any of fields in ascending order by lastName", () => {
    const {container} = render(<ProviderList contacts={multipleValidContacts}/>);
    const tableContent = container.firstChild.childNodes[2].childNodes[1].textContent;

    const descendingRadioButton = screen.getByLabelText('Descending');
    fireEvent.click(descendingRadioButton);
    
    expect(descendingRadioButton.value).toBe("descending");
    expect(descendingRadioButton.checked).toEqual(true);
    
    const ascendingRadioButton = screen.getByLabelText('Ascending');
    fireEvent.click(ascendingRadioButton);

    const firstContactIndex = tableContent.indexOf("Elephantress");
    const secondContactIndex = tableContent.indexOf("Jimbo");
    const thirdContactIndex = tableContent.indexOf("Smith");

    expect(firstContactIndex).toBeLessThan(secondContactIndex);
    expect(secondContactIndex).toBeLessThan(thirdContactIndex);
});

test("should sort list by any of fields in descending order", () => {
    const {container} = render(<ProviderList contacts={multipleValidContacts}/>);

    const descendingRadioButton = screen.getByLabelText('Descending');
    fireEvent.click(descendingRadioButton);
    
    expect(descendingRadioButton.value).toBe("descending");
    expect(descendingRadioButton.checked).toEqual(true);
    
    const tableContent = container.firstChild.childNodes[2].childNodes[1].textContent;

    const firstContactIndex = tableContent.indexOf("Elephantress");
    const secondContactIndex = tableContent.indexOf("Jimbo");
    const thirdContactIndex = tableContent.indexOf("Smith");

    expect(firstContactIndex).toBeGreaterThan(secondContactIndex);
    expect(secondContactIndex).toBeGreaterThan(thirdContactIndex);
});

test("keyword search should filter", () => {
    const {container} = render(<ProviderList contacts={multipleValidContacts}/>);

    const searchBar = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchBar, { target: { value: "westward"}});
    
    const tableContent = container.firstChild.childNodes[2].childNodes[1].textContent;
    
    const firstContactIndex = tableContent.indexOf("Elephantress");
    const secondContactIndex = tableContent.indexOf("Jimbo");
    const thirdContactIndex = tableContent.indexOf("Smith");
    
    expect(screen.getByText("1 results").textContent).toBe("1 results");
    // Zebra Elephantress should not be in the table
    expect(firstContactIndex).toBe(-1);
    // Sleepy Jimbo should not be in the table
    expect(secondContactIndex).toBe(-1);
    // Adam Smith should be in the table due to his email matching keyword "westward"
    expect(thirdContactIndex).toBeGreaterThan(-1);
});

test("sort by field change should update state", () => {
    render(<ProviderList contacts={multipleValidContacts}/>);
    const sortByDropDown = screen.getByDisplayValue('Last Name');
    expect(sortByDropDown.value).toBe("lastName");

    fireEvent.change(sortByDropDown, { target: { value: "practiceName"}});

    expect(sortByDropDown.value).toBe("practiceName");
})

test("check on clicks trigger prop functions", () => {
    const mockOpenFormPanel = jest.fn();
    const mockDeleteProvider = jest.fn();

    render(<ProviderList contacts={multipleValidContacts} 
        openFormPanel={mockOpenFormPanel}
        deleteProvider={mockDeleteProvider} />);

    fireEvent.click(screen.getAllByText("Edit",  {selector: 'button'})[0]);
    fireEvent.click(screen.getAllByText("Delete")[0]);
    fireEvent.click(screen.getByText("➕ Add New Provider"));

    expect(mockOpenFormPanel).toBeCalledTimes(2);
    expect(mockDeleteProvider).toBeCalledTimes(1);

});