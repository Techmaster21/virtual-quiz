/**
 * Used to store Team Results in database
 */
export class Result {
  constructor(
    public schoolName: string,
    public team: number,
    public timeStarted?: number,
    public timeEnded?: number,
    public points?: number,
    public _id?: string
  ) {  }
}
