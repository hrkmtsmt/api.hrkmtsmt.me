import { basicAuth } from "hono/basic-auth";
import { AppHandler } from "@src/types";

export const handler: AppHandler = (c, next) => {
	const handler = basicAuth({
		username: c.env.BASIC_AUTH_USERNAME,
		password: c.env.BASIC_AUTH_PASWORD
	});
	
	return handler(c, next);
};