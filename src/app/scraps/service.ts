import { Octokit } from "@octokit/rest";

export class ScrapService {
  constructor(
    private octokit: Octokit,
    private owner: string,
    private repo: string,
  ) {}

  public async list() {
    const { data } = await this.octokit.rest.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path: "scraps",
    });

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .filter((d) => d.type === "file")
      .map((d) => ({
        filename: d.name,
        createdAt: this.toDate(d.name),
      }));
  }

  public async retrieve(filename: string) {
    const { data } = await this.octokit.rest.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path: `scraps/${filename}`,
    });

    if (Array.isArray(data)) {
      return null;
    }

    if (data.type !== "file") {
      return null;
    }

    return {
      filename: data.name,
      content: Buffer.from(data.content, "base64").toString("utf-8"),
      createdAt: this.toDate(data.name),
    };
  }

  private toDate(filename: string) {
    const [unixtime] = filename.split(".");
    return new Date(Number(unixtime));
  }
}
