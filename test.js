const firebase = require("@firebase/rules-unit-testing");
const fs = require("fs");
const http = require("http");

const PROJECT_ID = "eatwell-87d0c";
const COVERAGE_URL = `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}:ruleCoverage.html`;
const COVERAGE_FILE = 'firestore-coverage.html';

function getAuthedFirestore(auth) {
  return firebase
    .initializeTestApp({ projectId: PROJECT_ID, auth })
    .firestore();
}

beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId: PROJECT_ID });
});

before(async () => {
  const rules = fs.readFileSync("firestore.rules", "utf8");
  await firebase.loadFirestoreRules({ projectId: PROJECT_ID, rules });
});

after(async () => {
  await Promise.all(firebase.apps().map((app) => app.delete()));

  const fstream = fs.createWriteStream(COVERAGE_FILE);
  await new Promise((resolve, reject) => {
      http.get(COVERAGE_URL, (res) => {
        res.pipe(fstream, { end: true });

        res.on("end", resolve);
        res.on("error", reject);
      });
  });

  console.log(`View firestore rule coverage information at ${COVERAGE_FILE}\n`);
});

describe("My app", () => {
  
});

