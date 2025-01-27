const { MongoClient } = require("mongodb");


const mongoUrl = "mongodb://127.0.0.1:27017"; 
const dbName = "questionsDB"; 

async function addSampleQuestion() {
  const client = new MongoClient(mongoUrl);
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("questions");

    const sampleQuestion = {
      type: "multiple-choice",
      title: "Which of the following is a correct way to declare a variable in JavaScript?",
      options: ["let x = 10;", "var x == 10;", "const = x 10;", "let = x: 10;"],
      correctAnswer: "let x = 10;",
    };

    const result = await collection.insertOne(sampleQuestion);
    console.log(`Inserted sample question with ID: ${result.insertedId}`);
  } catch (error) {
    console.error("Error adding sample question:", error);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

addSampleQuestion();
