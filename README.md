# Ciaplu - Pattern Matching Library
`Ciaplu` is a TypeScript library that implements **Pattern Matching** to declaratively match values or types. It allows you to define handlers for both synchronous and asynchronous operations, making it easy to structure your code for complex conditional logic. Whether you're matching basic values or more complex types, `Ciaplu` provides a clean and powerful way to handle various conditions with a minimalistic API. It is also well-suited for AI applications such as managing prompts and conditional logic for dynamic actions.
## Features
- **Support for synchronous and asynchronous functions**: Execute actions based on the matched value or condition.
- **Clean API**: Use `match`, `with`, e `when` methods for readable and maintainable code.
- **Versatile**: Ideal for use cases such as exception handling, value matching, or dynamic action selection and AI integration..
## Installation
Install `ciaplu` using npm:

```bash
npm install ciaplu
```
## Usage Examples
### Matching String Values
```Typescript
import { match } from 'ciaplu';

async function example() {
  const result = await match('bagna cauda')
    .with('taiarin', async () => await asyncFunction1())
    .with('bagna cauda', async () => await asyncFunction2())
    .otherwise(async () => await asyncCereaFunction());

  console.log(result); // Output: 'bagna cauda'
}
```
### Matching Class Instances
```Typescript
import { match } from 'ciaplu';

try {
  throw new BoiaFausError();
} catch (ex) {
  const res = await match(ex)
    .with(TurnaSiError, () => 'Handled TurnaSiError')
    .with(BoiaFausError, () => 'Handled BoiaFausError')
    .otherwise(() => 'Cerea!');

  console.log(res); // Output: 'Handled BoiaFausError'
}
```
### Collecting Multiple Matches with .matchingAll() and .returningAll()
```Typescript
import { match } from 'ciaplu';

const res = await match('test string with multiple conditions')
  .extracting((value: string) => Promise.resolve(value.split(' ')))
  .performing(async (words, wordCount) => Promise.resolve(words.length === wordCount))
  .matchingAll()
  .with(5, async () => Promise.resolve('cerea'))
  .with(3, async () => Promise.resolve('tinca'))
  .with(5, async () => Promise.resolve('buta'))
  .otherwise(async () => Promise.resolve('no match found!'))
  .returningAll();

console.log(res);
// Output:
// [
//   "cerea",
//   "buta",
// ]
```
## API
### `match(value)`
Initializes a matcher for the given value. The value can be a primitive, an object, or an exception.
### `.with(condition, handler)`
Defines a condition and its corresponding handler:
- condition: A value or class to match against.
- handler: A function to execute if the condition is met. It can be synchronous or asynchronous.
Chain multiple .with methods to handle different cases.
### `.withType(classConstructor, handler)`
Defines a condition that matches instances of a class:
- classConstructor: The class to match.
- handler: A function to execute when an instance of the class is matched.
### `.when(condition, handler)`
Defines a condition to match based on a function that returns a boolean or a promise:
- condition: A function that returns true or false.
- handler: A function to execute when the condition is met.
### `.extracting(extractor)`
Extracts a value from the matched input:
- extractor: A function that takes the input value and returns a transformed result.
### `.performing(matcher)`
Changes the matcher to be applied from that point forward:
- matcher: A function that determines how subsequent matching will be applied.
### `matchingAll()`
Executes all handlers that match the condition. Useful for cases where you want to handle multiple matches.
### `matchingFirst()`
Executes only the first handler that matches the condition. Useful for cases where you only need to handle the first match.
### `returningAll()`
Returns an array of results when using `matchingAll()`, allowing you to capture all matched values.
### `returningLast()`
Returns only the last matched value when using `matchingFirst()`, capturing only the final result.
### `.otherwise(handler)`
Defines a fallback handler to execute if no conditions match:
- handler: A function to execute as a fallback. It can be synchronous or asynchronous.
## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
1. Create a new branch for your changes.
1. Implement your changes, including tests if applicable.
1. Submit a pull request with a detailed explanation of your work.

If you encounter bugs or have suggestions for improvements, please open an issue!
