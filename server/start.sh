DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
screen -d -m mongod --dbpath="$DIR/data" &
while getopts ":i" opt; do
  case $opt in
    i)
      sh "$DIR/initDB.sh"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done
node "$DIR/index.js"
