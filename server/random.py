import json

list = []
with open('answers.json') as json_data:
    d = json.load(json_data)
    for row in d:
    	list.insert(randint(0,199), row)
for row in list:
	pprint(row);