const fs = require("fs");

function get_data() {
  return JSON.parse(fs.readFileSync("close.json", "utf8"));
}

var json = get_data();

for (d in json.bpi) {
    console.log(json.bpi[d]);
}