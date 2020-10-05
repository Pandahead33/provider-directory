# Provider Contact Directory

Provider Contact Directory is a React app programmed in Typescript for managing medical provider contacts. The project was initialized with [Create React App](https://create-react-app.dev/).

## Table of Contents
- [Included Features](#included-features)
- [Extras](#extras)
- [Installation](#installation)
  * [Prerequisites](#prerequisites)
  * [Cloning the Repository](#cloning-the-repository)
  * [Project Setup](#project-setup)
    + [Testing](#testing)
- [Project Structure](#project-structure)
- [Future Additions](#future-additions)
- [Building a Production Release](#building-a-production-release)
- [Contributing](#contributing)

## Included Features
- Ability to add, edit, remove a contact.
- Sort and filter by any field
- Search (basic keyword on any field)
- Rewind/fast forward operations with Action History

## Extras 
- Written in Typescript 
- localStorage data persistence (option A)
- Desktop-first responsive design
- Testing-Library unit tests
- Example class converted from classic React classes to React Hooks (ContactForm)
- Additional helper buttons such as Delete All Providers, Reset Form, etc. 
- Included [prettier](https://prettier.io/) and [eslint](https://eslint.org/docs/rules/). 

## Installation

The first step is to get everything running!

### Prerequisites
Install node/npm and git.

The node/npm versions used were:

```
node v12.18.2
npm 6.14.5
```

- [GIT installation](https://git-scm.com/downloads)
- [Node/NPM installation](https://nodejs.org/en/)

### Cloning the Repository
After installing the prerequisites, open a terminal or command prompt.

Clone the repository to get the code locally.

```
git clone https://github.com/Pandahead33/provider-directory.git
```

This will create a new directory called provider-directory. Navigate into it.

```
cd provider-directory
```

### Project Setup
Next install other dependencies by running:

```
npm install
``` 

This only needs to run on first install or if dependencies change later.

After that run,

```
npm start
```

which will start the dev server at [http://localhost:3000](http://localhost:3000). Click the link or open a browser and navigate to that page to see the app in action!

**Congrats! Provider Contact Directory should be up and running.**

#### Testing
The project includes tests that are run by typing in:

```
npm test
```

It uses both snapshot testing and [testing-library](https://testing-library.com/) to replicate tests similar to how users actually interact with the app.

## Project Structure

The entry point is a default index.tsx file. But the top level react component is ProviderDirectoryApp.

ProviderDirectoryApp holds the main layout which consists of three major components.

1. Contact Form
	- This form handles Adding/Editing.
2. Provider List 
	- This is the meat of the application. View provider contacts, search, sort, and edit or delete. 
	- Hitting edit will open the Contact Form with the relevant data.
3. Action History
	- Every change is documented up to the current point. Rewind or fast forward actions. Delete a contact accidentally? No problem! Simply rewind the action. Add ten different people and realized none were of the medical persuasion? Again, not an issue. Scroll down to before it happened and rewind.
	- "Current History" represents what is being viewed in the table.
	- "Fast forward" goes to a future action
	- "Rewind" goes further into the past.
	- Actions happen on current history. If the Current History is not the most recent event, it will delete all "future" states. You can no longer fast forward and those states are lost forever. History before the "Current History" is retained.

## Future Additions

This is a relatively happy path application. 

Possible future enhancements:

- Switch all classes to React Hooks
- Extensive error handling/messages
- diffs for Action History edits
- more robust tests
- Pagination
- Complex search filters
- Spring Boot app for Data Persistence Option B.
- Async operations
- Scheduling system 

# Building a Production Release
This section is copied from Create React App. 

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

Learn more about [deployment](https://facebook.github.io/create-react-app/docs/deployment).

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss the change.

The project includes [prettier](https://prettier.io/) and [eslint](https://eslint.org/docs/rules/). 

[Prettier](https://prettier.io/) will beautify and format the code automatically.

A shortcut to run [prettier](https://prettier.io/) is:
```
npm run pretty 
```

It is helpful to run the linter before building or deploying to catch obvious mistakes and style issues.

```
npm run linter
```

Please make sure to update tests as appropriate. Run the existing tests before opening a pull request with:

```
npm test
```