
import { PrismaClient } from "@prisma/client";
import { CID_LIST } from "../data/listacid";

const prisma = new PrismaClient();

async function main() {
	console.info("Seeding...");

	await prisma.cid.createMany({
		data: CID_LIST,
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => {
		void prisma.$disconnect();
	});
