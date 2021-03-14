const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return res.status(201).json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const updateRepository = req.body;

  if (updateRepository.likes) {
    delete updateRepository.likes;
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex === -1) {
    return res.status(404).json({ error: "Repository not found" });
  }

  const repository = { ...repositories[repositoryIndex], ...updateRepository }

  repositories[repositoryIndex] = repository;

  return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex === -1) {
    return res.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex === -1) {
    return res.status(404).json({ error: "Repository not found" });
  }

  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1;

  return res.json({
    likes: repositories[repositoryIndex].likes,
  });
});

module.exports = app;
