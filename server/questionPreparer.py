# This program assumes that the csv file is in the following form:
# Date and time, Category, question, answer A, B, C, D, E, Correct answer Letter, Initials, Witty comment
import csv, json, codecs, random, sys

def csvToJson(csvFileName):
	questions = codecs.open('questions.json', 'w', 'utf-8')
	answers = codecs.open('answers.json', 'w', 'utf-8')
	withCorrect = []
	withoutCorrect = []
	numQuestions = 0
	with open(csvFileName, 'rb') as file:
		has_header = csv.Sniffer().has_header(file.read(1024))
		file.seek(0)  # Rewind.
		reader = csv.reader(file, delimiter=',')
		if has_header:
			next(reader)  # Skip header row.
		for row in reader:
			numQuestions = numQuestions + 1
			correctAnswer = row[3 + ord(row[8]) - 65]
			questionWithoutCorrect = {
			    'category': row[1],
			    'question': row[2], 
			    'answers': [{'text': row[3]}, {'text': row[4]}, {'text': row[5]},
			        {'text': row[6]}, {'text': row[7]}]
			}
			questionWithCorrect = {
			    'category': row[1],
			    'question': row[2],
			    'answers': [{'text': row[3]}, {'text': row[4]}, {'text': row[5]},
			        {'text': row[6]}, {'text': row[7]}],
			    'correctAnswer': correctAnswer }
			withCorrect.append(questionWithCorrect)
			withoutCorrect.append(questionWithoutCorrect)
	questions.write(json.dumps(withoutCorrect, sort_keys=False, indent=4, separators=(',',': ')))
	answers.write(json.dumps(withCorrect, sort_keys=False, indent=4, separators=(',',': ')))
	return numQuestions

def randomizeQuestionsHelper(fileName, randoms, list):
	with open(fileName) as json_data:
		d = json.load(json_data)
		i = 0
		for row in d:
			list[randoms[i]] = row
			i = i + 1

def randomizeQuestions(numQuestions):
	listAnswers = [None]*numQuestions
	listQuestions = [None]*numQuestions
	randPossible = range(0, numQuestions)
	randoms = []
	for i in range(0, numQuestions):
		rand = random.choice(randPossible)
		randoms.append(rand)
		randPossible.remove(rand)
	randomizeQuestionsHelper('answers.json', randoms, listAnswers)
	randomizeQuestionsHelper('questions.json', randoms, listQuestions)
	f = codecs.open('answers.json', 'w', 'utf-8')
	f2 = codecs.open('questions.json', 'w', 'utf-8')
	f.write(json.dumps(listAnswers, sort_keys=False, indent=4, separators=(',',': ')))
	f2.write(json.dumps(listQuestions, sort_keys=False, indent=4, separators=(',',': ')))

def randomizeAnswersHelper(fileName, list):
	with open(fileName) as json_data:
		d = json.load(json_data)
		for row in d:
			indices = range(0,5)
			randoms = []
			newAnswers = []
			for i in range(0, len(indices)):
				rand = random.choice(indices)
				randoms.append(rand)
				indices.remove(rand)
				newAnswers.append(row['answers'][rand])
			for i in range(0, 5):
				row['answers'][i] = newAnswers[i]
			list.append(row)

def randomizeAnswers():
	listAnswers = []
	listQuestions = []
	randomizeAnswersHelper('answers.json', listAnswers)
	randomizeAnswersHelper('questions.json', listQuestions)
	f = codecs.open('answers.json', 'w', 'utf-8')
	f2 = codecs.open('questions.json', 'w', 'utf-8')
	f.write(json.dumps(listAnswers, sort_keys=False, indent=4, separators=(',',': ')))
	f2.write(json.dumps(listQuestions, sort_keys=False, indent=4, separators=(',',': ')))

if (len(sys.argv) != 2):
	print "Please provide one and only one command-line argument, the name of the csv file to read from. For example: "
	print "python questionPreparer.py questions.csv"
else:
	numQuestions = csvToJson(sys.argv[1])
	randomizeQuestions(numQuestions)
	randomizeAnswers()