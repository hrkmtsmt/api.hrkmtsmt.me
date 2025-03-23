export class Pagination {
  public readonly pages: number;

  public readonly next: number | null;

  constructor(dataSize: number, dataLimit: number, currentPage: number) {
    this.pages = this.calcPages(dataSize, dataLimit);
    this.next = this.calcNext(currentPage, this.pages);
  }

  private calcPages(dataSize: number, dataLimit: number) {
    return Math.ceil(dataSize / dataLimit);
  }

  private calcNext(currentPage: number, totalPages: number) {
    const next = currentPage + 1;
    return next > totalPages ? null : next;
  }
}
