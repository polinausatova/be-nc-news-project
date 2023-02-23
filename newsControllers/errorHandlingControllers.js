exports.handlePSQL400s = (error, request, response, next) => {
    if (error.code == '22P02') {
        response.status(400).send({ msg: 'Incorrect Request' })
    } else {
        next(error);
    }
}

exports.handleCustomErrors = (error, request, response, next) => {

    if (error === 'Article Not Found') {
        response.status(404).send({ msg: error });
    } else if (error === "Article id does not exist") {
        response.status(404).send({ msg: error });
    } 
    
    else {
        next(error);
    }
}
