import { makeId, readJsonFile, writeJsonFile } from "./utils.service.js";

export const bugService = {
  query,
  getById,
  remove,
  save,
};

const bugs = readJsonFile("./data/bugs.json");

async function query(filterBy = {}) {
  try {
    return bugs;
  } catch (err) {
    throw err;
  }
}

async function getById(bugId) {
  try {
    const bug = bugs.find((bug) => bug._id === bugId);
    if (!bug) throw new Error(`Cannot find bug with id '${bugId}'`);
    return bug;
  } catch (err) {
    throw err;
  }
}

async function remove(bugId) {
  try {
    const bugIdx = bugs.findIndex((bug) => bug._id === bugId);
    if (bugIdx < 0) throw new Error(`Cannot find bug with id '${bugId}'`);
    bugs.splice(bugIdx, 1);
    await _saveBugsToFile();
  } catch (err) {
    throw err;
  }
}

async function save(bugToSave) {
  try {
    if (bugToSave._id) {
      const bugIdx = bugs.findIndex((bug) => bug._id === bugToSave._id);
      if (bugIdx < 0)
        throw new Error(`Cannot find bug with id '${bugToSave._id}'`);
      bugs[bugIdx] = bugToSave;
    } else {
      bugToSave._id = makeId();
      bugs.push(bugToSave);
    }
    await _saveBugsToFile();
    return bugToSave;
  } catch (err) {
    throw err;
  }
}

function _saveBugsToFile() {
  return writeJsonFile("./data/bugs.json", bugs);
}
