DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
mongoimport --db vq --collection questions --jsonArray --maintainInsertionOrder --file "$DIR/questions.json" 
mongoimport --db vq --collection practiceQuestions --jsonArray --maintainInsertionOrder --file "$DIR/practiceQuestions.json"
