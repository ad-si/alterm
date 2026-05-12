import express, { type Request, type Response } from "express"

const app = express()

app.get("/:id", (request: Request, response: Response) => {
  response.send(`${request.params.id} - description`)
})

app.listen(3000)
