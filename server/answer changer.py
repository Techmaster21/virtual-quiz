import json, random, codecs
list = []
f = codecs.open('questions.json', 'w', 'utf-8')
with open('questionsOld.json') as json_data:
    d = json.load(json_data)
    for row in d:
    	newRow = row
    	lst = []
    	for answer in row['answers']:
    		lst.append({ 'text': answer})
    	newRow['answers'] = lst
    	print newRow
    	list.append(newRow)
f.write(json.dumps(list, sort_keys=False, indent=4, separators=(',',': ')))