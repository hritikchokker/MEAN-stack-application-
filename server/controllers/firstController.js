const fetch = require('node-fetch');

exports.getAllData = (req,res)=>{

    fetch('https://jsonplaceholder.typicode.com/posts')
    .then(result=>result.json())
    .then(resp=>{
        if(resp){
            res.status(200).json({
                message:'data fetched successfully',
                data: resp
            })
        }
    }).catch(error=>{
        res.status(400).json({
            message:'something went wrong whie fetching the list',
            error
        })
    })

}
exports.getDetails = (req,res)=>{
    
    fetch('https://jsonplaceholder.typicode.com/posts/2')
        .then(result=> result.json())
        .then(resp => {
            if (resp) {
                res.status(200).json({
                    message: 'data fetched successfully',
                    data: resp
                })
            }
        }).catch(error => {
            res.status(400).json({
                message: 'something went wrong',
                error
            })
        })
}