import config from 'config';
import 'reflect-metadata';
import App from '~/App';
import connection from '~/connection';
import debug from '~/debug';

const PORT = config.get<number>('port');
const HOSTNAME = config.get<string>('hostname');

connection.then(() => {
  App.listen(PORT, HOSTNAME, () => {
    debug('startServer')(`Listening on http://${HOSTNAME}:${PORT}`);
  });
});
