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

export const getProblemById = async (req, res) => {};

export const getAllProblems = async (req, res) => {};

export const updateProblemById = async (req, res) => {};

export const deleteProblemById = async (req, res) => {};

export const getAllProblemsSolvedByUser = async (req, res) => {};
