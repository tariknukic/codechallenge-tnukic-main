const express = require("express");
const router = express.Router();
const crud = require('./crud');

/*
 *** HELPER FUNCTION ***
 */
/* Handler function to wrap each route. */
function asyncHanlder(cb) {
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
router.put('/teams', asyncHanlder(async (req, res, next)=>{
    const arrayTeams = req.body;
    let requestFailed = false;

    if (arrayTeams.length > 0) {
        for (let i = 0; i < arrayTeams.length; i++) {
            if (arrayTeams[i].developers == null || arrayTeams[i].id == null) {
                requestFailed = true;
                break;
            }
        }

        if (!requestFailed) {
            await crud.updateTeams(arrayTeams);
            res.end(); 
        } else {
            res.status(400).end();
        }
    } else {
        res.status(400).end();
    }
    
}));

/* Assigning a project to a team */
router.post('/project', asyncHanlder(async (req, res, next)=>{
    const project = req.body;

    if (project.id != null && project.devs_needed != null) {
        await crud.assignProject(project);
        res.end();
    } else {
        res.status(400).end();
    }
}));


/* A project has been completed */
router.post('/completed', asyncHanlder(async (req, res, next)=>{
    const projectId = req.body.ID;

    if (req.is('application/x-www-form-urlencoded')) {
        const projectFound = await crud.findCompletedProject(projectId);

        if (projectFound) {
            res.status(200).end();
        } else {
            res.status(404).end();
        }
    } else {
        res.status(400).end();
    }
}));

/* Return team which the project is assigned to */
router.post('/assigned', asyncHanlder(async (req, res, next)=>{
    const projectId = req.body.ID;

    if (req.is('application/x-www-form-urlencoded')) {
        const teamId = await crud.findTeamForProject(projectId);

        if (teamId) {
            res.set({'Content-Type': 'text/javascript'});
            res.send(`ID=${teamId}`);
        } else {
            const projectIsWaiting = await crud.findWaitingProject(projectId);

            if (projectIsWaiting) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        }
    } else {
        res.status(400).end();
    }
}));


module.exports = router;















