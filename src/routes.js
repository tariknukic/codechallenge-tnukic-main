const express = require("express");
const router = express.Router();
const crud = require('./crud');


/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async(req, res, next) => {
        try {
            await cb(req, res, next);
        } catch(err) {
            next(err);
        }
    }
}


/* Service has started up correctly and is ready to accept requests */
router.get("/status", (req, res, next) => {
    res.send("OK");
});

/* Update the list of teams */
router.put('/teams', asyncHandler(async (req, res, next)=>{
    const teams = req.body;
 
    if (teams.length === 0 || teams.some(team => team.developers == null || team.id == null)) {
        res.status(400).end();
        return;
    }

    await crud.updateTeams(teams);
    res.end();
}));

/* Assigning a project to a team */
router.post('/project', asyncHandler(async (req, res, next)=>{
    const project = req.body;

    if (project.id != null && project.devs_needed != null) {
        await crud.assignProject(project);
        res.end();
    } else {
        res.status(400).end();
    }
}));


/* A project has been completed */
router.post('/completed', asyncHandler(async (req, res, next)=>{
    const projectId = req.body.ID;

    if (req.is('application/x-www-form-urlencoded')) {
        const projectFound = await crud.findCompletedProject(projectId);

        const status = projectFound ? 200 : 404;
        res.status(status).end();
    } else {
        res.status(400).end();
    }
}));

/* Return team which the project is assigned to */
router.post('/assigned', asyncHandler(async (req, res, next)=>{
    const projectId = req.body.ID;

    if (!req.is('application/x-www-form-urlencoded')) {
        res.status(400).end();
        return;
    }

    const teamId = await crud.findTeamForProject(projectId);

    if (teamId) {
        res.set({'Content-Type': 'text/javascript'});
        res.send(`ID=${teamId}`);
    } else {
        const projectIsWaiting = await crud.findWaitingProject(projectId);

        const status = projectIsWaiting ? 204 : 404;
        res.status(status).end();
    }
    
}));


module.exports = router;