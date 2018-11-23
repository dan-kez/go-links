import debug from 'debug';

const debugWrapper = (suffix: string | string[]): ((arg: any) => void) => {
  if (suffix instanceof Array) {
    return debug(`golinks:${suffix.join(':')}`);
  }
  return debug(`golinks:${suffix}`);
};

export default debugWrapper;
