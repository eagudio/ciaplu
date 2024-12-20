import t from 'tap'
import { match } from '../../src/main';
import { MockException1 } from '../mock/mockexception1';
import { MockException2 } from '../mock/mockexception2';

t.test('should match one instance', async t => {
  const ex1 = new MockException1('error 1');

  const res = await match(ex1)
    .withType(MockException1, () => 'MockException1')
    .resolve();

  t.equal(res, 'MockException1');
});

t.test('should match to one of two instances', async t => {
  const ex2 = new MockException2('error 2');

  const res = await match(ex2)
    .withType(MockException1, () => 'MockException1')
    .withType(MockException2, () => 'MockException2')
    .resolve();

  t.equal(res, 'MockException2');
});

t.test('should not match any instances', async t => {
  const ex1 = new MockException1('error 1');

  const res = await match(ex1)
    .withType(MockException2, () => 'MockException2')
    .otherwise(() => 'OtherException')
    .resolve();

  t.equal(res, 'OtherException');
});

t.test('should not match any instances without otherwise handler', async t => {
  const ex1 = new MockException1('error 1');

  const res = await match(ex1)
    .withType(MockException2, () => 'MockException2')
    .resolve();

  t.equal(res, null);
});

t.test('should match one instance and throw error', async t => {
  const ex1 = new MockException1('error 1');

  await t.rejects(
    match(ex1)
      .withType(MockException1, () => {
        throw new Error('error')
      })
      .resolve()
    ,
    { message: 'error' }
  )
});

t.test('should match one string', async t => {
  const res = await match('string')
    .with('string', () => 'match with string!')
    .resolve();

  t.equal(res, 'match with string!');
});

t.test('should match to one of two strings', async t => {
  const res = await match('string 2')
    .with('string 1', () => 'match with string 1!')
    .with('string 2', () => 'match with string 2!')
    .resolve();

  t.equal(res, 'match with string 2!');
});

t.test('should match to one of two condition', async t => {
  const res = await match('string 2')
    .when((value: string) => value === 'string 1', () => 'match with string 1!')
    .when((value: string) => value === 'string 2', () => 'match with string 2!')
    .resolve();

  t.equal(res, 'match with string 2!');
});

t.test('should no match any condition', async t => {
  const res = await match('string 3')
    .when((value: string) => value === 'string 1', () => 'match with string 1!')
    .when((value: string) => value === 'string 2', () => 'match with string 2!')
    .otherwise(() => 'no string matched!')
    .resolve();

  t.equal(res, 'no string matched!');
});
