window.CHALLENGES = [
  {
    id: "read-json-loads-vs-load",
    mode: "read",
    type: "multiple_choice_bug",
    title: "Parse a model JSON string",
    difficulty: "easy",
    tags: ["json", "structured-output", "parsing"],
    prompt: "This snippet receives a JSON string from a model. What is the main bug?",
    code: 'import json\n\nraw = \'{"label": "safe"}\'\nresult = json.load(raw)',
    options: [
      "It should use json.loads(raw) because raw is a string, not a file object.",
      "It should call raw.load() because strings own the JSON parser.",
      "It should wrap raw in list(raw) before parsing.",
      "It fails because JSON requires single quotes."
    ],
    correctAnswer: 0,
    explanation: "json.load() expects a file-like object. For a JSON string already in memory, the correct function is json.loads().",
    takeaway: "Use json.loads() for strings and json.load() for open files."
  },
  {
    id: "read-dict-get-default",
    mode: "read",
    type: "multiple_choice_output",
    title: "Optional score lookup",
    difficulty: "easy",
    tags: ["dict", "safe-access", "optional-fields"],
    prompt: "What does this print when the model omitted score?",
    code: 'result = {"label": "pass"}\nprint(result.get("score", 0))',
    options: ["Raises KeyError", "None", "0", '"score"'],
    correctAnswer: 2,
    explanation: "dict.get('score', 0) returns the provided default when the key is missing.",
    takeaway: "Use get() with a default when optional fields are expected."
  },
  {
    id: "read-falsy-zero",
    mode: "read",
    type: "multiple_choice_output",
    title: "Falsy zero in eval rows",
    difficulty: "easy",
    tags: ["truthiness", "evals", "conditionals"],
    prompt: "A score of 0 is valid here. What prints?",
    code: 'score = 0\nif score:\n    print("has score")\nelse:\n    print("missing")',
    options: ['"has score"', '"missing"', "0", "Nothing prints"],
    correctAnswer: 1,
    explanation: "In Python, 0 is falsy, so the else branch runs even though the score exists.",
    takeaway: "When 0 is meaningful, check `is None` instead of relying on truthiness."
  },
  {
    id: "read-falsy-empty-string",
    mode: "read",
    type: "multiple_choice_bug",
    title: "Empty model response check",
    difficulty: "easy",
    tags: ["truthiness", "guardrails", "responses"],
    prompt: "Which statement best describes the behavior?",
    code: 'response = ""\nif not response:\n    print("empty response guardrail")',
    options: [
      "It prints because an empty string is falsy.",
      "It fails because strings cannot be negated.",
      "It skips the print because empty strings are truthy.",
      "It prints only if response is None."
    ],
    correctAnswer: 0,
    explanation: "An empty string evaluates to False, so `not response` is True.",
    takeaway: "Empty strings, empty lists, and empty dicts are all falsy in Python."
  },
  {
    id: "read-falsy-empty-list",
    mode: "read",
    type: "multiple_choice_output",
    title: "Citation list guardrail",
    difficulty: "easy",
    tags: ["truthiness", "lists", "guardrails"],
    prompt: "What does this return when citations is empty?",
    code: 'def has_citations(citations):\n    if citations:\n        return "ok"\n    return "missing"\n\nprint(has_citations([]))',
    options: ['"ok"', '"missing"', "[]", "None"],
    correctAnswer: 1,
    explanation: "An empty list is falsy, so the function returns 'missing'.",
    takeaway: "Empty containers are falsy, which is useful for guardrails on missing data."
  },
  {
    id: "read-none-handling",
    mode: "read",
    type: "multiple_choice_best_fix",
    title: "Handle missing tool output",
    difficulty: "medium",
    tags: ["none", "safe-access", "tool-output"],
    prompt: "Which option is the safest way to guard against a missing tool result before reading a field?",
    code: 'tool_result = None\n# need to read tool_result["status"] safely',
    options: [
      'if tool_result is not None:\n    status = tool_result.get("status")',
      'if tool_result:\n    status = tool_result["status"]',
      'status = tool_result["status"] or "unknown"',
      'status = tool_result.get["status"]'
    ],
    correctAnswer: 0,
    explanation: "Checking `is not None` avoids failing on a missing object, and `get()` avoids KeyError for the field itself.",
    takeaway: "Guard the container first, then use safe field access when optional keys are possible."
  },
  {
    id: "read-loop-syntax",
    mode: "read",
    type: "multiple_choice_bug",
    title: "Eval loop syntax",
    difficulty: "easy",
    tags: ["loops", "syntax", "evals"],
    prompt: "What is the bug in this eval loop?",
    code: 'rows = [1, 2, 3]\nfor row in rows\n    print(row)',
    options: [
      "The for statement is missing a trailing colon.",
      "rows must be a tuple, not a list.",
      "print() cannot appear inside loops.",
      "row needs to be declared before the loop."
    ],
    correctAnswer: 0,
    explanation: "Python for-loops require a colon at the end of the loop header.",
    takeaway: "Loop headers need both the correct `for x in y` form and a trailing colon."
  },
  {
    id: "read-required-keys-validation",
    mode: "read",
    type: "multiple_choice_best_fix",
    title: "Required output keys",
    difficulty: "medium",
    tags: ["validation", "dict", "structured-output"],
    prompt: "Which check correctly verifies that both required keys exist in the model output?",
    code: 'result = {"answer": "42"}\nrequired = ["answer", "confidence"]',
    options: [
      'all(key in result for key in required)',
      'required in result',
      'result.get(required)',
      '"answer" and "confidence" in result'
    ],
    correctAnswer: 0,
    explanation: "The generator expression checks each required key individually. The last option is a common bug because it only checks the second key.",
    takeaway: "Use `all(key in obj for key in required)` for concise required-key validation."
  },
  {
    id: "read-upper-behavior",
    mode: "read",
    type: "multiple_choice_output",
    title: "Normalize a flag",
    difficulty: "easy",
    tags: ["strings", "normalization", "guardrails"],
    prompt: "What prints here?",
    code: 'flag = "safe"\nprint(flag.upper())',
    options: ['"safe"', '"SAFE"', '"Safe"', "Raises an error"],
    correctAnswer: 1,
    explanation: "`.upper()` returns a new uppercase string and does not modify the original in place.",
    takeaway: "String methods usually return transformed copies rather than mutating the existing value."
  },
  {
    id: "read-counting-passed-rows",
    mode: "read",
    type: "multiple_choice_output",
    title: "Count passing eval rows",
    difficulty: "medium",
    tags: ["loops", "counting", "evals"],
    prompt: "What does this print?",
    code: 'rows = [\n    {"passed": True},\n    {"passed": False},\n    {"passed": True}\n]\ncount = 0\nfor row in rows:\n    if row["passed"]:\n        count += 1\nprint(count)',
    options: ["1", "2", "3", "Raises KeyError"],
    correctAnswer: 1,
    explanation: "Two rows have `passed` set to True, so the counter ends at 2.",
    takeaway: "Simple eval metrics often come down to careful loop conditions and counting."
  },
  {
    id: "debug-equality-vs-assignment",
    mode: "debug",
    type: "multiple_choice_bug",
    title: "Refusal check comparison",
    difficulty: "easy",
    tags: ["conditionals", "syntax", "guardrails"],
    prompt: "What is the main issue in this guardrail check?",
    code: 'status = "refuse"\nif status = "refuse":\n    print("block")',
    options: [
      "It uses = instead of == inside the condition.",
      "The string should be REFUSE in uppercase.",
      "print() cannot be used after if.",
      "status must be declared inside the if block."
    ],
    correctAnswer: 0,
    explanation: "Single `=` assigns; it does not compare. Conditions need `==` when testing equality.",
    takeaway: "Use `==` for comparison and `=` for assignment."
  },
  {
    id: "debug-empty-response-guardrail",
    mode: "debug",
    type: "one_line_patch",
    title: "Add an empty response guardrail",
    difficulty: "easy",
    tags: ["guardrails", "truthiness", "responses"],
    prompt: "Replace the broken line with a safer check that catches empty strings and None.",
    code: 'response = model_output.get("text")\n# replace the next line\nif response == None or response == "":\n    return {"status": "retry"}',
    acceptedAnswers: [
      'if not response:',
      "if response is None or response == '':",
      'if response is None or response == "":'
    ],
    explanation: "`if not response:` is the compact guardrail here because both None and empty strings are falsy.",
    takeaway: "Truthiness checks can be great guardrails when empty strings should count as missing."
  },
  {
    id: "debug-missing-return-none",
    mode: "debug",
    type: "multiple_choice_bug",
    title: "Missing fallback return",
    difficulty: "medium",
    tags: ["functions", "returns", "safe-access"],
    prompt: "What is the bug in this helper?",
    code: 'def get_confidence(result):\n    if "confidence" in result:\n        return result["confidence"]\n\nscore = get_confidence({})',
    options: [
      "The function returns None implicitly when confidence is missing.",
      "Functions cannot return dictionary values.",
      "The if statement must use result.get in every case.",
      "score must be declared before the function."
    ],
    correctAnswer: 0,
    explanation: "When the key is missing, the function falls off the end and returns None. That may be fine, but it should be intentional and usually explicit.",
    takeaway: "If a missing-path return matters, make it explicit so downstream code is easier to reason about."
  },
  {
    id: "debug-simple-eval-loop",
    mode: "debug",
    type: "one_line_patch",
    title: "Fix the eval loop header",
    difficulty: "easy",
    tags: ["loops", "evals", "syntax"],
    prompt: "Replace the broken loop line with valid Python.",
    code: 'rows = [{"passed": True}, {"passed": False}]\npassed = 0\n# replace the next line\nfor row rows:\n    if row["passed"]:\n        passed += 1',
    acceptedAnswers: ["for row in rows:"],
    explanation: "Python loop headers need `in` and a trailing colon.",
    takeaway: "Many tiny Python bugs are just syntax precision issues."
  },
  {
    id: "debug-list-vs-dict-mismatch",
    mode: "debug",
    type: "multiple_choice_bug",
    title: "List or dict?",
    difficulty: "medium",
    tags: ["lists", "dict", "api-response"],
    prompt: "An API returned a list of messages. What is the bug?",
    code: 'messages = [\n    {"role": "assistant", "content": "done"}\n]\nprint(messages["content"])',
    options: [
      "messages is a list, so it must be indexed before reading a dict key.",
      "Lists cannot contain dictionaries in Python.",
      "content must be accessed with messages.content.",
      "The role key must be read before the content key."
    ],
    correctAnswer: 0,
    explanation: "The code treats a list like a dict. It should access `messages[0][\"content\"]` if the first message is intended.",
    takeaway: "Keep track of whether each layer is a list or dict when parsing responses."
  },
  {
    id: "debug-malformed-json-try-except",
    mode: "debug",
    type: "multiple_choice_best_fix",
    title: "Handle malformed model JSON",
    difficulty: "medium",
    tags: ["json", "try-except", "guardrails"],
    prompt: "Which option is the best lightweight guardrail around parsing a model JSON string?",
    code: 'raw = model_output["json_text"]',
    options: [
      'try:\n    data = json.loads(raw)\nexcept json.JSONDecodeError:\n    data = {"status": "invalid_json"}',
      'data = json.load(raw)',
      'data = eval(raw)',
      'if raw == {}:\n    data = raw'
    ],
    correctAnswer: 0,
    explanation: "The try/except pattern handles malformed JSON safely and avoids executing arbitrary code.",
    takeaway: "Guard model-produced JSON with `json.loads()` plus a targeted except block."
  },
  {
    id: "debug-optional-field-output",
    mode: "debug",
    type: "multiple_choice_best_fix",
    title: "Optional rationale field",
    difficulty: "easy",
    tags: ["optional-fields", "dict", "structured-output"],
    prompt: "The rationale field is optional. Which line is safest?",
    code: 'result = {"label": "pass"}',
    options: [
      'rationale = result.get("rationale", "")',
      'rationale = result["rationale"]',
      'rationale = result.rationale',
      'rationale = get(result, "rationale")'
    ],
    correctAnswer: 0,
    explanation: "get() with a default avoids KeyError while keeping the missing case explicit.",
    takeaway: "Optional fields should usually use `get()` rather than direct indexing."
  },
  {
    id: "debug-tool-output-parse",
    mode: "debug",
    type: "one_line_patch",
    title: "Safely read tool status",
    difficulty: "medium",
    tags: ["tool-output", "safe-access", "dict"],
    prompt: "Replace the broken line so missing status falls back to unknown.",
    code: 'tool_result = {"payload": {"items": 3}}\n# replace the next line\nstatus = tool_result["status"]',
    acceptedAnswers: [
      'status = tool_result.get("status", "unknown")',
      "status = tool_result.get('status', 'unknown')"
    ],
    explanation: "A missing key should not crash the flow when a safe fallback is acceptable.",
    takeaway: "Use `get()` with a default for optional tool fields."
  },
  {
    id: "debug-safe-config-lookup",
    mode: "debug",
    type: "multiple_choice_best_fix",
    title: "Read a config threshold",
    difficulty: "medium",
    tags: ["config", "dict", "safe-access"],
    prompt: "Which snippet safely reads an optional threshold from config?",
    code: 'config = {"max_retries": 2}',
    options: [
      'threshold = config.get("threshold", 0.7)',
      'threshold = config["threshold"]',
      'threshold = config.threshold or 0.7',
      'threshold = config.get["threshold", 0.7]'
    ],
    correctAnswer: 0,
    explanation: "The safe lookup returns a default when threshold is absent instead of failing.",
    takeaway: "Config objects often need sane defaults because optional keys are common."
  },
  {
    id: "debug-count-pass-condition",
    mode: "debug",
    type: "one_line_patch",
    title: "Count passed rows correctly",
    difficulty: "medium",
    tags: ["evals", "conditionals", "counting"],
    prompt: "Replace the broken line so only passing rows increment the counter.",
    code: 'count = 0\nrow = {"passed": True}\n# replace the next line\nif row["passed"] = True:\n    count += 1',
    acceptedAnswers: [
      'if row["passed"] == True:',
      "if row['passed'] == True:",
      'if row["passed"]:',
      "if row['passed']:"
    ],
    explanation: "Assignment is invalid in the condition. A truthiness check is cleanest here because the value is already boolean.",
    takeaway: "When a field is already boolean, `if row[\"passed\"]:` is usually enough."
  },
  {
    id: "debug-refusal-logic",
    mode: "debug",
    type: "multiple_choice_output",
    title: "Short refusal logic",
    difficulty: "easy",
    tags: ["guardrails", "conditionals", "strings"],
    prompt: "What prints?",
    code: 'label = "REFUSE"\nif label.lower() == "refuse":\n    print("blocked")\nelse:\n    print("allow")',
    options: ['"blocked"', '"allow"', '"REFUSE"', "Nothing prints"],
    correctAnswer: 0,
    explanation: "lower() normalizes the label, so the comparison succeeds and the guardrail blocks.",
    takeaway: "Normalize string casing before comparing model-produced labels."
  },
  {
    id: "patch-required-keys",
    mode: "patch",
    type: "two_line_patch",
    title: "Add required-key validation",
    difficulty: "medium",
    tags: ["validation", "structured-output", "guardrails"],
    prompt: "Replace the comment with a tiny patch that returns invalid when either key is missing.",
    code: 'result = {"answer": "yes"}\n# replace this comment\nreturn {"status": "ok"}',
    acceptedAnswers: [
      'if not all(key in result for key in ["answer", "confidence"]):\n    return {"status": "invalid"}',
      "if not all(key in result for key in ['answer', 'confidence']):\n    return {'status': 'invalid'}"
    ],
    explanation: "The patch adds a compact required-key guardrail before the happy path continues.",
    takeaway: "Tiny validation patches can prevent fragile downstream assumptions."
  },
  {
    id: "patch-refusal-guardrail",
    mode: "patch",
    type: "two_line_patch",
    title: "Patch a refusal guardrail",
    difficulty: "hard",
    tags: ["guardrails", "validation", "strings"],
    prompt: "Replace the comment with a two-line patch that blocks empty or refuse labels.",
    code: 'label = result.get("label", "")\n# replace this comment\nreturn {"status": "ok"}',
    acceptedAnswers: [
      'if label.lower() in ["", "refuse"]:\n    return {"status": "blocked"}',
      "if label.lower() in ['', 'refuse']:\n    return {'status': 'blocked'}"
    ],
    explanation: "The patch normalizes the label and blocks both explicit refusal labels and empty outputs.",
    takeaway: "Small guardrail patches often combine normalization with a narrow blocked set."
  },
  {
    id: "patch-optional-citations",
    mode: "patch",
    type: "one_line_patch",
    title: "Add optional citations fallback",
    difficulty: "easy",
    tags: ["safe-access", "dict", "citations"],
    prompt: "Replace the broken line so missing citations become an empty list.",
    code: 'result = {"answer": "done"}\n# replace the next line\ncitations = result["citations"]',
    acceptedAnswers: [
      'citations = result.get("citations", [])',
      "citations = result.get('citations', [])"
    ],
    explanation: "Missing citations are handled gracefully with a list default.",
    takeaway: "Use a default that matches the expected type of the field."
  },
  {
    id: "patch-safe-tool-payload",
    mode: "patch",
    type: "one_line_patch",
    title: "Patch safe nested payload access",
    difficulty: "medium",
    tags: ["tool-output", "safe-access", "dict"],
    prompt: "Replace the broken line so missing payload or items does not crash.",
    code: 'tool_result = {}\n# replace the next line\nitems = tool_result["payload"]["items"]',
    acceptedAnswers: [
      'items = tool_result.get("payload", {}).get("items", [])',
      "items = tool_result.get('payload', {}).get('items', [])"
    ],
    explanation: "Nested get() calls with typed defaults keep the pipeline moving safely.",
    takeaway: "For nested optional data, chain `get()` with sensible default containers."
  }
];
