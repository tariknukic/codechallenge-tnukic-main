# Project Management Service Challenge

Design/implement a system to manage projects an developers.

At DCCS we provide the service of engineering custom software.  
We are doing this in small but stable teams. Every project is always handled by a single team, but a team can handle multiple projects at once.

You have been assigned to build the project management service that will be used to assign projects to teams.

We have teams of different sizes, they can contain of 4, 5 or 6 developers.

Customers request projects that need 1 to 6 developers to develop. A project must be handled by a single team.
You can assign any project to any team that has enough idle developers.
If it's not possible to assign the project, the customer has to wait until there is a team available for her.
Once a team is available for a project that is waiting, the project should be assigned to the team.

Once a project is assigned, it will be developed until it is finished, you cannot assign the project to a different team.

Projects should be assigned as fast as possible.

## Evaluation rules

This challenge has a partially automated testing system. This means that before
it is seen by the evaluators, it should pass a series of automated checks.

- Everytime you push your code to Github, it will trigger a CI workflow. You can see this in "Actions". 
- This workflow builds and tests your code using Docker (you have to write a working Dockerfile).
- Your goal is to make the CI workflow pass (i.e. "green").
- If the CI workflow fails, check for the reason and fix the cause.

### Important

- The `build-n-test` job in `build.yml` should pass in main before you submit your solution. **This job needs to run without modification**.

## API

To simplify the challenge and remove language restrictions (yes, you can use whatever programming language you like best), 
this service must provide a REST API which will be used to interact with it.

This API must comply with the following contract:

### GET /status

Indicate the service has started up correctly and is ready to accept requests.

Responses:
- **200 OK** When the service is ready to receive requests.

### PUT /teams

Load the list of available teams in the service and remove all previous data (existing teams and projects).
This method may be called more than once during the life cycle of the service.

**Body** _required_ The list of teams to load.

**Content Type** `application/json`

Sample:

```json
[
  {
    "id": 1,
    "developers": 5
  },
  {
    "id": 2,
    "developers": 4
  }
]
```

Responses:
- **200 OK** When the list is registered correctly
- **400 Bad Request** When there is a failure in the request.

### POST /project

A project needs to be assigned to a team.

**Body** _required_ The project, that needs to be assigned to a team.

**Content Type** `application/json`

Sample:

```json
{
  "id": 1,
  "devs_needed": 3
}
```

Responses:

- **200 OK** When the project is assigned correctly.
- **400 Bad Request** When there is a failure in the request format.

### POST /completed

A project has been completed. Whether it has been started or not.

**Body** _required_ A form with the project ID, such that `ID=X`

**Content Type** `application/x-www-form-urlencoded`

- **200 OK** When the project is assigned correctly.
- **404 Not found** When the project was not found.
- **400 Bad Request** When there is a failure in the request format.

### POST /assigned

Given a project ID 'ID=x', return the team the project is assigned to, or no team if the project is waiting to be assigned.

**Body** _required_ A form with the project ID, such that `ID=X`

**Content Type** `application/x-www-form-urlencoded`

- **200 OK** With the team as payload when the project is assigned to a team.
- **204 No Content** When the project is waiting for an assignment.
- **404 Not found** When the project was not found.
- **400 Bad Request** When there is a failure in the request format.

## Tooling

For this codechallenge we use Github and Github Actions.  
In this repo you may find a [build.yml](./.github/workflows/build.yml) file which contains
some tooling that simplifies the setup and testing of the deliverable.
Note that the Docker image build should be reproducible within the CI environment.

Additionally, you will find a basic Dockerfile which you could use as a baseline, be sure to modify it as 
much as needed, but keep the exposed port as is to simplify the testing.

You are free to modify the repository as much as necessary to include or remove dependencies, but please document these decisions in this very README adding sections to it,
 the same way you would be generating documentation for any other deliverable.  

> We want to see how you operate in a (quasi) real work environment.

The challenge needs to be self-contained so we can evaluate it (if you need a database, include it in the repo, ...).

We prepared a minimal setup for Node.js and Javascript and Docker, so that you can concentrate on the coding and can leave the infrastructural part out (if you like Javascript and Node.js).
But you can choose any programming language you like;
**Just make sure the github CI workflow passes.**

> Happy coding!
