import { renderToString } from "react-dom/server";
import path from "path";
import express from 'express';

const app = express();
const port = 3000;

type Todo = { id: number; name: string };
const todos: Todo[] = [];

app.use(express.static(import.meta.dir));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(import.meta.dir, './index.html'));
});

app.get("/todos", (req, res) => {
    res.send(renderToString(<TodoList todos={todos} />));
})

app.post("/todos", (req, res) => {
    const { todo } = req.body;
    todos.push({ id: todos.length + 1, name: todo, });
    res.send(renderToString(<TodoList todos={todos} />));
});

app.delete("/todos", (req, res) => {
    const index = todos.findIndex(obj => obj.id === parseInt(req.query.id as string));
    if (index !== -1) {
        todos.splice(index, 1);
        res.send();
    }
    else {
        res.status(400).send();
    }
})

function TodoList(props: { todos: Todo[] }) {
    return (
        <ul>
            {props.todos.length ? props.todos.map((todo) => (
                <li id={`todo-${todo.id}`} key={`todo-${todo.id}`}>
                    {todo.name}<button hx-trigger="click" hx-swap="outerHTML" hx-target={`#todo-${todo.id}`} hx-delete={`/todos?id=${todo.id}`}>x</button>
                </li>
            )) : "No todos found"}
        </ul>
    );
}

app.listen(port, '0.0.0.0', () => {
    console.log('Server started at http://localhost:' + port);
});