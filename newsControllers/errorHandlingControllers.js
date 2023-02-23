exports.handlePSQL400s = (error, request, response, next) => {
    
    if (error.code == '22P02') {
        response.status(400)
        .send({ msg: 'Incorrect Request' })

    } else {
        next(error);
    }
}

exports.handlePSQL235s = (error, request, response, next) => {
   
    if (error.code == '23502') {
        response.status(400)
        .send({ msg: 'Invalid input' })
    } 
        else if (error.code == '23503') {
        response.status(400)
        .send({ msg: 'User is not registered' })
        }
            else {
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