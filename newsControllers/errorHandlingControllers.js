exports.handlePSQL400s = (error, request, response, next) => {
    console.log(error);
    if (error.code == '22P02') {
        response.status(400)
        .send({ msg: 'Incorrect Request' })
        .catch((err) => {
            next(err);
        });
    } else {
        next(error);
    }
}

exports.handleCustomErrors = (error, request, response, next) => {

    if (error === 'Article Not Found') {
        response.status(404).send({ msg: error });

    } else {
        next(error);
    }
}
