import { Post } from "@src/schema/types";

export class CategorySelecter {
	private readonly medium: Post["media"][] = [
		"hatena",
		"note",
		"qiita",
		"sizu",
		"zenn",
	];

	public readonly value: Post["media"][] | undefined;

	constructor(media: Post["media"] | undefined, useSecret: boolean) {
		this.value = this.calcValue(media, useSecret);
	}

	private calcValue(
		media: Post["media"] | undefined,
		useSecret: boolean,
	): Post["media"][] | undefined {
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
			return undefined;
		}

		if (!media && !useSecret) {
			return this.medium.filter((m) => m !== "sizu");
		}

		throw new Error("Never category select.");
	}
}
