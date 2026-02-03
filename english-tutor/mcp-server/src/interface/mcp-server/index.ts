import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { SqliteEnglishStudyLogRepository } from "../../infrastructure/SqliteEnglishStudyLogRepository.js";
import { LogEnglishStudyUseCase } from "../../usecase/LogEnglishStudyUseCase.js";
import path from "path";
import process from "process";

// Initialize Repository and UseCase
// Use an absolute path or a path relative to the runtime
const dbPath = path.resolve(process.cwd(), "english_study.db");
const repository = new SqliteEnglishStudyLogRepository(dbPath);
const logUseCase = new LogEnglishStudyUseCase(repository);

// Create MCP Server
const server = new McpServer({
  name: "claude-en-tutor",
  version: "1.0.0",
});

// Define Tool
server.tool(
  "log_english_study",
  {
    original_text: z.string().describe("The user's original english text"),
    corrected_text: z.string().describe("The corrected version of the text"),
    explanation: z.string().describe("Explanation of the corrections"),
    context: z.string().optional().describe("Context or topic of the conversation"),
  },
  async ({ original_text, corrected_text, explanation, context }) => {
    try {
      const log = await logUseCase.execute({
        original_text,
        corrected_text,
        explanation,
        context,
      });
      return {
        content: [
          {
            type: "text",
            text: `Successfully logged study session. ID: ${log.id}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error logging study session: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Start Server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Claude English Tutor MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main loop:", error);
  process.exit(1);
});
