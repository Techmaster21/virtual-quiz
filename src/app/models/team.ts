/** Used to store team results */
export class Team {
  /**
   * Construct a Team object
   * @param schoolName
   *  The name of the school that the competing team is from
   * @param teamNumber
   *  The number of the team from the school (in case schools have multiple teams)
   * @param timeStarted
   *  The time at which the team began the game
   * @param timeEnded
   *  The time at which the team finished the game
   * @param points
   *  The number of points the team has earned
   * @param currentQuestion
   *  The question that the team is currently on
   * @param _id
   *  The ID given by the database for the team
   */
  constructor(
    public schoolName: string,
    public teamNumber: number,
    public timeStarted?: number,
    public timeEnded?: number,
    public points?: number,
    public currentQuestion?: number,
    public _id?: string
  ) {  }
}
