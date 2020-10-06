import React, { ReactElement } from "react";
import ContactForm from "./ContactForm";
import ProviderList from "./ProviderList";
import { Contact } from "./Contact";
import Action from "./Action";

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
  initialState: ProviderDirectoryAppState = {
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
        ],
      },
    ],
    stepNumber: 0,
    providerFormAction: Action.add,
    editRecord: null,
    showContactForm: false,
    showActionSuccessMessage: false,
  };

  constructor(props: unknown) {
    super(props);
    this.state = this.initialState;

    this.addRow = this.addRow.bind(this);
    this.editRow = this.editRow.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.openFormPanel = this.openFormPanel.bind(this);
    this.closeFormPanel = this.closeFormPanel.bind(this);
    this.resetHistory = this.resetHistory.bind(this);
    this.resetAppToDefault = this.resetAppToDefault.bind(this);
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
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
      index: contacts.length - 1,
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
            index: -1,
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
      index: -1,
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
    const confirmationMessage =
      "Delete all providers and history? This can't be undone.";
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

  resetAppToDefault(): void {
    const confirmationMessage = "Reset to initial state? This can't be undone.";
    if (window.confirm(confirmationMessage)) {
      localStorage.clear();
      this.setState(this.initialState);
    }
  }

  displayActionSuccessMessage(): void {
    const messageDurationInMilliseconds = 2000;

    this.setState({
      showActionSuccessMessage: true,
    });

    setTimeout(() => {
      this.setState({
        showActionSuccessMessage: false,
      });
    }, messageDurationInMilliseconds);
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
          : historyOperation.action === Action.delete
          ? "Deleted"
          : "Reset";
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
        <li key={contact.id + historyOperation.index + this.state.stepNumber}>
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
    this.setState(
      {
        providerFormAction: actionType,
        editRecord: record,
        showContactForm: true,
      },
      this.scrollToTop
    );
  }

  closeFormPanel(): void {
    this.setState({
      providerFormAction: Action.add,
      editRecord: null,
      showContactForm: false,
    });
  }

  determineSuccessActionMessage(action: Action): ReactElement | null {
    if (!this.state.showActionSuccessMessage) {
      return null;
    }

    const actionMessages: (action: Action) => string = (action: Action) =>
      ({
        add: "added",
        edit: "edited",
        delete: "deleted",
        reset: "reset",
      }[action] || action.toString());

    return (
      <div className="success-message">
        {`Contact successfully ${actionMessages(action)}!`}
      </div>
    );
  }

  render(): ReactElement {
    const history: Array<History> = [...this.state.history];
    const current = history[this.state.stepNumber];
    const historyList = this.generateActionHistoryList(history);
    const action = this.state.providerFormAction;

    return (
      <main>
        {this.state.showContactForm ? (
          <ContactForm
            type={action}
            actOnProvider={action === Action.add ? this.addRow : this.editRow}
            initialData={this.state.editRecord || undefined}
            closeForm={this.closeFormPanel}
          />
        ) : null}
        {current ? this.determineSuccessActionMessage(current.action) : null}
        <ProviderList
          contacts={current.contacts || []}
          deleteProvider={this.deleteRow}
          openFormPanel={this.openFormPanel}
          resetProviderList={this.resetHistory}
          resetAppToDefault={this.resetAppToDefault}
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
