import { pollBatchResults, submitBatch } from "../libs/judge0.libs.js";

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

   

    res.status(200).json({
      success: true,
      message: "Code executed successfully",
    });
  } catch (error) {}
};
