function commentsCount(article_id, commentData) {
    //is it better to pass commentData as an argument or fetch it from here?

    let commentsCounted = 0;
        
    commentData.forEach(comment => {
        if (comment.article_id === article_id) commentsCounted++;
    });
    
    return commentsCounted;
}
  
module.exports = { commentsCount };