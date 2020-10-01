import React, { ReactElement } from "react";
import { Contact } from "./Contact";

interface FormProps {
  addNewProvider: (record: Contact) => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  emailAddress: string;
  speciality: string;
  practiceName: string;
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
  SPECIALITY = "speciality",
  PRACTICE_NAME = "practiceName",
}

class AddContactForm extends React.Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      emailAddress: "",
      speciality: "N/A",
      practiceName: "",
      errorMessages: new Map(),
    };

    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  handleFormChange(event: React.SyntheticEvent): void {
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const errorMessages = new Map(this.state.errorMessages);

    const validateFormInput = () => {
      const isNameField = () =>
        [Fields.FIRST_NAME.toString(), Fields.LAST_NAME.toString()].includes(
          name
        );
      const hasNumber = (string: string) => /\d/.test(string);
      const hasPreviouslyHadError = () => !!errorMessages.get(name);
      const capitalizeFieldName = (string: string) =>
        string.charAt(0).toUpperCase() +
        string.slice(1).replace(/([A-Z])/g, " $1");
      const isValidEmail = (emailValue: string) =>
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/.test(
          emailValue
        );

      if (
        name === Fields.EMAIL_ADDRESS.toString() &&
        !isValidEmail(target.value)
      ) {
        errorMessages.set(
          Fields.EMAIL_ADDRESS,
          `${capitalizeFieldName(
            Fields.EMAIL_ADDRESS
          )} must be in example@gmail.com format.`
        );
      }

      if (isNameField() && hasNumber(target.value)) {
        errorMessages.set(
          name,
          `${capitalizeFieldName(name)} should not include numbers`
        );
      } else if (hasPreviouslyHadError()) {
        // remove error message, since there it passed validation
        errorMessages.delete(name);
      }
    };

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

    const validateFormSubmission = () => {
      const capitalizeFieldName = (fieldName: string) =>
        fieldName.charAt(0).toUpperCase() +
        fieldName.slice(1).replace(/([A-Z])/g, " $1");
      const isValidEmail = (emailValue: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

      if (!isValidEmail(this.state.emailAddress)) {
        errorMessages.set(
          Fields.EMAIL_ADDRESS,
          `${capitalizeFieldName(
            Fields.EMAIL_ADDRESS
          )} must be in example@gmail.com format.`
        );
      }

      // check if fields are empty
      fieldValues.forEach((fieldValue, fieldName) => {
        if (!fieldValue) {
          errorMessages.set(
            fieldName,
            `${capitalizeFieldName(fieldName)} cannot be empty`
          );
        }
      });
    };

    validateFormSubmission();

    if (!target.checkValidity() || errorMessages.size > 0) {
      this.setState({
        errorMessages: errorMessages,
      });
      return;
    }

    this.props.addNewProvider(this.state);
  }

  resetForm(): void {
    this.setState({
      firstName: "",
      lastName: "",
      emailAddress: "",
      speciality: "N/A",
      practiceName: "",
      errorMessages: new Map(),
    });
  }

  render(): ReactElement {
    const displayedErrorMessages = [];

    for (const [fieldName, errorMessage] of new Map(
      this.state.errorMessages
    ).entries()) {
      displayedErrorMessages.push(<li key={fieldName}>{errorMessage}</li>);
    }

    return (
      <div className="form">
        <h1>Add Provider</h1>
        <div className="error-messages">
          <ul>{displayedErrorMessages}</ul>
        </div>
        <form onSubmit={this.handleSubmit} noValidate>
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
          <label htmlFor="speciality">
            <div>Speciality</div>
            <select
              id="speciality"
              name="speciality"
              value={this.state.speciality}
              onChange={this.handleFormChange}
            >
              <option value="N/A">N/A</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Podiatry">Podiatry</option>
              <option value="Surgery">Surgery</option>
              <option value="Somnologist">Somnologist</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label htmlFor="practiceName">
            <div>Practice Name</div>
            <input
              type="text"
              id="practiceName"
              name="practiceName"
              value={this.state.practiceName}
              onChange={this.handleFormChange}
              placeholder="Memorial Family Practice"
              size={55}
            />
          </label>
          <div className="button-container">
            <input type="submit" value="➕ Add Provider" />
            <input type="button" value="Reset" onClick={this.resetForm} />
          </div>
        </form>
      </div>
    );
  }
}

export default AddContactForm;
