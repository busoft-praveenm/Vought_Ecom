import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateUserProfile1784110000001 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "tbl_user_profile",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "first_name", type: "varchar", isNullable: true },
                { name: "last_name", type: "varchar", isNullable: true },
                { name: "mobile_number", type: "varchar", isNullable: true },
                { name: "user_id", type: "int", isNullable: false },
                { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" }
            ]
        }), true);

        await queryRunner.createForeignKey("tbl_user_profile", new TableForeignKey({
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "tbl_user",
            onDelete: "CASCADE"
        }));

        // Migrate data
        await queryRunner.query(`
            INSERT INTO tbl_user_profile (first_name, last_name, user_id)
            SELECT first_name, last_name, id FROM tbl_user
        `);

        // Drop columns from tbl_user
        await queryRunner.dropColumn("tbl_user", "first_name");
        await queryRunner.dropColumn("tbl_user", "last_name");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("tbl_user", {
            name: "first_name",
            type: "varchar",
            isNullable: true
        } as any);
        await queryRunner.addColumn("tbl_user", {
            name: "last_name",
            type: "varchar",
            isNullable: true
        } as any);

        await queryRunner.query(`
            UPDATE tbl_user u
            JOIN tbl_user_profile p ON u.id = p.user_id
            SET u.first_name = p.first_name, u.last_name = p.last_name
        `);

        const table = await queryRunner.getTable("tbl_user_profile");
        const foreignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf("user_id") !== -1);
        await queryRunner.dropForeignKey("tbl_user_profile", foreignKey!);
        await queryRunner.dropTable("tbl_user_profile");
    }
}
