const fs = require('fs').promises;

/* Save the data in data.json */
async function save(data){
    await fs.writeFile('data.json', JSON.stringify(data, null, 2));
}

async function dbExists(path) {
    try {
        await fs.stat(path);
        return true;
    } catch {
        return false;
    }
}

async function initDb(path) {
    const empty_db = { teams: [], assignments: [], projectsWaiting: [] };
    await fs.writeFile(path, JSON.stringify(empty_db));
}

/**
 * Gets all teams
 * @param None
 */
async function getData(){
    if (!await dbExists("data.json")) {
        await initDb("data.json");
    }

    const data = await fs.readFile('data.json', 'utf8');
    return JSON.parse(data);
}

/**
 * Updates the list of teams 
 * @param {Array} newTeams - An array containing the new teams
 */
async function updateTeams(newTeams){
    const data = await getData();

    data.teams = newTeams;
    data.assignments = [];
    data.projectsWaiting = []; 

    await save(data);
}

async function calculateIdleDevelopersFor(team) {
    const data = await getData();
    const assignments = data.assignments;
    let allDevs = 0;

    if (assignments.length > 0) {
        assignments.forEach(assignment => {
            if (team.id == assignment.team.id) {
                allDevs += assignment.project.devs_needed;
            }
        });
    }
    
    return team.developers - allDevs;
}


/**
 * Assigns a project to a team or pushs it to the waiting list
 * @param {Object} project - Object containing the project to be assigned 
 */
async function assignProject(project) {
    const data = await getData();
    const { teams, assignments, projectsWaiting } = data;
    let team = null;

    for (let i = 0; i < teams.length; i++) {
        team = teams[i];

        if (await calculateIdleDevelopersFor(team) >= project.devs_needed) {
            break;
        }

        if (i == teams.length - 1) {
            team = null;
        }
    }
    

    if (team) {
        assignments.push({ project, team });

        const indexOfWaitingProject = projectsWaiting.findIndex(item => item.id == project.id);

        if (indexOfWaitingProject !== -1) {
            projectsWaiting.splice(indexOfWaitingProject, 1);
        }
    } else {
        projectsWaiting.push(project);
    }

    await save(data);
}


/**
 * Find the team assigned to the given project 
 * @param {Integer} ID - ID of the given project 
 */
 async function findTeamForProject(projectId) {
    const data = await getData();
    const { assignments } = data;
    
    const projectAssigned = assignments.find(item => item.project.id == projectId);
    if (projectAssigned) {
        return projectAssigned.team.id;
    } else {
        return null;
    }
}

/**
 * Find the project if it is waiting
 * @param {Integer} ID - ID of the given project 
 */
 async function findWaitingProject(projectId) {
    const data = await getData();
    const { projectsWaiting } = data;
    
    const projectWaiting = projectsWaiting.find(item => item.id == projectId);
    if (projectWaiting) {
        return true;
    } else {
        return false;
    }
}

async function assignWaitingProject() {
    const { projectsWaiting } = await getData();

    projectsWaiting.forEach(async (project) => {
        await assignProject(project);
    });
}

/**
 * Check if the completed project is already assigned 
 * @param {Integer} ID - ID of the completed project 
 */
 async function findCompletedProject(projectId) {
    const data = await getData();
    const { assignments, projectsWaiting } = data;
    
    const indexOfAssignedProject = assignments.findIndex(item => item.project.id == projectId);
    const indexOfWaitingProject = projectsWaiting.findIndex(item => item.id == projectId);

    if (indexOfAssignedProject !== -1) {
        assignments.splice(indexOfAssignedProject, 1);
        await save(data);
        await assignWaitingProject();
        return true;
    } else if (indexOfWaitingProject !== -1) {
        projectsWaiting.splice(indexOfWaitingProject, 1);
        await save(data);
        return true;
    } else {
        return false;
    }
}



module.exports = {
    updateTeams,
    assignProject,
    findTeamForProject,
    findWaitingProject,
    findCompletedProject
}






