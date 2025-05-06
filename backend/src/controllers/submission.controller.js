import {db} from '../libs/db.js'

export const getAllSubmission = async (req,resp) =>{
    try {
         const userId = req.user.id ;

         const submission = await db.submission.findMany({
            where : {
                userId : userId
            }
         })

         resp.status(200).json({
            success: true,
            message: "Your submission",
            submissions: submission
          });

    } catch (error) {
        resp.status(401).json({
            success: true,
            message: "Something went wrong while getting submission",
          });
    }
}


export const getSubmissionForProblem = async(req,resp) =>{  
        try {
            const userId = req.user.id ;
            const problemId = req.params.problemId ;
            const getSubmissionByProblemId = await db.submission.findMany({
                where : {
                    userId : userId ,
                    problemId: problemId 
                }
             })
             resp.status(200).json({
                success: true,
                message: "Submission fetched successfully",
                submissions: getSubmissionByProblemId
              });

        } catch (error) {
            resp.status(401).json({
                success: true,
                message: "Something went wrong while getting submission by id",
              });
        }

}


export const getSubmissionCount = async(req,resp) =>{  
    try {
        const problemId = req.params.problemId ;
     
        const getSubmissionCount = await db.submission.count({
            where : {
                problemId: problemId 
            }
         })
         resp.status(200).json({
            success: true,
            message: "Submission count fetched successfully",
            count: getSubmissionCount
          });

    } catch (error) {
        resp.status(401).json({
            success: true,
            message: "Something went wrong while getting submission count",
          });
    }

}

