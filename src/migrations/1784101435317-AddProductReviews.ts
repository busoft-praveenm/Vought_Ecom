import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductReviews1784101435317 implements MigrationInterface {
    name = 'AddProductReviews1784101435317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tbl_product_review\` (\`id\` int NOT NULL AUTO_INCREMENT, \`rating\` int NOT NULL DEFAULT '0', \`review_text\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`user_id\` int NULL, \`product_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` ADD \`currency\` varchar(255) NOT NULL DEFAULT 'INR'`);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` ADD \`average_rating\` decimal(3,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`tbl_product_review\` ADD CONSTRAINT \`FK_54cbfb363209dfa139cdf704157\` FOREIGN KEY (\`user_id\`) REFERENCES \`tbl_user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbl_product_review\` ADD CONSTRAINT \`FK_6160a665bca4b25eddba4c6fe28\` FOREIGN KEY (\`product_id\`) REFERENCES \`tbl_products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        
        // Seed dummy review data
        await queryRunner.query(`INSERT INTO \`tbl_product_review\` (\`rating\`, \`review_text\`, \`product_id\`) VALUES (5, 'Amazing product, highly recommend!', 1)`);
        await queryRunner.query(`INSERT INTO \`tbl_product_review\` (\`rating\`, \`review_text\`, \`product_id\`) VALUES (4, 'Good quality but a bit pricey.', 1)`);
        await queryRunner.query(`UPDATE \`tbl_products\` SET \`average_rating\` = 4.50 WHERE \`id\` = 1`);
        
        await queryRunner.query(`INSERT INTO \`tbl_product_review\` (\`rating\`, \`review_text\`, \`product_id\`) VALUES (3, 'It is okay, nothing special.', 2)`);
        await queryRunner.query(`UPDATE \`tbl_products\` SET \`average_rating\` = 3.00 WHERE \`id\` = 2`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tbl_product_review\` DROP FOREIGN KEY \`FK_6160a665bca4b25eddba4c6fe28\``);
        await queryRunner.query(`ALTER TABLE \`tbl_product_review\` DROP FOREIGN KEY \`FK_54cbfb363209dfa139cdf704157\``);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` DROP COLUMN \`average_rating\``);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` DROP COLUMN \`currency\``);
        await queryRunner.query(`DROP TABLE \`tbl_product_review\``);
    }

}
