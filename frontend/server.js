const express = require("express");
const bodyParser = require("body-parser");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = __dirname + "/../proto/search.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const searchProto = grpc.loadPackageDefinition(packageDefinition).search;

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

const client = new searchProto.SearchService("localhost:50051", grpc.credentials.createInsecure())

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.post("/search", (req, res) => {
  const { query, page = 1 } = req.body
  const pageSize = 10

  if (!query.trim() || query.length < 5) {
    res.json({ questions: [], totalResults: 0 })
    return
  }

  client.Search({ query, page: Number.parseInt(page), pageSize }, (err, response) => {
    if (err) {
      console.error("gRPC error:", err)
      res.status(500).json({ error: "An error occurred while searching" })
      return
    }
    console.log("Frontend server gRPC response:", JSON.stringify(response, null, 2)) 
    res.json(response)
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`)
})

