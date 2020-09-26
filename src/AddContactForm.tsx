import React, { ReactElement } from "react";

interface FormState {
  firstName: string;
  lastName: string;
  emailAddress: string;
  errorMessages: Map<string, string>;
  /* eslint-disable */
  // to access fields by using [fieldName], this needs to accept 
  // any type, which eslint will always warn about
  [key: string]: any;
  /* eslint-enable */
}

enum Fields {
  FIRST_NAME = "firstName",
  LAST_NAME = "lastName",
  EMAIL_ADDRESS = "emailAddress",
}

class Form extends React.Component<unknown, FormState> {
  constructor() {
    super({});
    this.state = {
      firstName: "",
      lastName: "",
      emailAddress: "",
      errorMessages: new Map(),
    };

    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFormChange(event: React.SyntheticEvent): void {
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const errorMessages = new Map(this.state.errorMessages);

    function validateFormInput() {
      const isNameField = () =>
        [Fields.FIRST_NAME.toString(), Fields.LAST_NAME.toString()].includes(
          name
        );
      const hasNumber = (string: string) => /\d/.test(string);
      const hasPreviouslyHadError = () => !!errorMessages.get(name);
      const capitalizeFieldName = (string: string) =>
        string.charAt(0).toUpperCase() +
        string.slice(1).replace(/([A-Z])/g, " $1");

      if (isNameField() && hasNumber(target.value)) {
        errorMessages.set(
          name,
          `${capitalizeFieldName(name)} should not include numbers`
        );
      } else if (hasPreviouslyHadError()) {
        // remove error message, since there it passed validation
        errorMessages.delete(name);
      }
    }

    validateFormInput();

    this.setState({
      [name]: target.value,
      errorMessages: errorMessages,
    });
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    const fieldValues = new Map([
      [Fields.FIRST_NAME, this.state.firstName],
      [Fields.LAST_NAME, this.state.lastName],
      [Fields.EMAIL_ADDRESS, this.state.emailAddress],
    ]);

    const errorMessages = new Map(this.state.errorMessages);

    function validateFormSubmission() {
      const capitalizeFieldName = (string: string) =>
        string.charAt(0).toUpperCase() +
        string.slice(1).replace(/([A-Z])/g, " $1");

      // check if fields are empty
      fieldValues.forEach((fieldValue, fieldName) => {
        if (!fieldValue) {
          errorMessages.set(
            fieldName,
            `${capitalizeFieldName(fieldName)} cannot be empty`
          );
        }
      });
    }

    validateFormSubmission();
    console.log(errorMessages);

    if (!target.checkValidity() || errorMessages.size > 0) {
      console.log("fail");
      this.setState({
        errorMessages: errorMessages,
      });
      return;
    }

    alert(
      `Hello, ${this.state.firstName} ${this.state.lastName}! Expect an email at ${this.state.emailAddress}`
    );
  }

  render(): ReactElement {
    const displayedErrorMessages = [];

    for (const [fieldName, errorMessage] of new Map(
      this.state.errorMessages
    ).entries()) {
      displayedErrorMessages.push(<li key={fieldName}>{errorMessage}</li>);
    }

    return (
      <form onSubmit={this.handleSubmit} noValidate>
        <div className="error-messages">
          <ul>{displayedErrorMessages}</ul>
        </div>
        <label htmlFor="firstName">
          <div className="required-field">First Name</div>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={this.state.firstName}
            onChange={this.handleFormChange}
            placeholder="Bob"
            required
          />
        </label>
        <label htmlFor="lastName">
          <div className="required-field">Last Name</div>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={this.state.lastName}
            onChange={this.handleFormChange}
            placeholder="Smith"
            required
          />
        </label>
        <label htmlFor="emailAddress">
          <div className="required-field">Email Address</div>
          <input
            type="email"
            id="emailAddress"
            name="emailAddress"
            value={this.state.emailAddress}
            onChange={this.handleFormChange}
            placeholder="test@email.com"
            size={55}
            required
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default Form;
