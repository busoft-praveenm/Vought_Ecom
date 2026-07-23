import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserProfileAddresses1784793390184 implements MigrationInterface {
    name = 'AddUserProfileAddresses1784793390184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_categories\` DROP FOREIGN KEY \`FK_product_categories_category_id\``);
        await queryRunner.query(`ALTER TABLE \`product_categories\` DROP FOREIGN KEY \`FK_product_categories_product_id\``);
        await queryRunner.query(`DROP INDEX \`IDX_category_id\` ON \`product_categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_product_id\` ON \`product_categories\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` ADD \`billing_address\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` ADD \`delivery_address\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` ADD \`delivery_lat\` decimal(10,8) NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` ADD \`delivery_lng\` decimal(11,8) NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_8748b4a0e8de6d266f2bbc877f\` ON \`product_categories\` (\`product_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_9148da8f26fc248e77a387e311\` ON \`product_categories\` (\`category_id\`)`);
        await queryRunner.query(`ALTER TABLE \`product_categories\` ADD CONSTRAINT \`FK_8748b4a0e8de6d266f2bbc877f6\` FOREIGN KEY (\`product_id\`) REFERENCES \`tbl_products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`product_categories\` ADD CONSTRAINT \`FK_9148da8f26fc248e77a387e3112\` FOREIGN KEY (\`category_id\`) REFERENCES \`tbl_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_categories\` DROP FOREIGN KEY \`FK_9148da8f26fc248e77a387e3112\``);
        await queryRunner.query(`ALTER TABLE \`product_categories\` DROP FOREIGN KEY \`FK_8748b4a0e8de6d266f2bbc877f6\``);
        await queryRunner.query(`DROP INDEX \`IDX_9148da8f26fc248e77a387e311\` ON \`product_categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_8748b4a0e8de6d266f2bbc877f\` ON \`product_categories\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` DROP COLUMN \`delivery_lng\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` DROP COLUMN \`delivery_lat\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` DROP COLUMN \`delivery_address\``);
        await queryRunner.query(`ALTER TABLE \`tbl_user_profile\` DROP COLUMN \`billing_address\``);
        await queryRunner.query(`CREATE INDEX \`IDX_product_id\` ON \`product_categories\` (\`product_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_category_id\` ON \`product_categories\` (\`category_id\`)`);
        await queryRunner.query(`ALTER TABLE \`product_categories\` ADD CONSTRAINT \`FK_product_categories_product_id\` FOREIGN KEY (\`product_id\`) REFERENCES \`tbl_products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`product_categories\` ADD CONSTRAINT \`FK_product_categories_category_id\` FOREIGN KEY (\`category_id\`) REFERENCES \`tbl_category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
