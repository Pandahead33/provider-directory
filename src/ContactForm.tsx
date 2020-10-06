import React, { useState, ReactElement, useEffect } from "react";
import { Contact } from "./Contact";
import Fields from "./Fields";
import Action from "./Action";
import { v4 as uuidv4 } from "uuid";

interface FormProps {
  type: Action;
  actOnProvider: (record: Contact) => void;
  closeForm: () => void;
  initialData: Contact | null | undefined;
}

export default function ContactForm(props: FormProps): ReactElement {
  const firstName = useFormInput("");
  const lastName = useFormInput("");
  const emailAddress = useFormInput("");
  const speciality = useFormInput("N/A");
  const practiceName = useFormInput("");
  const [errorMessages, setErrorMessages] = useState(new Map());

  useEffect(() => {
    firstName.set(props.initialData?.firstName || "");
    lastName.set(props.initialData?.lastName || "");
    emailAddress.set(props.initialData?.emailAddress || "");
    speciality.set(props.initialData?.speciality || "N/A");
    practiceName.set(props.initialData?.practiceName || "");
  }, [props.initialData]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    const fieldValues = new Map([
      [Fields.FIRST_NAME, firstName.value],
      [Fields.LAST_NAME, lastName.value],
      [Fields.EMAIL_ADDRESS, emailAddress.value],
    ]);

    const errorMap = validateFormSubmission(fieldValues);

    if (!target.checkValidity() || errorMap.size > 0) {
      setErrorMessages(errorMap);
      return;
    }

    props.actOnProvider({
      id: props.type === Action.edit ? props.initialData?.id || "" : uuidv4(),
      firstName: firstName.value,
      lastName: lastName.value,
      emailAddress: emailAddress.value,
      speciality: speciality.value,
      practiceName: practiceName.value,
    });

    resetForm();
  };

  const validateFormSubmission = (
    fieldValues: Map<Fields, string>
  ): Map<string, string> => {
    const errorMap: Map<string, string> = new Map(errorMessages);
    const capitalizeFieldName = (fieldName: string) =>
      fieldName.charAt(0).toUpperCase() +
      fieldName.slice(1).replace(/([A-Z])/g, " $1");
    const isValidEmail = (emailValue: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

    if (!isValidEmail(emailAddress.value)) {
      errorMap.set(
        Fields.EMAIL_ADDRESS,
        `${capitalizeFieldName(
          Fields.EMAIL_ADDRESS
        )} must be in example@gmail.com format.`
      );
    }

    // check if fields are empty
    fieldValues.forEach((fieldValue, fieldName) => {
      if (!fieldValue) {
        errorMap.set(
          fieldName,
          `${capitalizeFieldName(fieldName)} cannot be empty`
        );
      }
    });

    return errorMap;
  };

  const resetForm = (): void => {
    firstName.set("");
    lastName.set("");
    emailAddress.set("");
    speciality.set("N/A");
    practiceName.set("");
    setErrorMessages(new Map());
  };

  const displayedErrorMessages: Array<ReactElement> = [];

  for (const [fieldName, errorMessage] of new Map(errorMessages).entries()) {
    displayedErrorMessages.push(<li key={fieldName}>{errorMessage}</li>);
  }

  return (
    <div className="form">
      <h1>{props.type === Action.add ? "Add Provider" : "Edit Provider"}</h1>
      <div className="error-messages">
        <ul>{displayedErrorMessages}</ul>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="firstName">
          <div className="required-field">First Name</div>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={firstName.value || ""}
            onChange={(event) =>
              firstName.onChange(event, errorMessages, setErrorMessages)
            }
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
            value={lastName.value || ""}
            onChange={(event) =>
              lastName.onChange(event, errorMessages, setErrorMessages)
            }
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
            value={emailAddress.value || ""}
            onChange={(event) =>
              emailAddress.onChange(event, errorMessages, setErrorMessages)
            }
            placeholder="you@email.com"
            size={55}
            required
          />
        </label>
        <label htmlFor="speciality">
          <div>Speciality</div>
          <select
            id="speciality"
            name="speciality"
            value={speciality.value}
            onChange={(event) =>
              speciality.onChange(event, new Map(), setErrorMessages)
            }
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
            value={practiceName.value || ""}
            onChange={(event) => {
              practiceName.onChange(event, new Map(), setErrorMessages);
            }}
            placeholder="Memorial Family Practice"
            size={55}
          />
        </label>
        <div className="button-container">
          <input
            type="submit"
            value={
              props.type === Action.add ? "➕ Add Provider" : "Edit Provider"
            }
          />
          <input
            className="reset-button"
            type="button"
            value="Reset"
            onClick={resetForm}
          />
          <input
            className="cancel-button"
            type="button"
            value="Cancel"
            onClick={props.closeForm}
          />
        </div>
      </form>
    </div>
  );
}

function useFormInput(initialValue: string) {
  const [value, setValue] = useState(initialValue);

  function handleChange(
    event: React.SyntheticEvent,
    errorMessages: Map<string, string>,
    setErrorMessages: (fieldValue: Map<string, string>) => void | undefined
  ) {
    const target = event.target as HTMLInputElement;
    setValue(target.value);

    switch (target.name) {
      case Fields.FIRST_NAME:
      case Fields.LAST_NAME:
        setErrorMessages(
          validateNameChange(target.name, target.value, errorMessages)
        );
        break;
      case Fields.EMAIL_ADDRESS:
        setErrorMessages(validateEmailChange(target.value, errorMessages));
        break;
      default:
        break;
    }
  }

  return {
    value,
    onChange: handleChange,
    set: setValue,
  };
}

function isValidName(fieldType: Fields, name: string): boolean {
  const containsNumber = (string: string) => /\d/.test(string);
  return !containsNumber(name);
}

function validateNameChange(
  name: Fields,
  value: string,
  errorMessages: Map<string, string>
) {
  const errorMap = new Map(errorMessages);
  if (!isValidName(name, value)) {
    errorMap.set(
      name.toString(),
      `${capitalizeFieldName(name)} should not include numbers`
    );
  } else if (errorMap.has(name.toString())) {
    errorMap.delete(name.toString());
  }

  return errorMap;
}

function isValidEmail(emailAddress: string) {
  const isValidFormat = (emailValue: string) =>
    /^((([!#$%&'*+\-/=?^_`{|}~\w])|([!#$%&'*+\-/=?^_`{|}~\w][!#$%&'*+\-/=?^_`{|}~\.\w]{0,}[!#$%&'*+\-/=?^_`{|}~\w]))[@]\w+([-.]\w+)*\.\w+([-.]\w+)*)$/.test(
      emailValue
    );

  return emailAddress.length === 0 || isValidFormat(emailAddress);
}

function validateEmailChange(email: string, errorMap: Map<string, string>) {
  const fieldType = Fields.EMAIL_ADDRESS.toString();

  if (!isValidEmail(email)) {
    errorMap.set(
      Fields.EMAIL_ADDRESS.toString(),
      `${capitalizeFieldName(
        Fields.EMAIL_ADDRESS
      )} must be in example@gmail.com format.`
    );
  } else if (errorMap.has(fieldType)) {
    errorMap.delete(fieldType);
  }

  return errorMap;
}

function capitalizeFieldName(string: string): string {
  return (
    string.charAt(0).toUpperCase() + string.slice(1).replace(/([A-Z])/g, " $1")
  );
}
