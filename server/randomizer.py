import json, random, codecs
list = []
list2 = []
randoms = []
f = codecs.open('randomanswers.json', 'w', 'utf-8')
f2 = codecs.open('randomquestions.json', 'w', 'utf-8')
with open('answers.json') as json_data:
    d = json.load(json_data)
    for row in d:
    	rand = random.randint(0,199)
    	randoms.append(rand)
    	list.insert(rand, row)
with open('questions.json') as json_data:
    d = json.load(json_data)
    i = 0
    for row in d:
    	list2.insert(randoms[i], row)
    	i = i + 1
f.write(json.dumps(list, sort_keys=False, indent=4, separators=(',',': ')))
f2.write(json.dumps(list2, sort_keys=False, indent=4, separators=(',',': ')))