const express = require("express");
const routes = require('./routes');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

/* *** ERROR HANDLING *** */
/* 404 handler - if requested route does not exist */
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

/* Global error handler */
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});


/* Listening on port 3000 */
app.listen(3000, () => {
    console.log("Server running on port 3000");
});








