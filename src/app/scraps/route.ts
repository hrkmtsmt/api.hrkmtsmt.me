import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { Pagination } from "@core";
import { Logger } from "@modules";
import { ScrapService } from "./service";
import type { BlankSchema } from "hono/types";
import type { Env } from "@types";

export const scraps = new Hono<Env, BlankSchema, "/">()
  .get("/scraps", async (c) => {
    try {
      const page = Number(c.req.query("page")) || 1;
      const limit = Number(c.req.query("limit")) || 12;
      const offset = (page - 1) * limit;

      const service = new ScrapService(
        c.var.octokit,
        c.env.SECRET_GITHUB_OWNER,
        c.env.SECRET_GITHUB_REPO,
      );
      const data = await service.list();
      const { pages, next } = new Pagination(data.length, limit, page);

      return c.json(
        { data: data.slice(offset, page * limit), pages, next },
        200,
      );
    } catch (error: unknown) {
      Logger.error(error);
      if (error instanceof Error) {
        throw new HTTPException(422, { message: error.message });
      }

      throw new HTTPException(500, { message: "Failed to fetch scraps." });
    }
  })
  .get("/scraps/:filename", async (c) => {
    try {
      const filename = c.req.param("filename");

      const service = new ScrapService(
        c.var.octokit,
        c.env.SECRET_GITHUB_OWNER,
        c.env.SECRET_GITHUB_REPO,
      );
      const data = await service.retrieve(filename);

      if (!data) {
        throw new HTTPException(404, { message: "Not found." });
      }

      return c.json({ data }, 200);
    } catch (error: unknown) {
      Logger.error(error);
      if (error instanceof HTTPException) {
        throw error;
      }

      if (error instanceof Error) {
        throw new HTTPException(422, { message: error.message });
      }

      throw new HTTPException(500, { message: "Failed to fetch scrap." });
    }
  });
