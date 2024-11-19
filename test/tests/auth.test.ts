import t from 'tap'
import ciaplu from '../../src/main';
import { MockException1 } from '../mock/mockexception1';
import { MockException2 } from '../mock/mockexception2';

t.test('should match one exception', async t => {
  const ex1 = new MockException1('error 1');

  ciaplu.match(ex1)
    .with(MockException1, () => t.equal(ex1.message, 'error 1'));
});

t.test('should match to one of two exceptions', async t => {
  const ex2 = new MockException2('error 2');

  ciaplu.match(ex2)
    .with(MockException1, () => t.equal(ex2.message, 'error 1'))
    .with(MockException2, () => t.equal(ex2.message, 'error 2'));
});

t.test('should not match two exceptions', async t => {
  const ex1 = new MockException1('error 1');

  ciaplu.match(ex1)
    .with(MockException2, () => t.equal(ex1.message, 'error 2'))
    .otherwise(() => t.equal(ex1.message, 'error 1'))
});
