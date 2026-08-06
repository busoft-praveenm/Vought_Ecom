import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleTable1784110000000 implements MigrationInterface {
    name = 'AddRoleTable1784110000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create tbl_role
        await queryRunner.query(`CREATE TABLE \`tbl_role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_role_name\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        
        // Insert default roles
        await queryRunner.query(`INSERT INTO \`tbl_role\` (\`name\`) VALUES ('admin'), ('user')`);
        
        // Add role_id to tbl_user
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD \`role_id\` int NULL`);
        
        // Default existing users to 'user' role
        await queryRunner.query(`UPDATE \`tbl_user\` SET \`role_id\` = (SELECT \`id\` FROM \`tbl_role\` WHERE \`name\` = 'user')`);
        
        // Assign specific user 'praveenlee1707@gmail.com' to admin role
        await queryRunner.query(`UPDATE \`tbl_user\` SET \`role_id\` = (SELECT \`id\` FROM \`tbl_role\` WHERE \`name\` = 'admin') WHERE \`email\` = 'praveenlee1707@gmail.com'`);

        // Drop old role column
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP COLUMN \`role\``);
        
        // Add foreign key constraint
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD CONSTRAINT \`FK_role_id\` FOREIGN KEY (\`role_id\`) REFERENCES \`tbl_role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP FOREIGN KEY \`FK_role_id\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD \`role\` varchar(255) NULL`);
        await queryRunner.query(`UPDATE \`tbl_user\` u JOIN \`tbl_role\` r ON u.\`role_id\` = r.\`id\` SET u.\`role\` = r.\`name\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP COLUMN \`role_id\``);
        await queryRunner.query(`DROP TABLE \`tbl_role\``);
    }
}
