export default async function (context) {
  const { req, res, env, log, error } = context;

  if (req.method !== "POST") {
    return res.json({ error: "Method not allowed" }, 405);
  }

  const openRouterKey = env.get("OPENROUTER_API_KEY");
  const openRouterModel = env.get("OPENROUTER_MODEL") ?? "meta-llama/llama-3.3-70b-instruct:free";
  const openRouterSite = env.get("OPENROUTER_SITE_URL") ?? "https://your-domain.example";
  const openRouterTitle = env.get("OPENROUTER_SITE_NAME") ?? "Edu Collab";

  if (!openRouterKey) {
    return res.json({ error: "OpenRouter API key is not configured." }, 500);
  }

  let payload;
  try {
    payload = await req.json();
  } catch (exception) {
    error("Failed to parse request body", exception);
    return res.json({ error: "Invalid JSON payload." }, 400);
  }

  const { classroomId, messages } = payload ?? {};
  const userId = req.headers["x-appwrite-user-id"] || req.headers["X-Appwrite-User-Id"];

  if (!userId) {
    return res.json({ error: "Sign in again to use the assistant." }, 401);
  }

  if (!classroomId || !Array.isArray(messages) || messages.length === 0) {
    return res.json({ error: "Missing classroom identifier or messages." }, 400);
  }

  const databaseId = env.get("CLASSROOM_DATABASE_ID");
  const tableId = env.get("CLASSROOM_TABLE_ID");
  const endpoint = env.get("APPWRITE_FUNCTION_ENDPOINT");
  const projectId = env.get("APPWRITE_FUNCTION_PROJECT_ID");
  const apiKey = env.get("APPWRITE_FUNCTION_API_KEY");

  if (!databaseId || !tableId) {
    return res.json({ error: "Classroom configuration is not set." }, 500);
  }

  if (!endpoint || !projectId || !apiKey) {
    return res.json({ error: "Appwrite credentials are not available in the function environment." }, 500);
  }

  let classroom;
  try {
    const classroomResponse = await fetch(
      `${endpoint}/databases/${databaseId}/tables/${tableId}/rows/${classroomId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": projectId,
          "X-Appwrite-Key": apiKey,
        },
      }
    );

    if (!classroomResponse.ok) {
      const body = await classroomResponse.text();
      error("Failed to fetch classroom", body);
      return res.json({ error: "Unable to load classroom information." }, classroomResponse.status);
    }

    classroom = await classroomResponse.json();
  } catch (exception) {
    error("Unexpected error while fetching classroom", exception);
    return res.json({ error: "Unable to verify classroom access." }, 500);
  }

  const { adminId, users = [], hasAccess = [] } = classroom ?? {};
  const isMember = adminId === userId || users.includes(userId) || hasAccess.includes(userId);

  if (!isMember) {
    return res.json({ error: "You do not have permission to ask questions in this classroom." }, 403);
  }

  const requestBody = {
    model: openRouterModel,
    messages,
  };

  let completion;
  try {
    const completionResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openRouterKey}`,
        "HTTP-Referer": openRouterSite,
        "X-Title": openRouterTitle,
      },
      body: JSON.stringify(requestBody),
    });

    if (!completionResponse.ok) {
      const body = await completionResponse.text();
      error("OpenRouter request failed", body);
      return res.json({ error: "The AI provider rejected the request. Try again later." }, completionResponse.status);
    }

    completion = await completionResponse.json();
  } catch (exception) {
    error("Unexpected error while contacting OpenRouter", exception);
    return res.json({ error: "Unable to connect to the AI provider." }, 502);
  }

  const firstChoice = completion?.choices?.[0];
  let assistantMessage = "";

  if (firstChoice?.message) {
    const content = firstChoice.message.content;
    if (typeof content === "string") {
      assistantMessage = content;
    } else if (Array.isArray(content)) {
      assistantMessage = content
        .map((part) => {
          if (!part) {
            return "";
          }
          if (typeof part === "string") {
            return part;
          }
          if (typeof part.text === "string") {
            return part.text;
          }
          return "";
        })
        .filter(Boolean)
        .join("\n");
    }
  }

  assistantMessage = assistantMessage?.trim?.() ?? "";

  if (!assistantMessage) {
    log("Completion had no assistant message", completion);
    assistantMessage = "I couldn't find a helpful answer just now. Please try asking again.";
  }

  return res.json(
    {
      message: assistantMessage,
      usage: completion?.usage,
      raw: completion,
    },
    200
  );
}
