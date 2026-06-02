import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductTable1780305257245 implements MigrationInterface {
    name = 'ProductTable1780305257245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tbl_products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product_uid\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`sku\` varchar(255) NOT NULL, \`description\` text NULL, \`price\` decimal(10,2) NOT NULL, \`stock\` int NOT NULL DEFAULT '0', \`category\` varchar(255) NULL, \`brand\` varchar(255) NULL, \`image_url\` text NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`is_active\` tinyint NOT NULL DEFAULT 1, \`is_deleted\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by_id\` int NULL, UNIQUE INDEX \`IDX_d9e40f786db820dbfefbdf6a07\` (\`product_uid\`), UNIQUE INDEX \`IDX_807409c3dbb077bc06c6b793ae\` (\`sku\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tbl_products\` ADD CONSTRAINT \`FK_b10e74872754c382e21694b9e83\` FOREIGN KEY (\`created_by_id\`) REFERENCES \`tbl_user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tbl_products\` DROP FOREIGN KEY \`FK_b10e74872754c382e21694b9e83\``);
        await queryRunner.query(`DROP INDEX \`IDX_807409c3dbb077bc06c6b793ae\` ON \`tbl_products\``);
        await queryRunner.query(`DROP INDEX \`IDX_d9e40f786db820dbfefbdf6a07\` ON \`tbl_products\``);
        await queryRunner.query(`DROP TABLE \`tbl_products\``);
    }

}
