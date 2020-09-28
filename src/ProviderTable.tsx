import React, { ReactElement } from "react";

interface Contact {
  firstName: string;
  lastName: string;
  emailAddress: string;
  speciality: string;
  practiceName: string;
  /* eslint-disable */
  // to access fields by using [fieldName], this needs to accept
  // any type, which eslint will always warn about
  [key: string]: any;
  /* eslint-enable */
}

enum SortDirection {
  ascending = "ascending",
  descending = "descending",
}

interface ProviderTableState {
  contacts: Array<Contact>;
  sortBy: string;
  sortDirection: SortDirection;
  /* eslint-disable */
  // to access fields by using [fieldName], this needs to accept
  // any type, which eslint will always warn about
  [key: string]: any;
  /* eslint-enable */
}

class ProviderTable extends React.Component<unknown, ProviderTableState> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      contacts: [],
      sortBy: "lastName",
      sortDirection: SortDirection.ascending,
    };

    this.changeSortByFieldDropdown = this.changeSortByFieldDropdown.bind(this);
    this.setSortDirection = this.setSortDirection.bind(this);
  }

  componentDidMount(): void {
    /*fetch("https://my-json-server.typicode.com/pandahead33/provider-fake-db", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Origin: "*",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        this.setState({
          contacts: result,
        });
      });*/
    this.setState({
      contacts: [
        {
          firstName: "Johnny",
          lastName: "Tiff",
          emailAddress: "johnnyt@gmail.com",
          speciality: "Dentistry",
          practiceName: "Fresh Smile Central",
        },
        {
          firstName: "Grant",
          lastName: "Donecar",
          emailAddress: "johnnyt@yahoo.com",
          speciality: "Dentistry",
          practiceName: "Cleveland Central Hospital",
        },
        {
          firstName: "Lady",
          lastName: "Crenshaw",
          emailAddress: "crent@trebuchet.com",
          speciality: "Other",
          practiceName: "Trebuchet Chiropractor",
        },
        {
          firstName: "Reginald",
          lastName: "Cakit",
          emailAddress: "kitty@cakit.com",
          speciality: "N/A",
          practiceName: "Ohio Department of Health",
        },
        {
          firstName: "Gabby",
          lastName: "Reado",
          emailAddress: "gabby@redo.com",
          speciality: "General Practice",
          practiceName: "Treble Clef Practice",
        },
        {
          firstName: "Kendrick",
          lastName: "Lamar",
          emailAddress: "treble@clef.com",
          speciality: "Somnologist",
          practiceName: "Sleepy Time Tea Shop",
        },
        {
          firstName: "Donald",
          lastName: "Knuth",
          emailAddress: "donald@coder.net",
          speciality: "Podiatry",
          practiceName: "Coding Medical Robots",
        },
      ],
    });
  }

  deleteRow(event: React.MouseEvent<HTMLButtonElement>, record: Contact): void {
    const contacts = this.state.contacts;

    if (contacts.includes(record)) {
      contacts.splice(contacts.indexOf(record), 1);
      this.setState({
        contacts: contacts,
      });
    }
  }

  setSortDirection(event: React.SyntheticEvent): void {
    const target = event.target as HTMLInputElement;
    const sortDirection =
      target.value === "ascending"
        ? SortDirection.ascending
        : SortDirection.descending;

    this.setState(
      {
        sortDirection: sortDirection,
      },
      this.sortByField
    );
  }

  changeSortByFieldDropdown(event: React.SyntheticEvent): void {
    const target = event.target as HTMLInputElement;

    this.setState(
      {
        sortBy: target.value,
      },
      this.sortByField
    );
  }

  sortByField(): void {
    const fieldName = this.state.sortBy;
    const providerContacts = this.state.contacts;
    const ascendingOrder = this.state.sortDirection === SortDirection.ascending;

    providerContacts.sort((a, b) => {
      if (a[fieldName] < b[fieldName]) {
        return ascendingOrder ? -1 : 1;
      } else if (a[fieldName] > b[fieldName]) {
        return ascendingOrder ? 1 : -1;
      }

      return 0;
    });

    this.setState({
      contacts: providerContacts,
    });
  }

  render(): ReactElement {
    const cells: Array<ReactElement> = [];

    const data = this.state.contacts;

    data.forEach((record) => {
      const recordValues = Object.values(record);

      for (let i = 0; i < recordValues.length; i++) {
        cells.push(
          <div key={JSON.stringify(record) + " " + i} className="cell">
            <p>{recordValues[i]}</p>
          </div>
        );
      }

      cells.push(
        <div key={JSON.stringify(record) + " delete"} className="cell">
          <button
            className="deleteButton"
            onClick={(event) => this.deleteRow(event, record)}
          >
            ❌ Delete
          </button>
        </div>
      );
    });

    let providerDataTable = <p>No providers found.</p>;

    if (data.length > 0) {
      providerDataTable = (
        <div style={{ height: "0" }}>
          <div className="providerTable">
            <div className="table-header">First Name</div>
            <div className="table-header">Last Name</div>
            <div className="table-header">Email Address</div>
            <div className="table-header">Speciality</div>
            <div className="table-header">Practice Name</div>
            <div className="table-header">Action</div>
          </div>
          <div className="searchResultsContainer">{cells}</div>
        </div>
      );
    }

    return (
      <div>
        <div className="searchContainer">
          <h1>Provider List</h1>
          <div className="searchBarContainer">
            <input className="search" type="search" />
            <input type="button" value="Search" />
            <label htmlFor="sortBy">
              <div className="sortByLabel">Sort By</div>
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
            <div className="sortDirection">
              <div>
                <input
                  type="radio"
                  name="sortDirection"
                  id="ascending"
                  value="ascending"
                  onChange={this.setSortDirection}
                  checked={this.state.sortDirection === SortDirection.ascending}
                />
                <label htmlFor="ascending">Ascending</label>
              </div>
              <div>
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
                <label htmlFor="ascending">Descending</label>
              </div>
            </div>
          </div>
        </div>
        {providerDataTable}
      </div>
    );
  }
}

export default ProviderTable;
