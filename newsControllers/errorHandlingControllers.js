exports.handlePSQL400s = (error, request, response, next) => {
    console.log(error);
    if (error.code == '22P02') {
        response.status(400).send({ msg: 'Incorrect Request' })
    } else {
        next(error);
    }
}

exports.handleCustomErrors = (error, request, response, next) => {

    if (error === 'Article Not Found') {
        response.status(404).send({ msg: error });
    } else if (error === "No comments found. Either article id does not exist or there are no comments yet.") {
        response.status(404).send({ msg: error });
    } else {
        next(error);
    }
}
