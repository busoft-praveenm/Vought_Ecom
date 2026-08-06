const { DataSource } = require('typeorm');
const config = require('./src/config/typeorm-cli.config.ts').default;

async function run() {
  await config.initialize();
  try {
    const roleRepo = config.getRepository('tbl_role');
    const userRepo = config.getRepository('tbl_user');
    
    let roles = await roleRepo.find();
    console.log("Roles in DB:", roles);

    const newRole = roleRepo.create({ name: 'user' });
    if(roles.length === 0) {
        await roleRepo.save(newRole);
        console.log("Created user role");
    }

    const newUser = userRepo.create({
      userUid: 'testuid-' + Date.now(),
      firebaseUid: 'fireuid-' + Date.now(),
      email: 'test' + Date.now() + '@example.com',
      role: roles.length > 0 ? roles[0] : newRole
    });
    
    const savedUser = await userRepo.save(newUser);
    console.log("Saved user:", savedUser);
    
    const fetchedUser = await userRepo.findOne({ where: { id: savedUser.id }});
    console.log("Fetched user roleId:", fetchedUser.roleId);

  } catch (e) {
    console.error("Error:", e);
  }
  await config.destroy();
}
run();
