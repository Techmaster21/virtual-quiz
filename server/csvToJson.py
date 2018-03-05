import csv, json, codecs
questions = codecs.open('questions.json', 'w', 'utf-8')
answers = codecs.open('answers.json', 'w', 'utf-8')
withCorrect = []
withoutCorrect = []
with open('questions.csv', 'rb') as csvfile:
	reader = csv.reader(csvfile, delimiter=',')
	for row in reader:
		correctAnswer = row[3 + ord(row[8]) - 65]
		questionWithoutCorrect = {
		'question': row[2],
		'category': row[1], 
		'answers': [{'text': row[3]}, {'text': row[4]}, {'text': row[5]}, {'text': row[6]}, {'text': row[7]}]
		}
		questionWithCorrect = {'question': row[2], 'category': row[1], 
		'answers': [{'text': row[3]},{'text': row[4]}, {'text': row[5]}, {'text': row[6]}, {'text': row[7]}],
		'correctAnswer': correctAnswer }
		withCorrect.append(questionWithCorrect)
		withoutCorrect.append(questionWithoutCorrect)
questions.write(json.dumps(withoutCorrect, sort_keys=False, indent=4, separators=(',',': ')))
answers.write(json.dumps(withCorrect, sort_keys=False, indent=4, separators=(',',': ')))