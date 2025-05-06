import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.libs.js";
import {db} from '../libs/db.js'


export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user.id;
    console.log(stdin, expected_outputs, language_id, source_code);

    //Validate test cases in array format
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({
        success: false,
        message: "stdin and expected_outputs should be non-empty arrays",
      });
    }

    // Prep each test cases for judge0 batch submission
    const submission = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
      //base64_encoded: false,
      //wait: false,
    }));

    // Send the batch submission to judge0
    const submitResponse = await submitBatch(submission);

    const tokens = submitResponse.map((res) => res.token);

    const results = await pollBatchResults(tokens);

    console.log(results)

    let allTestCasesPassed = true;
    const detailedResults = results.map((res, i) => {
        const stdout = res.stdout?.trim() ;
        const expected_output = expected_outputs[i]?.trim() ;
        const passed = stdout === expected_output 

        // console.log(`Test case ${i+1}`);
        // console.log(`Input for test case #${i+1} ${stdin[i]}`)
        // console.log(`Expected Output for test case #${i+1} ${expected_output}`)
        // console.log(`Std Output for test case #${i+1} ${stdout}`)

        // console.log(`Matched for test case #${i+1}` ,passed)

        if(!passed) allTestCasesPassed = false ;

        return {
            testCase: i + 1 ,
            passed ,
            stdout ,
            expected: expected_output ,
            stderr : res.stderr || null ,
            compileOutput: res.compile_output || null ,
            status : res.status.description ,
            memory: res.memory ? `${res.memory} Kb` : undefined ,
            time: res.time ? `${res.time} seconds` : undefined  
        }
    });


    const submissions = await db.submission.create({
         data :{
            userId ,
            problemId ,
            sourceCode : source_code ,
            language : getLanguageName(language_id) ,
            stdin : stdin.join(`\n`) ,
            stdout : JSON.stringify(detailedResults.map((r)=>r.stdout)) ,
            stderr : detailedResults.some((res)=>res.stderr) ? JSON.stringify(detailedResults.map((res)=>res.stderr)) : null ,
            compileOutput : detailedResults.some((res)=>res.compile_output) ? JSON.stringify(detailedResults.map((res)=>res.compile_output)) : null ,
            status : allTestCasesPassed ? "Accepted" : "Wrong Answer" ,
            memory : detailedResults.some((res)=>res.memory) ? JSON.stringify(detailedResults.map((res)=>res.memory)) : null ,
            time : detailedResults.some((res)=>res.time) ? JSON.stringify(detailedResults.map((res)=>res.time)) : null

         }
    })

    //All test cases passed  = marked as true for current user

    if(allTestCasesPassed) {
        await db.problemSolved.upsert({
            where:{
                userId_problemId:{
                    userId ,
                    problemId
                }
            } ,
            update : { 

            },
            create :{
                userId ,
                problemId ,
            }
        })
    }

    // save individual test cases results
    const testCasesResults = detailedResults.map((res) =>({
        submissionId : submissions.id ,
        testCase: res.testCase  ,
        passed : res.passed ,
        stdout : res.stdout ,
        expected: res.expected ,
        stderr : res.stderr ,
        compileOutput: res.compile_output ,
        status : res.status ,
        memory : res.memory ,
        time : res.time

    }))

    await db.testCaseResults.createMany({
        data: testCasesResults
    })

    const submissionWithTestCase = await db.submission.findUnique({
        where:{
            id: submissions.id ,
        } ,
        include:{
            testCases: true
        }
    })

    res.status(200).json({
      success: true,
      message: "Code executed successfully",
      submission: submissionWithTestCase
    });

  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while executing code",
    });
  }
};
