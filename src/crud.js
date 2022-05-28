const fs = require('fs');

/* Save the data in data.json */
function save(data){
    return new Promise((resolve, reject) => {
        fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
        });
    });
}

/**
 * Gets all teams
 * @param None
 */
function getData(){
    return new Promise((resolve, reject) => {
        fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            reject(err);
        } else {
            const json = JSON.parse(data);
            resolve(json);
        }
        });
    });
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


/**
 * Assigns a project to a team or pushs it to the waiting list
 * @param {Object} project - Object containing the project to be assigned 
 */
async function assignProject(project) {
    const data = await getData();
    const { teams, assignments, projectsWaiting } = data;

    const team = teams.find(item => item.developers >= project.devs_needed);

    if (team) {
        assignments.push({ project, team });
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
        return projectAssigned.team;
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






