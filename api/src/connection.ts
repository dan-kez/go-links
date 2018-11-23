import retry from 'async-retry';
import { createConnection } from 'typeorm';
import debug from '~/debug';

export default retry(
  async () => {
    return createConnection();
  },
  {
    retries: 7,
    onRetry: e => {
      debug('createConnection')(e);
    },
  },
);
