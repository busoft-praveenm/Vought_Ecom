import { MigrationInterface, QueryRunner } from "typeorm";

export class ManyToManyCategories1784712024000 implements MigrationInterface {
    name = 'ManyToManyCategories1784712024000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create junction table
        await queryRunner.query(`CREATE TABLE \`product_categories\` (\`product_id\` int NOT NULL, \`category_id\` int NOT NULL, INDEX \`IDX_product_id\` (\`product_id\`), INDEX \`IDX_category_id\` (\`category_id\`), PRIMARY KEY (\`product_id\`, \`category_id\`)) ENGINE=InnoDB`);
        
        // Add foreign keys for junction table
        await queryRunner.query(`ALTER TABLE \`product_categories\` ADD CONSTRAINT \`FK_product_categories_product_id\` FOREIGN KEY (\`product_id\`) REFERENCES \`tbl_products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`product_categories\` ADD CONSTRAINT \`FK_product_categories_category_id\` FOREIGN KEY (\`category_id\`) REFERENCES \`tbl_category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        
        // Migrate data
        await queryRunner.query(`INSERT INTO \`product_categories\` (\`product_id\`, \`category_id\`) SELECT \`id\`, \`category_id\` FROM \`tbl_products\` WHERE \`category_id\` IS NOT NULL`);
        
        // Drop old relation
        await queryRunner.query(`ALTER TABLE \`tbl_products\` DROP FOREIGN KEY \`FK_11226b104a5dac008ca4090b936\``);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` DROP COLUMN \`category_id\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Add old relation back
        await queryRunner.query(`ALTER TABLE \`tbl_products\` ADD \`category_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` ADD CONSTRAINT \`FK_11226b104a5dac008ca4090b936\` FOREIGN KEY (\`category_id\`) REFERENCES \`tbl_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        // Re-migrate data (picking the first category assigned to a product)
        await queryRunner.query(`UPDATE \`tbl_products\` p JOIN (SELECT product_id, MIN(category_id) as category_id FROM \`product_categories\` GROUP BY product_id) pc ON p.id = pc.product_id SET p.category_id = pc.category_id`);
        
        // Drop junction table
        await queryRunner.query(`ALTER TABLE \`product_categories\` DROP FOREIGN KEY \`FK_product_categories_category_id\``);
        await queryRunner.query(`ALTER TABLE \`product_categories\` DROP FOREIGN KEY \`FK_product_categories_product_id\``);
        await queryRunner.query(`DROP TABLE \`product_categories\``);
    }

}
