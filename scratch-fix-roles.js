const { DataSource } = require('typeorm');
const config = require('./src/config/typeorm-cli.config.ts').default;

async function run() {
  await config.initialize();
  try {
    const roleRepo = config.getRepository('tbl_role');
    const userRepo = config.getRepository('tbl_user');
    
    const userRole = await roleRepo.findOne({ where: { name: 'user' } });
    if (userRole) {
      await userRepo.createQueryBuilder()
        .update('tbl_user')
        .set({ role: userRole })
        .where('roleId IS NULL')
        .execute();
      console.log('Fixed users with null roles.');
    }
  } catch (e) {
    console.error("Error:", e);
  }
  await config.destroy();
}
run();
