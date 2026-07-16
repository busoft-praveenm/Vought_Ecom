const { DataSource } = require('typeorm');
const config = require('./src/config/typeorm-cli.config.ts').default;

async function run() {
  await config.initialize();
  try {
    const roles = await config.getRepository('tbl_role').find();
    console.log("Roles:", roles);
  } catch (e) {
    console.error("Error:", e);
  }
  await config.destroy();
}
run();
