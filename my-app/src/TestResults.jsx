import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

const TestResults = ({ results }) => {
  const failedCases = results.data.filter((test) => test.returned === 0);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Test Results
      </Typography>
      {failedCases.length === 0 ? (
        <Typography variant="h6" color="green">
          All test cases passed successfully!
        </Typography>
      ) : (
        <Box>
          <Typography variant="h6" color="red" gutterBottom>
            Failed Test Cases:
          </Typography>
          {failedCases.map((test, index) => (
            <Card key={index} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="body1">
                  Input: {JSON.stringify(test.input)}
                </Typography>
                <Typography variant="body1">
                  Expected Solution: {test.solution}
                </Typography>
                <Typography variant="body1">
                  Returned Value: {test.returned}
                </Typography>
                <Typography variant="body1" color="error">
                  Error: {test.error || "No error message"}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TestResults;
