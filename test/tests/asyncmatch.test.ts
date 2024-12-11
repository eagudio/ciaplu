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
