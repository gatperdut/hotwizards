import './env.js';

const target = process.env.HWBE_NODE_ENV === 'development' ? './dev.seed' : './prod.seed';

if (!process.env.HWBE_NODE_ENV) {
  console.warn('HWBE_NODE_ENV not set, defaulting to production seed.');
}

await import(target);
