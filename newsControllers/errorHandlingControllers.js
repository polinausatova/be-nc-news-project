exports.handlePSQL400s = (error, request, response, next) => {
    if (error.code === '22P02') {
        response.status(400).send({ msg: 'Incorrect Request' });
    } else {
        next(error);
    }
}

exports.handleCustomErrors = (error, request, response, next) => {
    if (error === 'Could not find (the topic)') {
        response.status(404).send({ msg: 'Requested Not Found' });
    } else {
        next(error);
    }
}

exports.handle500Statuses = (error, request, response, next) => {
    console.log(error);
    response.status(500).send({ msg: 'Some server error IDK' });
}
