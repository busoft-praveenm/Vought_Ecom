import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1779789293183 implements MigrationInterface {
    name = 'InitMigration1779789293183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`email\` ON \`tbl_user\``);
        await queryRunner.query(`DROP INDEX \`firebase_uid\` ON \`tbl_user\``);
        await queryRunner.query(`DROP INDEX \`user_uid\` ON \`tbl_user\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD \`provider\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD \`photo_url\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD \`is_active\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD \`is_deleted\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` CHANGE \`id\` \`id\` bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD UNIQUE INDEX \`IDX_0ce5998a9199ed250fb4312dd3\` (\`user_uid\`)`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD UNIQUE INDEX \`IDX_87cffc1bf387e19b7519d18f99\` (\`firebase_uid\`)`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD UNIQUE INDEX \`IDX_da03ffed3d54f7872792df358f\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP COLUMN \`first_name\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD \`first_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP COLUMN \`last_name\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD \`last_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD \`role\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` CHANGE \`status\` \`status\` enum ('active', 'inactive', 'blocked') NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tbl_user\` CHANGE \`updated_at\` \`updated_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` CHANGE \`created_at\` \`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` CHANGE \`status\` \`status\` enum ('ACTIVE', 'INACTIVE') NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD \`role\` varchar(50) NULL DEFAULT 'USER'`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP COLUMN \`last_name\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD \`last_name\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP COLUMN \`first_name\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD \`first_name\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP INDEX \`IDX_da03ffed3d54f7872792df358f\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP INDEX \`IDX_87cffc1bf387e19b7519d18f99\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP INDEX \`IDX_0ce5998a9199ed250fb4312dd3\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD \`id\` bigint NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` CHANGE \`id\` \`id\` bigint NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP COLUMN \`is_deleted\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP COLUMN \`is_active\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP COLUMN \`photo_url\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP COLUMN \`provider\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`user_uid\` ON \`tbl_user\` (\`user_uid\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`firebase_uid\` ON \`tbl_user\` (\`firebase_uid\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`email\` ON \`tbl_user\` (\`email\`)`);
    }

}
