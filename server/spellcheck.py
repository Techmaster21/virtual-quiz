import json

with open('answers.json') as json_data:
    d = json.load(json_data)
    for row in d:
    	print(row['question'])