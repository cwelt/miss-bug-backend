import { bugService } from "./bug.service.js";
import { loggerService } from "../../services/logger.service.js";

export async function getBugs(req, res) {
  // sample query for filtering bugs: {{BASE_URL}}?labels=backend,medium&title=token&severity=2
  const { title, description, severity, labels } = req.query;
  const filterBy = {
    title,
    description,
    severity: +severity,
    labels: labels ? labels.split(",") : [],
  };

  try {
    const bugs = await bugService.query(filterBy);
    res.send(bugs);
  } catch (err) {
    loggerService.error(`Couldn't get bugs`, err);
    res.status(400).send(`Couldn't get bugs`);
  }
}

export async function getBug(req, res) {
  const { bugId } = req.params;
  try {
    const bug = await bugService.getById(bugId);
    res.send(bug);
  } catch (err) {
    loggerService.error(`Couldn't get bug ${bugId}`, err);
    res.status(400).send(`Couldn't get bug with id: ${bugId}`);
  }
}

export async function removeBug(req, res) {
  const { bugId } = req.params;
  try {
    await bugService.remove(bugId);
    res.status(204).send(`Bug ${bugId} Removed successfully`);
  } catch (err) {
    loggerService.error(`Couldn't remove bug ${bugId}`, err);
    res.status(400).send(`Couldn't remove bug with id: ${bugId}`);
  }
}

export async function createBug(req, res) {
  const { title, description, severity, createdAt, labels } = req.body;

  try {
    const bugToSave = {
      title,
      description,
      severity,
      createdAt: createdAt || Date.now(),
      labels: labels || [],
    };
    const savedBug = await bugService.save(bugToSave);
    res.status(201).send(savedBug);
  } catch (err) {
    loggerService.error(`Couldn't save bug ${bugToSave._id}`, err);
    res.status(400).send(`Couldn't save bug with id: ${bugToSave._id}`);
  }
}

export async function updateBug(req, res) {
  const { bugId } = req.params;
  const { title, description, severity, labels } = req.body;
  const bugToSave = {
    _id: bugId,
    title,
    description,
    severity,
    labels,
  };

  try {
    const savedBug = await bugService.save(bugToSave);
    res.send(savedBug);
  } catch (err) {
    loggerService.error(`Couldn't save bug ${bugToSave._id}`, err);
    res.status(400).send(`Couldn't save bug with id: ${bugToSave._id}`);
  }
}
