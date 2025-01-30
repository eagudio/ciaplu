import t from 'tap';
import { match } from '../../src/main';

t.test('Match instance with specific type', async t => {
  class MockException1 extends Error {};

  const ex1 = new MockException1('error 1');

  const res = await match(ex1)
    .withType(MockException1, () => 'MockException1')

  t.equal(res, 'MockException1');
});

t.test('Match one of multiple instance types', async t => {
  class MockException1 extends Error {};
  class MockException2 extends Error {};

  const ex2 = new MockException2('error 2');

  const res = await match(ex2)
    .withType(MockException1, () => 'MockException1')
    .withType(MockException2, () => 'MockException2')

  t.equal(res, 'MockException2');
});

t.test('No match for any instance type', async t => {
  class MockException1 extends Error {};
  class MockException2 extends Error {};

  const ex1 = new MockException1('error 1');

  const res = await match(ex1)
    .withType(MockException2, () => 'MockException2')
    .otherwise(() => 'OtherException');

  t.equal(res, 'OtherException');
});

t.test('No match and no otherwise handler', async t => {
  class MockException1 extends Error {};
  class MockException2 extends Error {};

  const ex1 = new MockException1('error 1');

  const res = await match(ex1)
    .withType(MockException2, () => 'MockException2')

  t.equal(res, null);
});

t.test('Match instance and throw error in handler', async t => {
  class MockException1 extends Error {};

  const ex1 = new MockException1('error 1');

  await t.rejects(
    match(ex1)
      .withType(MockException1, () => {
        throw new Error('error');
      }),
    { message: 'error' }
  );
});

t.test('Match string value', async t => {
  const res = await match('string')
    .with('string', () => 'match with string!')

  t.equal(res, 'match with string!');
});

t.test('Match one of multiple string values', async t => {
  const res = await match('string 2')
    .with('string 1', () => 'match with string 1!')
    .with('string 2', () => 'match with string 2!')

  t.equal(res, 'match with string 2!');
});

t.test('Match condition based on function', async t => {
  const res = await match('string 2')
    .when((value: string) => value === 'string 1', () => 'match with string 1!')
    .when((value: string) => value === 'string 2', () => 'match with string 2!')

  t.equal(res, 'match with string 2!');
});

t.test('No condition matched with fallback', async t => {
  const res = await match('string 3')
    .when((value: string) => value === 'string 1', () => 'match with string 1!')
    .when((value: string) => value === 'string 2', () => 'match with string 2!')
    .otherwise(() => 'no string matched!')

  t.equal(res, 'no string matched!');
});

t.test('Async handler match', async t => {
  const asyncFunction1 = () => {
    return Promise.resolve('cerea');
  };

  const res = await match('bastian')
    .with('bastian', async () => await asyncFunction1())

  t.equal(res, 'cerea');
});

t.test('Fallback to otherwise with async handler', async t => {
  const asyncFunction2 = () => {
    return Promise.resolve('ciau');
  };

  const res = await match('tony')
    .with('bastian', async () => 'cerea')
    .otherwise(async () => await asyncFunction2())

  t.equal(res, 'ciau');
});

t.test('Multiple conditions with promises', async t => {
  const res = await match('string 2')
    .when((value: string) => Promise.resolve(value === 'string 1'), () => Promise.resolve('match with string 1!'))
    .when((value: string) => Promise.resolve(value === 'string 2'), () => Promise.resolve('match with string 2!'))

  t.equal(res, 'match with string 2!');
});

t.test('Performing and extracting used multiple times', async t => {
  const res = await match('string 123456')
    .extracting((value: string) => Promise.resolve(value.length))
    .performing(async (length: number, value: number) => Promise.resolve(length === value))
    .when((length: number) => length === 12, () => Promise.resolve('length is 12!'))
    .with(9, async () => Promise.resolve('length is 9!'))
    .extracting((length: number) => Promise.resolve(length * 2))
    .when((length: number) => length === 26, () => Promise.resolve('length is 26!'))
    .performing(async (length: number, value: number) => Promise.resolve(length > value))
    .with(13, async () => Promise.resolve('greater than 13!'))
    .otherwise(async () => Promise.resolve('no match found!'))

  t.equal(res, 'length is 26!');
});

t.test('Complex chain of performing and extracting', async t => {
  const res = await match({ text: 'example', count: 5 })
    .extracting((obj) => Promise.resolve({ ...obj, count: obj.count + 1 }))
    .performing(async (obj, value) => Promise.resolve(obj.count === value))
    .with(7, async () => Promise.resolve('count is 7!'))
    .extracting((obj) => Promise.resolve({ ...obj, count: obj.count * 2 }))
    .when((obj) => obj.count === 12, () => Promise.resolve('count is 12!'))
    .performing(async (obj, value) => Promise.resolve(obj.count < value))
    .with(20, async () => Promise.resolve('count less than 20!'))
    .otherwise(async () => Promise.resolve('no match found!'))

  t.equal(res, 'count is 12!');
});

t.test('Nested performing and extracting with conditions', async t => {
  const res = await match('nested example')
    .extracting((value: string) => Promise.resolve(value.split(' ')))
    .performing(async (words, wordCount) => Promise.resolve(words.length === wordCount))
    .with(3, async () => Promise.resolve('three words!'))
    .extracting((words: string[]) => Promise.resolve(words.join('-')))
    .when((value: string) => value === 'nested-example', () => Promise.resolve('hyphenated match!'))
    .otherwise(async () => Promise.resolve('no match!'))

  t.equal(res, 'hyphenated match!');
});

t.test('matchAll for multiple matches', async t => {
  const words: string[] = [];

  const addWord = async (word: string) => {
    words.push(word);

    return words;
  };

  const res = await match('test string with multiple conditions')
    .extracting((value: string) => Promise.resolve(value.split(' ')))
    .performing(async (words, wordCount) => Promise.resolve(words.length === wordCount))
    .matchingAll()
    .with(5, async () => await addWord('cerea'))
    .with(3, async () => Promise.resolve('tinca'))
    .with(5, async () => await addWord('buta'))
    .otherwise(async () => Promise.resolve('no match found!'))

  t.same(res, ['cerea', 'buta']);
});

t.test('matchAll for multiple matches and returning result array', async t => {
  const res = await match('test string with multiple conditions')
    .extracting((value: string) => Promise.resolve(value.split(' ')))
    .performing(async (words, wordCount) => Promise.resolve(words.length === wordCount))
    .matchingAll()
    .with(5, async () => Promise.resolve('cerea'))
    .with(3, async () => Promise.resolve('tinca'))
    .with(5, async () => Promise.resolve('buta'))
    .otherwise(async () => Promise.resolve('no match found!'))
    .returningAll()

  t.same(res, ['cerea', 'buta']);
});

t.test('matchFirst after matchAll', async t => {
  const words: string[] = [];

  const addWord = async (word: string) => {
    words.push(word);

    return words;
  };

  const res = await match('test string with multiple conditions')
    .extracting((value: string) => Promise.resolve(value.split(' ')))
    .performing(async (words, wordCount) => Promise.resolve(words.length === wordCount))
    .matchingAll()
    .with(5, async () => await addWord('cerea'))
    .with(3, async () => Promise.resolve('tinca'))
    .with(5, async () => await addWord('buta'))
    .with(5, async () => await addWord('cerea'))
    .matchingFirst()
    .with(3, async () => Promise.resolve('tinca'))
    .with(5, async () => await addWord('buta'))
    .otherwise(async () => Promise.resolve('no match found!'))

  t.same(res, ['cerea', 'buta', 'cerea']);
});
