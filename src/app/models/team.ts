/**
 * Used to store Team Results in database
 */
export class Team {
  constructor(
    public schoolName: string,
    public teamNumber: number,
    public timeStarted?: number,
    public timeEnded?: number,
    public points?: number,
    public currentQuestion?: number,
    public token?: string,
    public _id?: string
  ) {  }
}
