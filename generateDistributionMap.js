const fs = require("fs");
const path = require("path");

function generateDistributionMap(csvData) {
  const lines = csvData.split("\n");
  const distributionMap = {};

  for (let i = 5; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const [postcode, distributor1, distributor2, distributor3] =
        line.split(",");
      distributionMap[postcode] = [distributor1, distributor2, distributor3]
        .filter((d) => d && d !== "")
        .map((d) => d.trim());
    }
  }

  return distributionMap;
}

//if you get updated distributor files in future, you can run this script to generate the distribution map we use for the configuration builder
const csvFilePath = path.join(
  __dirname,
  "Postcode Climate Zone Distribution.csv"
);

fs.readFile(csvFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the CSV file:", err);
    return;
  }

  const distributionMap = generateDistributionMap(data);

  const jsonData = JSON.stringify(distributionMap, null, 2);

  const outputFilePath = path.join(__dirname, "data/distributionMap.json");
  fs.writeFile(outputFilePath, jsonData, "utf8", (err) => {
    if (err) {
      console.error("Error writing the JSON file:", err);
      return;
    }
    console.log(
      "Distribution map has been generated and saved to distributionMap.json"
    );
  });
});
