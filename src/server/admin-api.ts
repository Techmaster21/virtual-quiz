import { Request, Response, Router } from 'express';

import { URI } from '../shared/uri';
import { QuestionPreparer } from './question-preparer';
import { database, questionStore } from './server';
import { Authorization } from './authorization';
import { Workbook } from 'exceljs';

/** The admin-api router */
export const router: Router = Router();

router.post(URI.QUESTIONS.SAVE, Authorization.admin, async (req: Request, res: Response) => {
  try {
    // todo return some console output
    const [questions, answers] = QuestionPreparer.prepare(req.body);
    let collection = database.collection('questions');
    // todo handle errors better
    await collection.findOneAndDelete({});
    await collection.insertOne({ questions });
    collection = database.collection('answers');
    await collection.findOneAndDelete({});
    await collection.insertOne({ answers });
    questionStore.questions = Promise.resolve(questions);
    questionStore.answers = Promise.resolve(answers);
    res.end();
  } catch (err) {
    console.error(`An error occurred while saving or parsing questions.csv: ${err.message}`);
    res.status(500).end();
  }
});

router.get(URI.TEAM.GET_ALL, Authorization.admin, async (req: Request, res: Response) => {
  try {
    const collection = database.collection('teams');
    const results = await collection.find().toArray();
    if (results === null) { // not sure if this is possible, or if in this case the promise would be rejected. Requires testing
      res.json({});
    } else {
      res.json(results);
    }
  } catch (err) {
    console.error(`An error occurred while getting the teams: ${err.message}`);
    res.status(500).end();
  }
});

router.get(URI.STATS.GET_ALL, Authorization.admin, async (req: Request, res: Response) => {
  try {
    const collection = database.collection('statistics');
    const stats = await collection.find().toArray();
    if (stats === null) { // not sure if this is possible, or if in this case the promise would be rejected. Requires testing
      res.json({});
    } else {
      const workbook = new Workbook();
      const firstTryIndexSheet = workbook.addWorksheet('First Try Indices');
      const firstTryTimeSheet = workbook.addWorksheet('First Try Times');
      const secondTryIndexSheet = workbook.addWorksheet('Second Try Indices');
      const secondTryTimeSheet = workbook.addWorksheet('Second Try Times');
      const points = workbook.addWorksheet('Points');
      const dataSheets = [firstTryIndexSheet, firstTryTimeSheet, secondTryIndexSheet, secondTryTimeSheet, points];
      dataSheets.forEach( sheet => {
        sheet.addRow([null, ...new Array(stats[0].firstTryIndex.length).fill(0).map((_, index) => `Team ${index}`)]);
      });
      stats.forEach( (stat, index) => {
        firstTryIndexSheet.addRow([`Question ${index}`, ...stat.firstTryIndex]);
        firstTryTimeSheet.addRow([`Question ${index}`, ...stat.firstTryTime]);
        secondTryIndexSheet.addRow([`Question ${index}`, ...stat.secondTryIndex]);
        secondTryTimeSheet.addRow([`Question ${index}`, ...stat.secondTryTime]);
        points.addRow([`Question ${index}`, ...stat.points]);
      });
      // set correct answers to have different style
      const answers = await questionStore.answers;
      const questions = await questionStore.questions;
      // row and column number starts at one
      firstTryIndexSheet.eachRow( (row, rowNumber) => {
        console.log(rowNumber);
        if (rowNumber !== 1 ) {
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (colNumber !== 1) {
              if (answers[rowNumber - 2].correctAnswer === questions[rowNumber - 2].answers[cell.value as number]) {
                cell.style.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00FF00'} };
              } else {
                cell.style.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0000'} };
              }
            }
          });
        }
      });
      const document = await workbook.xlsx.writeBuffer();
      res.send(document);
    }
  } catch (err) {
    console.error(`An error occurred while getting the stats: ${err.message}`);
    res.status(500).end();
  }
});

router.get(URI.ADMIN.CHECK_TOKEN, Authorization.admin, (req: Request, res: Response) => {
  res.json(true);
});
