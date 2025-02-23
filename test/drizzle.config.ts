import path from "path";
import { defineConfig } from "drizzle-kit";

const root = path.join(__dirname, "..");

export default defineConfig({
	out: path.join(root, "migrations"),
	schema: path.join(root, "src/schema/index.ts"),
	dialect: "sqlite",
	dbCredentials: {
		url: "test/db.sqlite",
	},
});
