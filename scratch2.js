const { createCache } = require('cache-manager');

async function test() {
  const cache = createCache();
  console.log(cache);
}

test();
