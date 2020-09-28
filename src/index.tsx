import React from "react";
import ReactDOM from "react-dom";
import AddContactForm from "./AddContactForm";
import ProviderTable from "./ProviderTable";
import "./index.css";

// ========================================

ReactDOM.render(
  <main>
    <div className="params">
      <ProviderTable />
    </div>
    <div className="results">
      <h1>Action History</h1>
    </div>
    <div className="form">
      <h1>Add Provider</h1>
      <AddContactForm />
    </div>
  </main>,
  document.getElementById("root")
);
