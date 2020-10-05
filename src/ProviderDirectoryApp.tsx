import React, { ReactElement } from "react";
import ContactForm from "./ContactForm";
import ProviderList from "./ProviderList";
import { Contact } from "./Contact";
import Action from "./Action";
import { type } from "os";

interface History {
  index: number;
  action: Action;
  contacts: Array<Contact>;
  deletedRecord: Contact | null | undefined;
}

interface ProviderDirectoryAppState {
  history: Array<History>;
  stepNumber: number;
  providerFormAction: Action;
  editRecord: Contact | null | undefined;
  showContactForm: boolean;
  showActionSuccessMessage: boolean;
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
              id: "1",
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
      providerFormAction: Action.add,
      editRecord: null,
      showContactForm: window.innerWidth > 1226,
      showActionSuccessMessage: false,
    };

    this.addRow = this.addRow.bind(this);
    this.editRow = this.editRow.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.openFormPanel = this.openFormPanel.bind(this);
    this.closeFormPanel = this.closeFormPanel.bind(this);
    this.resetHistory = this.resetHistory.bind(this);
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
      id: record.id,
      firstName: record.firstName,
      lastName: record.lastName,
      emailAddress: record.emailAddress,
      speciality: record.speciality || "",
      practiceName: record.practiceName || "",
    });

    history.push({
      index: history.length - 1,
      action: Action.add,
      contacts: contacts,
      deletedRecord: undefined,
    });

    this.setState(
      {
        history: history,
        stepNumber: nextStep,
      },
      () => {
        this.updateLocalStorage();
        this.closeFormPanel();
        this.displayActionSuccessMessage();
      }
    );
  }

  deleteRow(id: string): void {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const contacts = [...history[history.length - 1].contacts];
    const nextStep = this.state.stepNumber + 1;

    const relevantRecordIndex = contacts.findIndex(
      (element) => element.id === id
    );
    const deletedContact = Object.assign({}, contacts[relevantRecordIndex]);
    contacts.splice(relevantRecordIndex, 1);

    if (deletedContact) {
      this.setState(
        {
          history: history.concat({
            index: nextStep,
            action: Action.delete,
            contacts: contacts,
            deletedRecord: deletedContact,
          }),
          stepNumber: nextStep,
        },
        () => {
          this.updateLocalStorage();
          this.displayActionSuccessMessage();
        }
      );
    }
  }

  editRow(record: Contact): void {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const contacts = [...history[history.length - 1].contacts];
    const nextStep = this.state.stepNumber + 1;

    const relevantRecordIndex = contacts.findIndex(
      (element) => element.id === record.id
    );
    const oldContact = Object.assign({}, contacts[relevantRecordIndex]);

    contacts[relevantRecordIndex] = {
      id: contacts[relevantRecordIndex].id,
      firstName: record.firstName,
      lastName: record.lastName,
      emailAddress: record.emailAddress,
      speciality: record.speciality || "",
      practiceName: record.practiceName || "",
    };

    history.push({
      index: nextStep,
      action: Action.edit,
      contacts: contacts,
      deletedRecord: oldContact,
    });

    this.setState(
      {
        history: history,
        stepNumber: nextStep,
        providerFormAction: Action.add,
        editRecord: null,
      },
      () => {
        this.updateLocalStorage();
        this.closeFormPanel();
        this.displayActionSuccessMessage();
      }
    );
  }

  cancelEdit(): void {
    this.setState({
      providerFormAction: Action.add,
    });
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
    const confirmationMessage = "Delete all providers and history? This can't be undone.";
    if (window.confirm(confirmationMessage)) {
      this.setState(
        {
          history: [
            {
              index: 0,
              action: Action.reset,
              deletedRecord: undefined,
              contacts: [],
            },
          ],
          stepNumber: 0,
          providerFormAction: Action.add,
          editRecord: null,
        },
        this.updateLocalStorage
      );
    }
  }

  displayActionSuccessMessage(): void {
    const messageDurationInMilliseconds = 2000;

    this.setState({
      showActionSuccessMessage: true,
    })

    setTimeout(() => {
      this.setState({
        showActionSuccessMessage: false,
      })
    }, messageDurationInMilliseconds)
  }

  generateActionHistoryList(
    history: Array<History>
  ): Array<JSX.Element | undefined> {
    const historyList = history.map((historyOperation) => {
      const actionMessage =
        historyOperation.action === Action.add
          ? "Added"
          : historyOperation.action === Action.edit
          ? "Edited"
          : historyOperation.action === Action.delete ? "Deleted" : "Reset";
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

  openFormPanel(actionType: Action, record: Contact | null): void {
    this.setState({
      providerFormAction: actionType,
      editRecord: record,
      showContactForm: true,
    });
  }

  closeFormPanel(): void {
    this.setState({
      providerFormAction: Action.add,
      editRecord: null,
      showContactForm: false,
    });
  }

  render(): ReactElement {
    const history: Array<History> = [...this.state.history];
    const current = history[this.state.stepNumber];
    const historyList = this.generateActionHistoryList(history);
    const action = this.state.providerFormAction;

    return (
      <main>
        {this.state.showContactForm ? 
        <ContactForm
          type={action}
          actOnProvider={action === Action.add ? this.addRow : this.editRow}
          initialData={this.state.editRecord || undefined}
          closeForm={this.closeFormPanel}
        /> : null}
        {this.state.showActionSuccessMessage ? <div className="success-message">Contact successfully {(current.action === Action.add.toString()) ? "added!" : (current.action === Action.edit.toString()) ? "edited!" : "deleted!"}</div> : null}
        <ProviderList
          contacts={current.contacts || []}
          deleteProvider={this.deleteRow}
          openFormPanel={this.openFormPanel}
          resetProviderList={this.resetHistory}
        />
        <div className="action-history">
          <h1>Action History</h1>
          <ol>{historyList}</ol>
        </div>
      </main>
    );
  }
}

export default ProviderDirectoryApp;
