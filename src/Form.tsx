import React, { ReactElement } from "react";

interface FormState {
  firstNameValue: string;
  lastNameValue: string;
}

class Form extends React.Component<unknown, FormState> {
  constructor() {
    super({});
    this.state = {
      firstNameValue: "Bob",
      lastNameValue: "Smith"
    };

    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFirstNameChange(event: React.SyntheticEvent): void {
    const target = event.target as HTMLInputElement;

    this.setState({
      firstNameValue: target.value,
    });
  }

  handleLastNameChange(event: React.SyntheticEvent): void {
    const target = event.target as HTMLInputElement;

    this.setState({
        lastNameValue: target.value,
    });
  }

  handleSubmit(event: React.SyntheticEvent): void {
    event.preventDefault();
    let json = {
        firstName: this.state.firstNameValue,
        lastName: this.state.lastNameValue
    }
    alert(`Hello, ${json.firstName} ${json.lastName}!`);
  }

  render(): ReactElement {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="firstName">
          First Name:
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={this.state.firstNameValue}
            onChange={this.handleFirstNameChange}
            required
          />
        </label>
        <label htmlFor="lastName">
            Last Name:
            <input
                type="text"
                id="lastName"
                name="lastName"
                value={this.state.lastNameValue}
                onChange={this.handleLastNameChange}
                required
            />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default Form;
