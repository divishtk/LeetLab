import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.libs.js";

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    testCases,
    examples,
    constraints,
    codeSnippets,
    refrenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "You are not authorized to create a problem",
    });
  }

  try {
    for (const [langauge, solutioncode] of Object.entries(refrenceSolutions)) {
      const langaugeID = getJudge0LanguageId(langauge);

      if (!langaugeID) {
        return res.status(400).json({
          message: `Language ${langauge} is not supported`,
        });
      }

      const submissions = testCases.map(({ input, output }) => ({
        language_id: langaugeID,
        source_code: solutioncode,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      console.log("Submission Results", submissionResults);

      const token = submissionResults.map((result) => result.token);

      const results = await pollBatchResults(token);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result-------", results);
        if (result.status.id !== 3) {
          return res.status(400).json({
            message: `Test case ${
              i + 1
            } failed for language ${langauge} with status ${
              result.status.description
            }`,
          });
        }
      }

      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          testCases,
          examples,
          constraints,
          codeSnippets,
          refrenceSolutions,
          userId: req.user.id,
        },
      });

      return res.status(201).json({
        message: "Problem created successfully",
        problem: newProblem,
      });

    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const getProblem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!getProblem) {
      return res.status(404).json({
        message: `Problem not found with id ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      problem: getProblem,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Problem fetching problem",
      error: error.message,
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const getAllProblems = await db.problem.findMany();

    if (!getAllProblems) {
      return res.status(404).json({
        message: "No problems found",
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "All problems fetched successfully",
      problems: getAllProblems,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Problem fetching all problems",
      error: error.message,
    });
  }
};

export const updateProblemById = async(req, res) => {
  try {
    const {id} = req.params;
    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testCases,
      codeSnippets,
      referenceSolutions
    } = req.body;

    const problem = await db.problem.findUnique({
      where: {
        id
      }
    });

    if(!problem) {
      return res.status(404).json({
        error: "Problem not Found using ID!!"
      })
    }


    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Unsupported language: ${language}` });
      }

      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Validation failed for ${language} on input: ${submissions[i].stdin}`,
            details: result,
          });
        }
      }
    }

    const updatedProblem = await db.problem.update({
      where: { id },
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testCases,
        codeSnippets,
        referenceSolutions,
      },
    });

    res.status(200).json({
      success: true,
      message: "Problem Updated Successfully using ID...",
      problem: updatedProblem,
    });

  } catch (error) {
    console.error("Error Updating Problem using ID:", error);
    res.status(500).json({
      error: "Error Updating Problem using ID!!"
    });
  }
}

export const deleteProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    // if (req.user.role !== "ADMIN") {
    //   return res.status(403).json({
    //     message: "You are not authorized to delete a problem",
    //   });
    // }
    const problemCheck = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problemCheck) {
      return res.status(404).json({
        message: `Problem not found with id ${id}`,
      });
    }
      await db.problem.delete({
      where: {
        id,
      }, 
    });

    return res.status(200).json({
      success: true,
      message:` Problem deleted successfully with id ${id}`,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Problem deleting problem",
      error: error.message,
    });
  }

};

export const getAllProblemsSolvedByUser = async (req, res) => {};
