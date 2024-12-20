import t from 'tap'
import { match } from '../../src/main';

t.test('should match and call async function', async t => {
  const asyncFunction1 = () => {
    return Promise.resolve('cerea');
  };

  const asyncFunction2 = () => {
    return Promise.resolve('ciau');
  };

  const res = await match('bastian')
    .with('bastian', async () => await asyncFunction1())
    .with('tony', async () => await asyncFunction2())
    .resolve();

  t.equal(res, 'cerea');
});

t.test('should not match', async t => {
  const asyncFunction1 = () => {
    return Promise.resolve('cerea');
  };

  const asyncFunction2 = () => {
    return Promise.resolve('ciau');
  };

  const res = await match('tony')
    .with('bastian', async () => await asyncFunction1())
    .otherwise(async () => await asyncFunction2())
    .resolve();

  t.equal(res, 'ciau');
});

t.test('should match to one of two condition', async t => {
  const res = await match('string 2')
    .when((value: string) => Promise.resolve(value === 'string 1'), () => Promise.resolve('match with string 1!'))
    .when((value: string) => Promise.resolve(value === 'string 2'), () => Promise.resolve('match with string 2!'))
    .resolve();

  t.equal(res, 'match with string 2!');
});

t.test('should match to one of two condition', async t => {
  const res = await match('string 4')
    .when((value: string) => value === 'string 1', () => Promise.resolve('match with string 1!'))
    .with('string 2', async () => Promise.resolve('match with string 2!'))
    .when((value: string) => value === 'string 3', () => Promise.resolve('match with string 3!'))
    .with('string 4', async () => Promise.resolve('match with string 4!'))
    .resolve();

  t.equal(res, 'match with string 4!');
});

t.test('should match to one of two condition', async t => {
  const res = await match('string 1')
    .when((value: string) => value === 'string 1', () => Promise.resolve('match with string 1!'))
    .with('string 2', async () => Promise.resolve('match with string 2!'))
    .when((value: string) => value === 'string 3', () => Promise.resolve('match with string 3!'))
    .with('string 4', async () => Promise.resolve('match with string 4!'))
    .otherwise(async () => Promise.resolve('no string matched!'))
    .resolve();

  t.equal(res, 'match with string 1!');
});

t.test('should match to one of two condition', async t => {
  const res = await match('string 5')
    .when((value: string) => value === 'string 1', () => Promise.resolve('match with string 1!'))
    .with('string 2', async () => Promise.resolve('match with string 2!'))
    .when((value: string) => value === 'string 3', () => Promise.resolve('match with string 3!'))
    .with('string 4', async () => Promise.resolve('match with string 4!'))
    .otherwise(async () => Promise.resolve('no string matched!'))
    .resolve();

  t.equal(res, 'no string matched!');
});

t.test('should match to one of two condition', async t => {
  const res = await match('string 123456')
    .extrat((value: string) => Promise.resolve(value.length))
    .when((length: number) => Promise.resolve(length === 8), () => Promise.resolve('match 1!'))
    .with(9, async () => Promise.resolve('match 2!'))
    .when((length: number) => Promise.resolve(length > 10 && length < 12), () => Promise.resolve('match 3!'))
    .with(13, async () => Promise.resolve('match 4!'))
    .otherwise(async () => Promise.resolve('no matched!'))
    .resolve();

  t.equal(res, 'match 4!');
});

t.test('should match to one of two condition', async t => {
  const res = await match('string 123456')
    .extrat((value: string) => Promise.resolve(value.length))
    .perform(async (length: number, value: number) => Promise.resolve(length === value))
    .when((length: number) => Promise.resolve(length === 8), () => Promise.resolve('match 1!'))
    .with(9, async () => Promise.resolve('match 2!'))
    .when((length: number) => Promise.resolve(length > 10 && length < 12), () => Promise.resolve('match 3!'))
    .with(13, async () => Promise.resolve('match 4!'))
    .otherwise(async () => Promise.resolve('no matched!'))
    .resolve();

  t.equal(res, 'match 4!');
});
