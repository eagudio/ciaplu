# Ciaplu - Exception Matcher Library

`Ciaplu` is a simple TypeScript library that helps in managing and handling exceptions in a more structured way. It allows you to define custom exception classes and match them in a clean, readable manner. 

## Features

- **Custom Exception Handling**: Easily manage custom exceptions by creating custom classes that extend `Error`.
- **Match Exceptions**: A powerful `match` method to handle multiple exceptions with a clear structure.
- **Promise-based**: Works seamlessly with async/await to handle exceptions in asynchronous flows.

## Installation

You can install `ciaplu` via npm:

```bash
npm install ciaplu
```

## Usage

### Creating Custom Exceptions

First, define your custom exceptions extending the base Error class:

```
class BoiaFausError extends Error {}

class TurnaSiError extends Error {}
```

### Using the `match` Method

You can now use the match method to match exceptions and handle them accordingly:

```
import ciaplu from 'ciaplu';

const ex = new BoiaFausError("No company licence found.");

ciaplu.match(ex)
  .with(BoiaFausError, () => console.log("Handle BoiaFausError"))
  .with(TurnaSiError, () => console.log("Handle TurnaSiError"))
  .otherwise(() => console.log("Handle generic error"));
```

## API

### `ciaplu.match(ex)`

Matches the provided exception ex to handle different exception types. You can chain the following methods:

- `.with(ExceptionClass, handler)` – Defines how to handle a specific exception.
- `.otherwise(handler)` – Defines a generic handler for unhandled exceptions.

## Contributing

Feel free to fork the repository and submit issues or pull requests. Contributions are welcome!

To contribute, you can follow these steps:

- Fork the repository on GitHub.
- Clone your fork locally.
- Create a new branch for your changes.
- Make the necessary changes, including adding tests if possible.
- Commit your changes and push them to your fork.
- Open a pull request describing your changes.
- f you find any bugs or have suggestions for improvements, feel free to open an issue!
