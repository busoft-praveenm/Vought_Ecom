import { MigrationInterface, QueryRunner } from "typeorm";

export class CategoryTable1784533041482 implements MigrationInterface {
    name = 'CategoryTable1784533041482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP FOREIGN KEY \`FK_role_id\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` DROP FOREIGN KEY \`fk_user_profile_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_role_name\` ON \`tbl_role\``);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` CHANGE \`category\` \`category_id\` varchar(255) NULL`);
        await queryRunner.query(`CREATE TABLE \`tbl_category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_324bd3008da4aa4e22aaef14ea\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tbl_role\` ADD UNIQUE INDEX \`IDX_9202294311d3253394ec1a84c9\` (\`name\`)`);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` ADD UNIQUE INDEX \`IDX_23d7d1344771331471c41396b9\` (\`user_id\`)`);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` DROP COLUMN \`category_id\``);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` ADD \`category_id\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_23d7d1344771331471c41396b9\` ON \`tbl_user_profile\` (\`user_id\`)`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD CONSTRAINT \`FK_815721470c574aed27ade42da28\` FOREIGN KEY (\`role_id\`) REFERENCES \`tbl_role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` ADD CONSTRAINT \`FK_23d7d1344771331471c41396b93\` FOREIGN KEY (\`user_id\`) REFERENCES \`tbl_user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` ADD CONSTRAINT \`FK_11226b104a5dac008ca4090b936\` FOREIGN KEY (\`category_id\`) REFERENCES \`tbl_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tbl_products\` DROP FOREIGN KEY \`FK_11226b104a5dac008ca4090b936\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` DROP FOREIGN KEY \`FK_23d7d1344771331471c41396b93\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` DROP FOREIGN KEY \`FK_815721470c574aed27ade42da28\``);
        await queryRunner.query(`DROP INDEX \`REL_23d7d1344771331471c41396b9\` ON \`tbl_user_profile\``);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` DROP COLUMN \`category_id\``);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` ADD \`category_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` ADD \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` ADD \`created_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` DROP INDEX \`IDX_23d7d1344771331471c41396b9\``);
        await queryRunner.query(`ALTER TABLE \`tbl_role\` DROP INDEX \`IDX_9202294311d3253394ec1a84c9\``);
        await queryRunner.query(`DROP INDEX \`IDX_324bd3008da4aa4e22aaef14ea\` ON \`tbl_category\``);
        await queryRunner.query(`DROP TABLE \`tbl_category\``);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` CHANGE \`category_id\` \`category\` varchar(255) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_role_name\` ON \`tbl_role\` (\`name\`)`);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` ADD CONSTRAINT \`fk_user_profile_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`tbl_user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbl_user\` ADD CONSTRAINT \`FK_role_id\` FOREIGN KEY (\`role_id\`) REFERENCES \`tbl_role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
