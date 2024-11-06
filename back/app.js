const express = require('express')

const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express()
app.use(express.json());

const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/projects", projectRoutes);
app.use("/task", taskRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})