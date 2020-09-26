import React, { ReactElement } from "react";

interface FormState {
  firstNameValue: string;
  lastNameValue: string;
  emailAddressValue: string;
  [key: string]: any
}

class Form extends React.Component<unknown, FormState> {
  constructor() {
    super({});
    this.state = {
      firstNameValue: "Bob",
      lastNameValue: "Smith",
      emailAddressValue: "test@gmail.com"
    };

    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFormChange(event: React.SyntheticEvent): void {
    const target = event.target as HTMLInputElement;
    const name = target.name;

    this.setState({
        [name]: target.value,
    });
  }

  handleSubmit(event: React.SyntheticEvent): void {
    event.preventDefault();
    alert(`Hello, ${this.state.firstName} ${this.state.lastName}! Expect an email at ${this.state.emailAddress}`);
  }

  render(): ReactElement {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="error-message"></div>
        <label htmlFor="firstName">
          <div className="required-field">First Name</div>
          <input
            type="text"
            id="firstName"
            name="firstNameValue"
            value={this.state.firstNameValue}
            onChange={this.handleFormChange}
            required
          />
        </label>
        <label htmlFor="lastName">
            <div className="required-field">Last Name</div>
            <input
                type="text"
                id="lastName"
                name="lastNameValue"
                value={this.state.lastNameValue}
                onChange={this.handleFormChange}
                required
            />
        </label>
        <label htmlFor="emailAddress">
            <div className="required-field">Email Address</div>
            <input
                type="email"
                id="emailAddress"
                name="emailAddressValue"
                value={this.state.emailAddressValue}
                onChange={this.handleFormChange}
                required
            />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default Form;
