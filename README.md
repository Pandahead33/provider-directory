# Provider Contact Directory

Provider Contact Directory is a React app programmed in Typescript for managing medical provider contacts. The project was initialized with [Create React App](https://create-react-app.dev/).

## Included Features
- Ability to add, edit, remove a contact.
- Sort and filter by any field
- Search (basic keyword on any field)
- Action History tracking operations that can be rewinded/fast forward

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

### Prerequistes
The prerequistes to install the app are node/npm and git.

If you don't have node installed, the versions used were:

```
node v12.18.2
npm 6.14.5
```

[GIT installation](https://git-scm.com/downloads)
[Node/NPM installation](https://nodejs.org/en/)

### Cloning the Repository
After installing the prerequisites, open a terminal or command prompt.

Let's clone the repository to get the code on your local machine!

Run the command:
```
git clone https://github.com/Pandahead33/provider-directory.git
```

### Project Setup
Next install other dependencies will by running:

```
npm install
``` 


You only need to run this on first install or if you change dependencies later.

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

It uses both snapshost testing and [testing-library](https://testing-library.com/) to replicate tests similar to how users actually interact with the app.

## Project Structure

The entry point is a default index.tsx file. But the top level react component is ProviderDirectoryApp.

ProviderDirectoryApp holds the main layout which consists of three major components.

1. Contact Form
	- This form handles Adding/Editing.
2. Provider List 
	- This is the meat of the application. Here you can view provider contacts, search, sort, and edit or delete. 
	- Hitting edit will open the Contact Form with the relevant data.
3. Action History
	- Every change is documented up to the current point. You can rewind or fast forward. Delete a contact you didn't want to? No problem! Simply rewind the action. Have you added ten different people and realized none were of the medical persuasion? Again, not an issue. 
	- "Current History" represents what is being viewed in the table.
	- "Fast forward" let's you go to a future action
	- "Rewind" takes you further into the past.
	- If you do another operation, it will delete all "future" states. You can no longer fast forward and those states are lost forever. 

## Future Additions

This is a relatively happy path application. 

If I spent more time I'd likely:

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
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

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