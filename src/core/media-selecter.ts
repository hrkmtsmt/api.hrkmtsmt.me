import { Post } from "@schema/types";

export class MediaSelecter {
	private readonly medium: Post["media"][] = [
		"hatena",
		"note",
		"qiita",
		"sizu",
		"zenn",
	];

	public readonly value: Post["media"][] | "all";

	constructor(media: Post["media"] | undefined, useSecret: boolean) {
		this.value = this.calcValue(media, useSecret);
	}

	private calcValue(
		media: Post["media"] | undefined,
		useSecret: boolean,
	): Post["media"][] | "all" {
		if (media === "sizu" && !useSecret) {
			throw new Error("Invalid category select.");
		}

		if (media === "sizu" && useSecret) {
			return ["sizu"];
		}

		if (media) {
			return [media];
		}

		if (!media && useSecret) {
			return "all";
		}

		if (!media && !useSecret) {
			return this.medium.filter((m) => m !== "sizu");
		}

		throw new Error("Never category select.");
	}
}
