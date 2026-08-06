import { MigrationInterface, QueryRunner } from "typeorm";

export class WarehouseSetup1785230873051 implements MigrationInterface {
    name = 'WarehouseSetup1785230873051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tbl_warehouse\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`address\` text NULL, \`lat\` decimal(10,8) NOT NULL, \`lng\` decimal(11,8) NOT NULL, \`processing_time_hours\` int NOT NULL DEFAULT '24', \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tbl_warehouse_products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`warehouse_id\` int NULL, \`product_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tbl_order\` ADD \`expected_delivery_date\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_order\` ADD \`distance_km\` decimal(10,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_order\` ADD \`warehouse_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_order\` ADD CONSTRAINT \`FK_2ed629b2a6cdc15c78375ef75ce\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`tbl_warehouse\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbl_warehouse_products\` ADD CONSTRAINT \`FK_9418d736f1cc2c0f0a6bd876d6b\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`tbl_warehouse\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbl_warehouse_products\` ADD CONSTRAINT \`FK_407f190383f2b1702dccbcf6ec3\` FOREIGN KEY (\`product_id\`) REFERENCES \`tbl_products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tbl_warehouse_products\` DROP FOREIGN KEY \`FK_407f190383f2b1702dccbcf6ec3\``);
        await queryRunner.query(`ALTER TABLE \`tbl_warehouse_products\` DROP FOREIGN KEY \`FK_9418d736f1cc2c0f0a6bd876d6b\``);
        await queryRunner.query(`ALTER TABLE \`tbl_order\` DROP FOREIGN KEY \`FK_2ed629b2a6cdc15c78375ef75ce\``);
        await queryRunner.query(`ALTER TABLE \`tbl_order\` DROP COLUMN \`warehouse_id\``);
        await queryRunner.query(`ALTER TABLE \`tbl_order\` DROP COLUMN \`distance_km\``);
        await queryRunner.query(`ALTER TABLE \`tbl_order\` DROP COLUMN \`expected_delivery_date\``);
        await queryRunner.query(`DROP TABLE \`tbl_warehouse_products\``);
        await queryRunner.query(`DROP TABLE \`tbl_warehouse\``);
    }

}
