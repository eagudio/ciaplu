import t from 'tap';
import { match, Matcher, Context } from '../../src/main';

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

t.test('Match one of multiple string values', async t => {
  const res = await match('string 5')
    .with('string 1', () => 'match with string 1!')
    .any()
    .not()
    .with('string 2', () => 'not match with string 2!')
    .with('string 3', () => 'not match with string 3!')
    .with('string 4', () => 'not match with string 4!')
    .yet()
    .with('string 5', () => 'match with string 5!')
    .all();

  t.same(res, [
    'not match with string 2!',
    'not match with string 3!',
    'not match with string 4!',
    'match with string 5!'
  ]);
});

t.test('Match instance with specific type', async t => {
  class MockException1 extends Error {};

  const ex1 = new MockException1('error 1');

  const res = await match(ex1)
    .withType(MockException1, () => 'MockException1')

  t.equal(res, 'MockException1');
});

t.test('Sync match instance with specific type and return value', async t => {
  class MockException1 extends Error {};

  const ex1 = new MockException1('error 1');

  const res = match(ex1)
    .withType(MockException1, () => 'MockException1')
    .return();

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

t.test('Match condition based on function', async t => {
  const res = await match('string 2')
    .when((value: string) => value === 'string 1', (value: string) => `string ${value} match with string 1!`)
    .when((value: string) => value === 'string 2', (value: string) => `string ${value} match with string 2!`)

  t.equal(res, 'string string 2 match with string 2!');
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
    .test(async (length: number, value: number) => Promise.resolve(length === value))
    .when((length: number) => length === 12, () => Promise.resolve('length is 12!'))
    .with(9, async () => Promise.resolve('length is 9!'))
    .extracting((length: number) => Promise.resolve(length * 2))
    .when((length: number) => length === 26, () => Promise.resolve('length is 26!'))
    .test(async (length: number, value: number) => Promise.resolve(length > value))
    .with(13, async () => Promise.resolve('greater than 13!'))
    .otherwise(async () => Promise.resolve('no match found!'))

  t.equal(res, 'length is 26!');
});

t.test('Complex chain of performing and extracting', async t => {
  const res = await match({ text: 'example', count: 5 })
    .extracting((obj) => Promise.resolve({ ...obj, count: obj.count + 1 }))
    .test(async (obj, value) => Promise.resolve(obj.count === value))
    .with(7, async () => Promise.resolve('count is 7!'))
    .extracting((obj) => Promise.resolve({ ...obj, count: obj.count * 2 }))
    .when((obj) => obj.count === 12, () => Promise.resolve('count is 12!'))
    .test(async (obj, value) => Promise.resolve(obj.count < value))
    .with(20, async () => Promise.resolve('count less than 20!'))
    .otherwise(async () => Promise.resolve('no match found!'))

  t.equal(res, 'count is 12!');
});

t.test('Nested performing and extracting with conditions', async t => {
  const res = await match('nested example')
    .extracting((value: string) => Promise.resolve(value.split(' ')))
    .test(async (words, wordCount) => Promise.resolve(words.length === wordCount))
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
    .test(async (words, wordCount) => Promise.resolve(words.length === wordCount))
    .any()
    .with(5, async () => await addWord('cerea'))
    .with(3, async () => Promise.resolve('tinca'))
    .with(5, async () => await addWord('buta'))
    .otherwise(async () => Promise.resolve('no match found!'))

  t.same(res, ['cerea', 'buta']);
});

t.test('matchAll for multiple matches and returning result array', async t => {
  const res = await match('test string with multiple conditions')
    .extracting((value: string) => Promise.resolve(value.split(' ')))
    .test(async (words, wordCount) => Promise.resolve(words.length === wordCount))
    .any()
    .with(5, async () => Promise.resolve('cerea'))
    .with(3, async () => Promise.resolve('tinca'))
    .with(5, async () => Promise.resolve('buta'))
    .otherwise(async () => Promise.resolve('no match found!'))
    .all()

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
    .test(async (words, wordCount) => Promise.resolve(words.length === wordCount))
    .any()
    .with(5, async () => await addWord('cerea'))
    .with(3, async () => Promise.resolve('tinca'))
    .with(5, async () => await addWord('buta'))
    .with(5, async () => await addWord('cerea'))
    .first()
    .with(3, async () => Promise.resolve('tinca'))
    .with(5, async () => await addWord('buta'))
    .otherwise(async () => Promise.resolve('no match found!'))

  t.same(res, ['cerea', 'buta', 'cerea']);
});

t.test('matchFirst after matchAll two times with reset context', async t => {
  class CustomMatcher extends Matcher<any> {
    private _words: string[] = [];

    addWord(word: string) {
      this._words.push(word);

      return this._words;
    };

    reset(value: any) {
      this._context = new Context(value);

      this._words = [];
    }
  }

  const matcher: CustomMatcher = new CustomMatcher('test string with multiple conditions');

  matcher
    .extracting((value: string) => Promise.resolve(value.split(' ')))
    .test(async (words, wordCount) => Promise.resolve(words.length === wordCount))
    .any()
    .with(5, async () => await matcher.addWord('cerea'))
    .with(3, async () => Promise.resolve('tinca'))
    .with(5, async () => await matcher.addWord('buta'))
    .with(5, async () => await matcher.addWord('cerea'))
    .first()
    .with(3, async () => Promise.resolve('tinca'))
    .with(5, async () => await matcher.addWord('buta'))
    .otherwise(async () => Promise.resolve('no match found!'))

  const res = await matcher;

  t.same(res, ['cerea', 'buta', 'cerea']);

  matcher.reset('test string with multiple conditions');

  const res2 = await matcher;

  t.same(res2, ['cerea', 'buta', 'cerea']);
});

t.test('match and extracting', async t => {
  const hex = '00000100';

  const res = match(hex.substring(0, 4))
    .with('424D', () => ({ ext: 'bmp', mime: 'image/bmp' }))
    .with('1F8B', () => ({ ext: 'tar.gz', mime: 'application/gzip' }))
    .with('0B77', () => ({ ext: 'ac3', mime: 'audio/vnd.dolby.dd-raw' }))
    .with('7801', () => ({ ext: 'dmg', mime: 'application/x-apple-diskimage' }))
    .with('4D5A', () => ({ ext: 'exe', mime: 'application/x-msdownload' }))
    .when((val) => ['1FA0', '1F9D'].includes(val), () => ({ ext: 'Z', mime: 'application/x-compress' }))
    .extracting(() => hex.substring(0, 6))
    .with('FFD8FF', () => ({ ext: 'jpg', mime: 'image/jpeg' }))
    .with('4949BC', () => ({ ext: 'jxr', mime: 'image/vnd.ms-photo' }))
    .with('425A68', () => ({ ext: 'bz2', mime: 'application/x-bzip2' }))
    .extracting(() => hex)
    .with('89504E47', () => ({ ext: 'png', mime: 'image/png' }))
    .with('47494638', () => ({ ext: 'gif', mime: 'image/gif' }))
    .with('25504446', () => ({ ext: 'pdf', mime: 'application/pdf' }))
    .with('504B0304', () => ({ ext: 'zip', mime: 'application/zip' }))
    .with('425047FB', () => ({ ext: 'bpg', mime: 'image/bpg' }))
    .with('4D4D002A', () => ({ ext: 'tif', mime: 'image/tiff' }))
    .with('00000100', () => ({ ext: 'ico', mime: 'image/x-icon' }))
    .otherwise(() => ({ ext: '', mime: 'unknown ' + hex }))
    .return();

  t.same(res, { ext: 'ico', mime: 'image/x-icon' });
});
