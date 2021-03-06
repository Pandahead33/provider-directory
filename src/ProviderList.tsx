import React, { ReactElement } from "react";
import { Contact } from "./Contact";
import Fields from "./Fields";
import Action from "./Action";

enum SortDirection {
  ascending = "ascending",
  descending = "descending",
}

interface ProviderListProps {
  contacts: Array<Contact>;
  deleteProvider: (id: string) => void;
  openFormPanel: (actionType: Action, record: Contact | null) => void;
  resetProviderList: () => void;
  resetAppToDefault: () => void;
}

interface ProviderListState {
  sortBy: string;
  sortDirection: SortDirection;
  /* eslint-disable */
  // to access fields by using [fieldName], this needs to accept
  // any type- which eslint intentionally warns about
  [key: string]: any;
  /* eslint-enable */
}

class ProviderList extends React.Component<
  ProviderListProps,
  ProviderListState
> {
  constructor(props: ProviderListProps) {
    super(props);
    this.state = {
      sortBy: "lastName",
      sortDirection: SortDirection.ascending,
      searchTerm: "",
    };

    this.changeSortByFieldDropdown = this.changeSortByFieldDropdown.bind(this);
    this.updateSearchTerm = this.updateSearchTerm.bind(this);
    this.searchProviderList = this.searchProviderList.bind(this);
    this.setSortDirection = this.setSortDirection.bind(this);
  }

  setSortDirection(event: React.SyntheticEvent): void {
    const target = event.target as HTMLInputElement;
    const sortDirection =
      target.value === "ascending"
        ? SortDirection.ascending
        : SortDirection.descending;

    this.setState({
      sortDirection: sortDirection,
    });
  }

  changeSortByFieldDropdown(event: React.SyntheticEvent): void {
    const target = event.target as HTMLInputElement;

    this.setState({
      sortBy: target.value,
    });
  }

  updateSearchTerm(event: React.SyntheticEvent): void {
    const target = event.target as HTMLInputElement;
    this.setState({
      searchTerm: target.value,
    });
  }

  searchProviderList(contacts: Array<Contact>): Array<Contact> {
    let searchResults = [...contacts];
    const fitsSearchCriteria = (contact: Contact) =>
      Object.values(contact).reduce(
        (fitsSearchAccumulator: boolean, field) =>
          field.toUpperCase().includes(this.state.searchTerm.toUpperCase()) ||
          fitsSearchAccumulator,
        false
      );

    searchResults = searchResults.reduce(
      (contacts: Array<Contact>, contact) => {
        if (fitsSearchCriteria(contact)) {
          contacts.push(contact);
        }
        return contacts;
      },
      []
    );

    return searchResults;
  }

  sortByField(contacts: Array<Contact>): Array<Contact> {
    const fieldName = this.state.sortBy;
    const providerContacts = [...contacts];

    const ascendingOrder = this.state.sortDirection === SortDirection.ascending;

    providerContacts.sort((a: Contact, b: Contact) => {
      if (a[fieldName] < b[fieldName]) {
        return ascendingOrder ? -1 : 1;
      } else if (a[fieldName] > b[fieldName]) {
        return ascendingOrder ? 1 : -1;
      }

      return 0;
    });

    return providerContacts;
  }

  render(): ReactElement {
    const cells: Array<ReactElement> = [];
    const data = this.sortByField(this.searchProviderList(this.props.contacts));

    data.forEach((record) => {
      const recordValues = Object.values(record);
      const recordKeys = Object.keys(record);

      for (let i = 1; i < recordValues.length; i++) {
        cells.push(
          <div key={JSON.stringify(record) + " " + i} className="cell">
            <p>
              {recordKeys[i] !== Fields.EMAIL_ADDRESS.toString() ? (
                recordValues[i]
              ) : (
                <a href={`mailto:${recordValues[i]}`}>{recordValues[i]}</a>
              )}
            </p>
          </div>
        );
      }

      cells.push(
        <div key={JSON.stringify(record) + " delete"} className="cell">
          <button
            className="action-button"
            onClick={() => this.props.openFormPanel(Action.edit, record)}
          >
            <span role="img" aria-label="edit-icon">
              🖊️
            </span>{" "}
            Edit
          </button>
          <button
            className="action-button"
            onClick={() => this.props.deleteProvider(record.id)}
          >
            <span role="img" aria-label="delete-icon">
              ❌
            </span>{" "}
            Delete
          </button>
        </div>
      );
    });

    let providerDataTable = <p>No providers found.</p>;

    if (data.length > 0) {
      providerDataTable = (
        <div style={{ height: "0" }}>
          <div className="provider-table-heading">
            <div className="table-header">
              <p>First Name</p>
            </div>
            <div className="table-header">
              <p>Last Name</p>
            </div>
            <div className="table-header">
              <p>Email Address</p>
            </div>
            <div className="table-header">
              <p>Speciality</p>
            </div>
            <div className="table-header">
              <p>Practice Name</p>
            </div>
            <div className="table-header">
              <p>Action</p>
            </div>
          </div>
          <div className="search-results-container">{cells}</div>
        </div>
      );
    }

    return (
      <div className="provider-list">
        <div className="search-container">
          <h1>Provider List</h1>
          <input
            className="provider-button"
            type="button"
            value="➕ Add New Provider"
            onClick={() => this.props.openFormPanel(Action.add, null)}
          />
          <input
            className="provider-button"
            type="button"
            value="☠️ Delete All Providers"
            onClick={this.props.resetProviderList}
          />
          <input
            className="provider-button"
            type="button"
            value="🔄 Reset to Default"
            onClick={this.props.resetAppToDefault}
          />
          <div className="search-bar-container">
            <input
              className="search"
              placeholder="Search..."
              onChange={this.updateSearchTerm}
              type="search"
            />
            <label htmlFor="sortBy">
              <div className="sort-by-label">Sort By</div>
              <select
                id="sortBy"
                name="sortBy"
                value={this.state.sortBy}
                onChange={this.changeSortByFieldDropdown}
              >
                <option value="firstName">First Name</option>
                <option value="lastName">Last Name</option>
                <option value="emailAddress">Email Address</option>
                <option value="speciality">Speciality</option>
                <option value="practiceName">Practice Name</option>
              </select>
            </label>
            <div className="sort-direction">
              <div>
                <label htmlFor="ascending">
                  <input
                    type="radio"
                    name="sortDirection"
                    id="ascending"
                    value="ascending"
                    onChange={this.setSortDirection}
                    checked={
                      this.state.sortDirection === SortDirection.ascending
                    }
                  />
                  Ascending
                </label>
              </div>
              <div>
                <label htmlFor="descending">
                  <input
                    type="radio"
                    name="sortDirection"
                    id="descending"
                    value="descending"
                    onChange={this.setSortDirection}
                    checked={
                      this.state.sortDirection === SortDirection.descending
                    }
                  />
                  Descending
                </label>
              </div>
            </div>
          </div>
        </div>
        <span className="results">{data.length} results</span>
        {providerDataTable}
      </div>
    );
  }
}

export default ProviderList;
