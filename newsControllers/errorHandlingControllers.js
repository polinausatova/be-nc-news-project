exports.handle400s = (error, request, response, next) => {
    
    if (error.code === '22P02' || error.code == '23502') {
        response.status(400)
        .send({ msg: 'Bad Request' })
    } else {
        next(error);
    }
}

exports.handle404s = (error, request, response, next) => {

    if (error === 'Article Not Found') {

        response.status(404).send({ msg: error });
    } 
    else if (error.code == '23503') {
        response.status(404)
        .send({ msg: 'User not found' })
    }
    else {
        next(error);
    }
}
