import json

MASTER_PATH = 'react-voice-actors\src\data\MasterV3.json'
master_json = open(MASTER_PATH, 'r', encoding='utf8')
master_string = master_json.read()
parsed_master = json.loads(master_string)


####    WRITE TO tempACTORS
f = open('tempActors.csv', 'w')

for i in parsed_master["actors"] :
    row = ""
    curr = parsed_master["actors"][i]
    row = str(curr["actorID"]) + "|" + curr["name"] + "|" + str(curr["favs"]) + "|" + curr["img"] + "\n"
    f.write(row)

f.close()



####    WRITE TO tempROLES
f = open('tempRoles.csv', 'w', encoding="utf-8")

for i in parsed_master["actors"] :
    # print ("i ", i)
    currID = parsed_master["actors"][i]["actorID"]
    for k in parsed_master["actors"][i]["roles"] :
        curr = parsed_master["actors"][i]["roles"][k]
        # print("k ", curr)
        for p in curr["showIDs"] :
            # print(str(p))
            row = str(curr["charID"]) + "|" + curr["character"] + "|" + str(curr["fav"]) + "|" + curr["img"] + "| " + str(currID) + "| " + str(p) + "\n"
            f.write(row)
f.close()


####    WRITE TO tempANIME
# f = open('tempAnime.csv', 'w', encoding="utf-8")

# for i in parsed_master["shows"] :
#     curr = parsed_master["shows"][i]
#     # if curr["title"].contains(",") :
#     #     title = curr["title"].replace(',', '')
#     # else :
#     #     title = curr["title"]
#     row = str(curr["showID"]) + "|" + curr["title"] + "|" + str(curr["img"]) + "\n"
#     f.write(row)
# f.close()

####    WRITE TO tempOP     INCOMPLETE!!!!
# f = open('tempOP.csv', 'w', encoding="utf-8")

# for i in parsed_master["OPs"]["artists"] :
#     print(parsed_master["OPs"]["artists"][i])
#     curr = parsed_master["OPs"]["artists"][i]
#     for k in curr[]
#     row = str(curr["showID"]) + "|" + curr["title"] + "|" + str(curr["img"]) + "\n"
#     f.write(row)
# f.close()