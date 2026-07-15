const { DataSource } = require('typeorm');
const config = require('./src/config/typeorm-cli.config.ts').default;

async function run() {
  await config.initialize();
  try {
    const user = await config.getRepository('tbl_user').findOne({ where: { email: 'praveen_m@yopmail.com' } });
    console.log("Success:", user);
  } catch (e) {
    console.error("Error:", e);
  }
  await config.destroy();
}
run();
