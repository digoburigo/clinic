
import { CID_LIST } from "../data/listacid";
import { db } from "~/server/db";


async function main() {
	console.info("Seeding...");

	await db.cid.createMany({
		data: CID_LIST,
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		console.log("Database seeded successfully");
		await db.$disconnect();
	});

