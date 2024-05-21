exports.pageNotFound=(req,res,next)=>{
    const error=new Error('page is not found');
    error.status=404;
    next(error);
    console.log('error', error);

}


exports.serverErrors=(error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
}