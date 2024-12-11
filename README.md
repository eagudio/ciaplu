# Ciaplu - Pattern Matching Library
`Ciaplu` is a simple TypeScript library that implements **Pattern Matching** to declaratively match values or types. It allows you to define handlers for both synchronous and asynchronous operations, making it easy to structure your code for complex conditional logic. Whether you’re matching basic values or more complex types, `Ciaplu` provides a clean and powerful way to handle various conditions with a minimalistic API.
## Features
- **Support for synchronous and asynchronous functions**: Execute actions based on the matched value or condition.
- **Clean API**: Use `match`, `with`, and `resolve` methods for readable and maintainable code.
- **Versatile**: Ideal for use cases such as exception handling, value matching, or dynamic action selection.
## Installation
Install `ciaplu` using npm:

```bash
npm install ciaplu
```
### Usage Examples
## Matching Values Asynchronously
Match a value and define actions based on the result:

```Typescript
import { match } from 'ciaplu';

async function example() {
  const res = await match('bagna caoda')
    .with('taiarin', async () => await asyncFunction1())
    .with('bagna caoda', async () => await asyncFunction2())
    .otherwise(async () => await asyncCereaFunction())
    .resolve();

  console.log(res);
}
```
### Handling Exceptions
Use `ciaplu` to match exceptions and handle them gracefully:
```Typescript
import { match } from 'ciaplu';

try {
  throw new BoiaFausError();
} catch (ex) {
  const res = await match(ex)
    .with(TurnaSiError, () => 'Handled TurnaSiError')
    .with(BoiaFausError, () => 'Handled BoiaFausError')
    .otherwise(async () => 'Cerea!')
    .resolve();

  console.log(res);
}
```
## API
### `match(value)`
Initializes a matcher for the given value. The value can be a primitive, an object, or an exception.
### `.with(condition, handler)`
Defines a condition and its corresponding handler:
- condition: A value or class to match against.
- handler: A function to execute if the condition is met. It can be synchronous or asynchronous.
Chain multiple .with methods to handle different cases.
### `.otherwise(handler)`
Defines a fallback handler to execute if no conditions match:
- handler: A function to execute as a fallback. It can be synchronous or asynchronous.
### `.resolve()`
Executes the first matching handler and returns its result. If no condition matches:

- if an `.otherwise(handler)` is defined, it executes the fallback handler and returns its result.
- if no fallback is defined, it returns `undefined`.
## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
1. Create a new branch for your changes.
1. Implement your changes, including tests if applicable.
1. Submit a pull request with a detailed explanation of your work.

If you encounter bugs or have suggestions for improvements, please open an issue!
