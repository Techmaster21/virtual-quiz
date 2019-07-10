/** The URIs for all the various http requests. Used by both the server and the client */
export const URI = {
  PRACTICE_QUESTIONS: {
    GET: '/api/practiceQuestions/get',
    CHECK: '/api/practice/check',
  },
  QUESTIONS: {
    GET: '/api/questions/get',
    SAVE: '/api/questions/save',
    DELETE: '/api/questions/delete'
  },
  ANSWER: {
    CHECK: '/api/answer/check'
  },
  TEAM: {
    GET: '/api/team/get',
    GET_ALL: '/api/team/get_all',
    SAVE: '/api/team/save'
  },
  DATE: {
    NOW: '/api/date/now',
    START: '/api/date/start',
    CAN_START: '/api/date/canStart'
  },
  ADMIN: {
    LOGIN: '/api/admin/login'
  },
  STATS: {
    QUESTIONS: '/api/stats/questions'
  }
};
