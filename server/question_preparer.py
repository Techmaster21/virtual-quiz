# This program assumes that the csv file is in the following form:
# Date and time, Category, question, answer A, B, C, D, E, Correct answer Letter, Initials, Witty comment
import csv, json, codecs, random, sys


def csv_to_json(file_name):
	questions = codecs.open('questions.json', 'w', 'utf-8')
	answers = codecs.open('answers.json', 'w', 'utf-8')
	with_correct = []
	without_correct = []
	num_questions = 0
	with open(file_name, 'rb') as file:
		has_header = csv.Sniffer().has_header(file.read(1024))
		file.seek(0)  # Rewind.
		reader = csv.reader(file, delimiter=',')
		if has_header:
			next(reader)  # Skip header row.
		for row in reader:
			num_questions = num_questions + 1
			correct_answer = row[3 + ord(row[8]) - 65]
			question_without_correct = {
				'category': row[1],
				'question': row[2],
				'answers': [{'text': row[3]}, {'text': row[4]}, {'text': row[5]}, {'text': row[6]}, {'text': row[7]}]
			}
			question_with_correct = {
				'category': row[1],
				'question': row[2],
				'answers': [{'text': row[3]}, {'text': row[4]}, {'text': row[5]}, {'text': row[6]}, {'text': row[7]}],
				'correctAnswer': correct_answer }
			with_correct.append(question_with_correct)
			without_correct.append(question_without_correct)
	questions.write(json.dumps(without_correct, sort_keys=False, indent=4, separators=(',',': ')))
	answers.write(json.dumps(with_correct, sort_keys=False, indent=4, separators=(',',': ')))
	return num_questions


def randomize_questions_helper(file_name, randoms, questions_list):
	with open(file_name) as json_data:
		d = json.load(json_data)
		i = 0
		for row in d:
			questions_list[randoms[i]] = row
			i = i + 1


def randomize_questions(num_questions):
	answers_list = [None] * num_questions
	questions_list = [None] * num_questions
	rand_possible = range(0, num_questions)
	randoms = []
	for i in range(0, num_questions):
		rand = random.choice(rand_possible)
		randoms.append(rand)
		rand_possible.remove(rand)
	randomize_questions_helper('answers.json', randoms, answers_list)
	randomize_questions_helper('questions.json', randoms, questions_list)
	f = codecs.open('answers.json', 'w', 'utf-8')
	f2 = codecs.open('questions.json', 'w', 'utf-8')
	f.write(json.dumps(answers_list, sort_keys=False, indent=4, separators=(',',': ')))
	f2.write(json.dumps(questions_list, sort_keys=False, indent=4, separators=(',',': ')))


def randomize_answers_helper(file_name, answers_list):
	with open(file_name) as json_data:
		d = json.load(json_data)
		for row in d:
			indices = range(0,5)
			randoms = []
			new_answers = []
			for i in range(0, len(indices)):
				rand = random.choice(indices)
				randoms.append(rand)
				indices.remove(rand)
				new_answers.append(row['answers'][rand])
			for i in range(0, 5):
				row['answers'][i] = new_answers[i]
			answers_list.append(row)


def randomize_answers():
	answers_list = []
	questions_list = []
	randomize_answers_helper('answers.json', answers_list)
	randomize_answers_helper('questions.json', questions_list)
	f = codecs.open('answers.json', 'w', 'utf-8')
	f2 = codecs.open('questions.json', 'w', 'utf-8')
	f.write(json.dumps(answers_list, sort_keys=False, indent=4, separators=(',',': ')))
	f2.write(json.dumps(questions_list, sort_keys=False, indent=4, separators=(',',': ')))


if len(sys.argv) != 2:
	print("Please provide exactly one command-line argument, the name of the csv file to read from. For example: ")
	print("python question_preparer.py questions.csv")
else:
	numQuestions = csv_to_json(sys.argv[1])
	randomize_questions(numQuestions)
	randomize_answers()