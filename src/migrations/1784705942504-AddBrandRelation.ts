import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBrandRelation1784705942504 implements MigrationInterface {
    name = 'AddBrandRelation1784705942504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tbl_products\` CHANGE \`brand\` \`brand_id\` varchar(255) NULL`);
        await queryRunner.query(`CREATE TABLE \`tbl_brand\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`image_url\` text NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_cee3f3f0ddb9463c342989a902\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` DROP COLUMN \`brand_id\``);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` ADD \`brand_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` ADD CONSTRAINT \`FK_e6038875bd5dae843640b246b2c\` FOREIGN KEY (\`brand_id\`) REFERENCES \`tbl_brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tbl_products\` DROP FOREIGN KEY \`FK_e6038875bd5dae843640b246b2c\``);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` DROP COLUMN \`brand_id\``);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` ADD \`brand_id\` varchar(255) NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_cee3f3f0ddb9463c342989a902\` ON \`tbl_brand\``);
        await queryRunner.query(`DROP TABLE \`tbl_brand\``);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` CHANGE \`brand_id\` \`brand\` varchar(255) NULL`);
    }

}
