import { loggerService } from "../../services/logger.service.js";
import {
  makeId,
  readJsonFile,
  writeJsonFile,
} from "../../services/utils.service.js";

export const bugService = {
  query,
  getById,
  remove,
  save,
};

const bugs = readJsonFile("./data/bugs.json");

async function query(filterBy = {}) {
  let filteredBugs = bugs;

  try {
    // Apply filters
    if (filterBy.title) {
      const titleRegex = new RegExp(filterBy.title, "i");
      filteredBugs = filteredBugs.filter((bug) => titleRegex.test(bug.title));
    }
    if (filterBy.severity) {
      filteredBugs = filteredBugs.filter(
        (bug) => bug.severity >= filterBy.severity
      );
    }
    if (filterBy.labels && filterBy.labels.length > 0) {
      filteredBugs = filteredBugs.filter((bug) =>
        filterBy.labels.every((label) => bug.labels.includes(label))
      );
    }

    return filteredBugs;
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
    loggerService.error(`Couldn't get cars`, err);
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
    loggerService.error(`Couldn't remove bug with id '${bugId}'`, err);
    throw err;
  }
}

async function save(bugToSave) {
  try {
    if (bugToSave._id) {
      const bugIdx = bugs.findIndex((bug) => bug._id === bugToSave._id);
      if (bugIdx < 0)
        throw new Error(`Cannot find bug with id '${bugToSave._id}'`);
      bugs[bugIdx] = { ...bugs[bugIdx], ...bugToSave };
      bugToSave = { ...bugs[bugIdx] };
    } else {
      bugToSave._id = makeId();
      bugs.push(bugToSave);
    }
    await _saveBugsToFile();
    return bugToSave;
  } catch (err) {
    loggerService.error(`Couldn't save bug with id '${bugToSave._id}'`, err);
    throw err;
  }
}

function _saveBugsToFile() {
  return writeJsonFile("./data/bugs.json", bugs);
}
