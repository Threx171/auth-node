import express from "express";
import { PORT } from "./config.js";
import { UserRepository } from "./user-repository.js";

const app = express();
app.use(express.json());

app.set('view engine', 'ejs')

app.get("/", (req, res) => {
    res.render("protected");
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await UserRepository.login({ username, password })
        res.send({ user })
    } catch (error) {
        res.status(401).send(error.message)
    }
});
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const id = await UserRepository.create({ username, password });
        console.log({ username, password });
        res.send({ id });
    } catch (error) {
        // No suele ser buena idea enviar el error directamente al cliente
        res.status(400).send(error.message);
    }
});
app.post("/logout", (req, res) => { });

app.get("/protected", (req, res) => { });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
