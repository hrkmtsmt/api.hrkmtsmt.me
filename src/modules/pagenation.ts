export class Pagenation<T extends any[]> {
  public readonly pages: number;

  public readonly next: number | null;

  constructor(total: number, limit: number, offset: number) {
    this.pages = this.calcPages(total, limit);
    this.next = this.calcNext(offset, this.pages);
  }

  private calcPages(total: number, limit: number) {
    return Math.ceil(total / limit);
  }

  private calcNext(current: number, pages: number) {
    const next = current + 1;
    return next > pages ? null : next;
  }
}
