import React, { ReactElement } from "react";
import AddContactForm from "./AddContactForm";
import ProviderList from "./ProviderList";
import { Contact } from "./Contact";

interface History {
  index: number;
  action: Action;
  contacts: Array<Contact>;
  deletedRecord: Contact | null | undefined;
}

enum Action {
  add = "add",
  delete = "delete",
}

interface ProviderDirectoryAppState {
  history: Array<History>;
  stepNumber: number;
}

class ProviderDirectoryApp extends React.Component<
  unknown,
  ProviderDirectoryAppState
> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      history: [
        {
          index: 0,
          action: Action.add,
          deletedRecord: undefined,
          contacts: [
            {
              firstName: "Bob",
              lastName: "Smith",
              emailAddress: "bob@smith.com",
              speciality: "General Medicine",
              practiceName: "Practice Name",
            },
          ],
        },
      ],
      stepNumber: 0,
    };

    this.addRow = this.addRow.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
  }

  componentDidMount(): void {
    const savedHistory = localStorage.getItem("history");
    const savedStepNumber = localStorage.getItem("stepNumber");
    if (savedHistory && savedStepNumber) {
      this.setState({
        history: JSON.parse(savedHistory),
        stepNumber: Number(savedStepNumber),
      });
    }
  }

  addRow(record: Contact): void {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const contacts = [...history[history.length - 1].contacts];
    const nextStep = this.state.stepNumber + 1;

    contacts.push({
      firstName: record.firstName,
      lastName: record.lastName,
      emailAddress: record.emailAddress,
      speciality: record.speciality || "",
      practiceName: record.practiceName || "",
    });

    history.push({
      index: nextStep,
      action: Action.add,
      contacts: contacts,
      deletedRecord: undefined,
    });

    this.setState(
      {
        history: history,
        stepNumber: nextStep,
      },
      this.updateLocalStorage
    );
  }

  deleteRow(record: Contact): void {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const contacts = [...history[history.length - 1].contacts];
    const nextStep = this.state.stepNumber + 1;

    if (contacts.includes(record)) {
      contacts.splice(contacts.indexOf(record), 1);

      this.setState(
        {
          history: history.concat({
            index: nextStep,
            action: Action.delete,
            contacts: contacts,
            deletedRecord: record,
          }),
          stepNumber: nextStep,
        },
        this.updateLocalStorage
      );
    }
  }

  updateLocalStorage(): void {
    localStorage.setItem("history", JSON.stringify(this.state.history));
    localStorage.setItem("stepNumber", this.state.stepNumber.toString());
  }

  jumpTo(step: number): void {
    this.setState(
      {
        stepNumber: step,
      },
      this.updateLocalStorage
    );
  }

  resetHistory(): void {
    this.setState(
      {
        history: [],
        stepNumber: 0,
      },
      this.updateLocalStorage
    );
  }

  generateActionHistoryList(
    history: Array<History>
  ): Array<JSX.Element | undefined> {
    const historyList = history.map((historyOperation) => {
      const actionMessage =
        historyOperation.action === Action.add ? "Added" : "Deleted";
      const contact =
        historyOperation.contacts[historyOperation.index] ||
        historyOperation.deletedRecord;

      if (!contact) {
        return;
      }

      const speciality = contact.speciality ? `(${contact.speciality})` : "";
      const practiceName = contact.practiceName
        ? `from ${contact.practiceName} `
        : "";
      const emailAddress = `mailto:${contact.emailAddress}`;
      const isCurrentHistory = historyOperation.index === this.state.stepNumber;
      const isPastHistory = historyOperation.index < this.state.stepNumber;
      let revertHistoryButton = (
        <span className="undo-button">
          <b>Current history</b>
        </span>
      );

      if (!isCurrentHistory) {
        revertHistoryButton = (
          <button
            className="undo-button"
            onClick={() => this.jumpTo(historyOperation.index)}
          >
            {isPastHistory
              ? "Rewind history to this point"
              : "Fast forward history to this point"}
          </button>
        );
      }

      return (
        <li key={historyOperation.index}>
          <span>
            {actionMessage}{" "}
            <a href={emailAddress}>
              {contact.firstName} {contact.lastName}
            </a>{" "}
            {practiceName} {speciality}
          </span>
          {revertHistoryButton}
        </li>
      );
    });

    return historyList.reverse();
  }

  render(): ReactElement {
    const history: Array<History> = [...this.state.history];
    const current = history[this.state.stepNumber];
    const historyList = this.generateActionHistoryList(history);

    return (
      <main>
        <ProviderList
          contacts={current.contacts}
          deleteProvider={this.deleteRow}
        />
        <div className="action-history">
          <h1>Action History</h1>
          <ol>{historyList}</ol>
        </div>
        <AddContactForm addNewProvider={this.addRow} />
      </main>
    );
  }
}

export default ProviderDirectoryApp;
