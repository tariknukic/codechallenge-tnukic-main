function calculateIdleDevelopersIn(assignments, team) {
    let numOfOccupiedDevs = 0

    if (assignments.length > 0) {
        numOfOccupiedDevs = assignments.filter(assignment => assignment.team.id == team.id).reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        }, 0);
    }
    
    return team.developers - numOfOccupiedDevs;
}

function findFreeTeam(teams, assignments, project) {
    let team = null; 

    for (let i = 0; i < teams.length; i++) {
        team = teams[i];

        if (calculateIdleDevelopersIn(assignments, team) >= project.devs_needed) {
            break;
        }

        if (i == teams.length - 1) {
            team = null;
        }
    }

    return team;
}

module.exports = {
    findFreeTeam
}