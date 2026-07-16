const { createClient } = require('redis');

async function test() {
  const client = createClient();
  await client.connect();
  const keys = await client.keys('*');
  console.log('Keys:', keys);
  await client.disconnect();
}

test().catch(console.error);
