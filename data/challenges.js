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
    difficulty: "hard",
    tags: ["none", "safe-access", "tool-output"],
    prompt: "Which option is the safest way to guard against a missing tool result before reading a field?",
    code: 'tool_result = None\n# need to read tool_result["status"] safely',
    options: [
      'if tool_result is not None:\n    status = tool_result.get("status", "unknown")',
      'if tool_result:\n    status = tool_result["status"]',
      'status = tool_result["status"] or "unknown"',
      'status = tool_result.get["status"]'
    ],
    correctAnswer: 0,
    explanation: "Checking `is not None` avoids failing on a missing object, and `get(..., \"unknown\")` gives a safe fallback if the field is missing too.",
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
    difficulty: "hard",
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
    prompt: "Replace the broken line with a safer check when `response` should be text or None.",
    code: 'response = model_output.get("text")\n# replace the next line\nif response == None or response == "":\n    return {"status": "retry"}',
    acceptedAnswers: [
      'if not response:',
      "if response is None or response == '':",
      'if response is None or response == "":'
    ],
    explanation: "`if not response:` is the compact guardrail here because the value is expected to be either text or None, and both None and empty strings are falsy.",
    takeaway: "Truthiness checks can be great guardrails when empty strings should count as missing."
  },
  {
    id: "debug-missing-return-none",
    mode: "debug",
    type: "multiple_choice_bug",
    title: "Missing fallback return",
    difficulty: "hard",
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
    difficulty: "hard",
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
    difficulty: "hard",
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
    difficulty: "hard",
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
    difficulty: "hard",
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
    prompt: "Replace the comment with a two-line patch that blocks an empty string label or a refuse label.",
    code: 'label = result.get("label", "")\n# replace this comment\nreturn {"status": "ok"}',
    acceptedAnswers: [
      'if label.lower() in ["", "refuse"]:\n    return {"status": "blocked"}',
      "if label.lower() in ['', 'refuse']:\n    return {'status': 'blocked'}"
    ],
    explanation: "The patch normalizes the label and blocks both explicit refusal labels and empty-string outputs.",
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
  },
  {
    id: "read-json-null-to-none",
    mode: "read",
    type: "multiple_choice_output",
    title: "JSON null becomes Python None",
    difficulty: "easy",
    tags: ["json", "parsing", "none"],
    prompt: "What prints after parsing this model output?",
    code: 'import json\n\nraw = \'{"answer": null}\'\ndata = json.loads(raw)\nprint(data["answer"])',
    options: ['"null"', "None", '""', "Raises KeyError"],
    correctAnswer: 1,
    explanation: "In JSON, `null` maps to Python `None` when parsed with json.loads().",
    takeaway: "Remember the JSON-to-Python type mapping when reasoning about structured outputs."
  },
  {
    id: "read-direct-key-bug",
    mode: "read",
    type: "multiple_choice_bug",
    title: "Optional field with direct access",
    difficulty: "easy",
    tags: ["dict", "optional-fields", "safe-access"],
    prompt: "The score field is optional here. What is the main bug?",
    code: 'result = {"label": "pass"}\nscore = result["score"]',
    options: [
      "It can raise KeyError when score is missing.",
      "Dictionaries cannot store numeric fields.",
      "score must be read with result.score.",
      "Optional fields always become None automatically."
    ],
    correctAnswer: 0,
    explanation: "Direct indexing assumes the key exists. Optional output fields should usually use get().",
    takeaway: "Use `dict.get()` when optional structured-output fields may be absent."
  },
  {
    id: "read-empty-dict-guardrail",
    mode: "read",
    type: "multiple_choice_output",
    title: "Empty tool payload",
    difficulty: "easy",
    tags: ["truthiness", "dict", "tool-output"],
    prompt: "What prints when the tool payload is an empty dict?",
    code: 'payload = {}\nif payload:\n    print("has data")\nelse:\n    print("empty payload")',
    options: ['"has data"', '"empty payload"', "{}", "Nothing prints"],
    correctAnswer: 1,
    explanation: "An empty dictionary is falsy, so the else branch runs.",
    takeaway: "Empty dicts behave like other empty containers in truthiness checks."
  },
  {
    id: "read-list-index-output",
    mode: "read",
    type: "multiple_choice_output",
    title: "First tool item",
    difficulty: "easy",
    tags: ["lists", "tool-output", "safe-access"],
    prompt: "What does this print?",
    code: 'items = ["search", "fetch", "rank"]\nprint(items[0])',
    options: ['"search"', '"fetch"', "0", "Raises an error"],
    correctAnswer: 0,
    explanation: "List indexing starts at 0, so items[0] returns the first element.",
    takeaway: "Keep list indexing straight when reading tool outputs or eval rows."
  },
  {
    id: "read-env-var-guardrail",
    mode: "read",
    type: "multiple_choice_output",
    title: "Missing API key check",
    difficulty: "easy",
    tags: ["env", "guardrails", "truthiness"],
    prompt: "What prints if the key is missing and `api_key` is None?",
    code: 'api_key = None\nif not api_key:\n    print("missing key")',
    options: ['"missing key"', "None", "Nothing prints", "Raises TypeError"],
    correctAnswer: 0,
    explanation: "None is falsy, so `not api_key` is True.",
    takeaway: "Environment variable guardrails often start with a simple truthiness check."
  },
  {
    id: "read-required-key-check-bug",
    mode: "read",
    type: "multiple_choice_bug",
    title: "Broken required key check",
    difficulty: "medium",
    tags: ["validation", "dict", "structured-output"],
    prompt: "What is the bug in this required-key validation?",
    code: 'result = {"answer": "ok"}\nif "answer" and "confidence" in result:\n    print("valid")',
    options: [
      "It only truly checks whether confidence is in result.",
      "Python cannot use and inside if statements.",
      "The answer key should be checked with get() only.",
      "in works only on lists, not dictionaries."
    ],
    correctAnswer: 0,
    explanation: "The string `'answer'` is always truthy, so the condition effectively becomes `if \"confidence\" in result`.",
    takeaway: "Be careful with chained boolean expressions around `in` checks."
  },
  {
    id: "read-safe-nested-get",
    mode: "read",
    type: "multiple_choice_output",
    title: "Nested payload fallback",
    difficulty: "hard",
    tags: ["safe-access", "tool-output", "dict"],
    prompt: "What prints when the payload key is missing?",
    code: 'tool_result = {}\nitems = tool_result.get("payload", {}).get("items", [])\nprint(items)',
    options: ["{}", "None", "[]", "Raises KeyError"],
    correctAnswer: 2,
    explanation: "The chained get() calls return the empty-list default when payload or items is missing.",
    takeaway: "Nested `get()` calls are a practical static-safe pattern for tool outputs."
  },
  {
    id: "read-retry-count-loop",
    mode: "read",
    type: "multiple_choice_output",
    title: "Count retries",
    difficulty: "medium",
    tags: ["loops", "counting", "agents"],
    prompt: "What does this print?",
    code: 'retries = [1, 1, 1]\ntotal = 0\nfor retry in retries:\n    total += retry\nprint(total)',
    options: ["1", "2", "3", "Raises an error"],
    correctAnswer: 2,
    explanation: "The loop adds 1 three times, so total ends at 3.",
    takeaway: "Many agent and eval metrics are just careful small counting loops."
  },
  {
    id: "read-refusal-best-condition",
    mode: "read",
    type: "multiple_choice_best_fix",
    title: "Normalize refusal labels",
    difficulty: "hard",
    tags: ["guardrails", "strings", "normalization"],
    prompt: "Which condition is safest if model labels may contain uppercase letters or spaces?",
    code: 'label = " Refuse "',
    options: [
      'if label.strip().lower() == "refuse":',
      'if label == "refuse":',
      'if label.lower() == " Refuse ":',
      'if "refuse" == label.upper():'
    ],
    correctAnswer: 0,
    explanation: "strip() removes surrounding spaces and lower() normalizes casing before comparison.",
    takeaway: "Normalize model-produced strings before applying guardrail logic."
  },
  {
    id: "read-implicit-none-return",
    mode: "read",
    type: "multiple_choice_output",
    title: "Implicit None return",
    difficulty: "medium",
    tags: ["functions", "returns", "none"],
    prompt: "What prints here?",
    code: 'def parse_flag(text):\n    if text == "safe":\n        return True\n\nprint(parse_flag("other"))',
    options: ["True", "False", "None", "Raises an error"],
    correctAnswer: 2,
    explanation: "If the condition is not met, the function falls off the end and returns None implicitly.",
    takeaway: "Missing return paths often become None, whether you meant them to or not."
  },
  {
    id: "debug-json-loads-patch",
    mode: "debug",
    type: "one_line_patch",
    title: "Use the string parser",
    difficulty: "easy",
    tags: ["json", "parsing", "structured-output"],
    prompt: "Replace the broken line so a JSON string is parsed correctly.",
    code: 'raw = \'{"label": "safe"}\'\n# replace the next line\ndata = json.load(raw)',
    acceptedAnswers: [
      "data = json.loads(raw)"
    ],
    explanation: "json.loads() parses a JSON string already in memory.",
    takeaway: "Use `loads` for strings and `load` for file objects."
  },
  {
    id: "debug-optional-score-keyerror",
    mode: "debug",
    type: "multiple_choice_best_fix",
    title: "Optional score field",
    difficulty: "easy",
    tags: ["dict", "optional-fields", "safe-access"],
    prompt: "The score field is optional. Which line is the safest fix?",
    code: 'result = {"label": "pass"}\nscore = result["score"]',
    options: [
      'score = result.get("score", 0)',
      'score = result["score"] or 0',
      'score = result.score',
      'score = get(score, 0)'
    ],
    correctAnswer: 0,
    explanation: "get() with a default keeps the flow safe when score is absent.",
    takeaway: "Optional output fields should not crash the pipeline."
  },
  {
    id: "debug-score-none-check",
    mode: "debug",
    type: "one_line_patch",
    title: "Preserve a valid zero score",
    difficulty: "medium",
    tags: ["truthiness", "none", "evals"],
    prompt: "Replace the broken line so 0 counts as a real score and only None is treated as missing.",
    code: 'score = 0\n# replace the next line\nif not score:\n    print("missing")',
    acceptedAnswers: [
      "if score is None:"
    ],
    explanation: "A truthiness check wrongly treats 0 as missing. `is None` targets only the absent case and is the preferred style here.",
    takeaway: "When 0 is valid, use an explicit None check."
  },
  {
    id: "debug-message-list-fix",
    mode: "debug",
    type: "multiple_choice_best_fix",
    title: "Read the first message content",
    difficulty: "hard",
    tags: ["lists", "dict", "api-response"],
    prompt: "messages is a list of dicts. Which line correctly reads the first content field?",
    code: 'messages = [{"role": "assistant", "content": "done"}]',
    options: [
      'content = messages[0]["content"]',
      'content = messages["content"]',
      'content = messages.content[0]',
      'content = messages.get("content")'
    ],
    correctAnswer: 0,
    explanation: "The outer layer is a list, so you index into it before accessing the dict key.",
    takeaway: "Track whether you are holding a list or dict at every parsing layer."
  },
  {
    id: "debug-explicit-return-none-patch",
    mode: "debug",
    type: "one_line_patch",
    title: "Make the fallback explicit",
    difficulty: "easy",
    tags: ["functions", "returns", "none"],
    prompt: "Add the missing fallback line for the helper below.",
    code: 'def get_label(result):\n    if "label" in result:\n        return result["label"]\n    # replace this line',
    acceptedAnswers: [
      "return None"
    ],
    explanation: "An explicit fallback return makes the function easier to reason about.",
    takeaway: "Explicit None returns make helper behavior clearer."
  },
  {
    id: "debug-required-key-condition-bug",
    mode: "debug",
    type: "multiple_choice_bug",
    title: "Broken condition for required keys",
    difficulty: "medium",
    tags: ["validation", "conditionals", "structured-output"],
    prompt: "What is wrong with this validation?",
    code: 'if "answer" and "confidence" in result:\n    print("valid")',
    options: [
      "It effectively checks only the confidence key.",
      "It is checking too many keys at once.",
      "and cannot be used with strings.",
      "result must be a list for this syntax."
    ],
    correctAnswer: 0,
    explanation: "Because `'answer'` is truthy, the condition collapses to checking only `'confidence' in result`.",
    takeaway: "Repeat the membership check for each required key or use all(...)."
  },
  {
    id: "debug-api-key-patch",
    mode: "debug",
    type: "one_line_patch",
    title: "Guard a missing API key",
    difficulty: "easy",
    tags: ["env", "guardrails", "truthiness"],
    prompt: "Replace the broken line with a simple missing-key guardrail.",
    code: 'api_key = None\n# replace the next line\nif api_key == "":\n    raise ValueError("missing key")',
    acceptedAnswers: [
      "if not api_key:",
      "if api_key is None:"
    ],
    explanation: "A missing env var often arrives as None, and an empty string should usually count as missing too. `if not api_key:` covers both.",
    takeaway: "Guard both None and empty-string cases when validating env vars."
  },
  {
    id: "debug-json-try-output",
    mode: "debug",
    type: "multiple_choice_output",
    title: "Malformed JSON fallback result",
    difficulty: "medium",
    tags: ["json", "try-except", "guardrails"],
    prompt: "What prints here?",
    code: 'import json\n\nraw = "{bad}"\ntry:\n    data = json.loads(raw)\nexcept json.JSONDecodeError:\n    data = {"status": "invalid_json"}\n\nprint(data["status"])',
    options: ['"invalid_json"', '"bad"', "None", "Raises an error"],
    correctAnswer: 0,
    explanation: "The malformed JSON triggers the except block, which sets the fallback status.",
    takeaway: "A targeted except block can keep the rest of the flow deterministic."
  },
  {
    id: "debug-nested-tool-items-patch",
    mode: "debug",
    type: "one_line_patch",
    title: "Safely read nested tool items",
    difficulty: "medium",
    tags: ["tool-output", "safe-access", "dict"],
    prompt: "Replace the broken line so missing payload or items falls back to an empty list.",
    code: 'tool_result = {}\n# replace the next line\nitems = tool_result["payload"]["items"]',
    acceptedAnswers: [
      'items = tool_result.get("payload", {}).get("items", [])',
      "items = tool_result.get('payload', {}).get('items', [])"
    ],
    explanation: "The nested get() chain avoids crashing on either missing key.",
    takeaway: "Nested defaults are one of the most useful small guardrails in AI plumbing."
  },
  {
    id: "debug-refusal-normalization-fix",
    mode: "debug",
    type: "multiple_choice_best_fix",
    title: "Safer refusal normalization",
    difficulty: "hard",
    tags: ["guardrails", "strings", "normalization"],
    prompt: "Which condition is best if labels may come back with extra spaces or uppercase letters?",
    code: 'label = " Refuse "',
    options: [
      'if label.strip().lower() == "refuse":',
      'if label == "refuse":',
      'if label.lower() == "refuse":',
      'if label.strip() == "Refuse":'
    ],
    correctAnswer: 0,
    explanation: "The safest option removes surrounding whitespace and normalizes the case before comparing.",
    takeaway: "Normalize first, then compare."
  },
  {
    id: "debug-count-retries-patch",
    mode: "debug",
    type: "one_line_patch",
    title: "Increment the retry counter",
    difficulty: "easy",
    tags: ["loops", "counting", "agents"],
    prompt: "Replace the broken line so each retry increments the total by 1.",
    code: 'total = 0\nfor retry in [1, 1, 1]:\n    # replace the next line\n    total =+ 1',
    acceptedAnswers: [
      "total += 1"
    ],
    explanation: "`=+` assigns positive one instead of incrementing. `+=` is the correct operator.",
    takeaway: "Tiny operator slips can silently change loop behavior."
  },
  {
    id: "patch-config-threshold-default",
    mode: "patch",
    type: "one_line_patch",
    title: "Patch a config default",
    difficulty: "easy",
    tags: ["config", "safe-access", "dict"],
    prompt: "Replace the broken line so threshold falls back to 0.7 when missing.",
    code: 'config = {"max_retries": 2}\n# replace the next line\nthreshold = config["threshold"]',
    acceptedAnswers: [
      'threshold = config.get("threshold", 0.7)',
      "threshold = config.get('threshold', 0.7)"
    ],
    explanation: "Optional config values should usually have a safe default rather than crashing.",
    takeaway: "Defaults make config-based pipelines more robust."
  },
  {
    id: "patch-missing-items-retry",
    mode: "patch",
    type: "two_line_patch",
    title: "Retry on missing tool items",
    difficulty: "medium",
    tags: ["tool-output", "guardrails", "validation"],
    prompt: "Replace the comment with a two-line patch that retries when items is empty.",
    code: 'items = []\n# replace this comment\nreturn {"status": "ok"}',
    acceptedAnswers: [
      'if not items:\n    return {"status": "retry"}',
      "if not items:\n    return {'status': 'retry'}"
    ],
    explanation: "An empty list should trigger the retry branch before the success return.",
    takeaway: "Simple empty-list guardrails prevent downstream assumptions from breaking."
  },
  {
    id: "patch-safe-strip-none",
    mode: "patch",
    type: "one_line_patch",
    title: "Patch safe text cleanup",
    difficulty: "medium",
    tags: ["none", "strings", "guardrails"],
    prompt: "Replace the broken line so missing text becomes an empty string before stripping.",
    code: 'text = None\n# replace the next line\nclean = text.strip()',
    acceptedAnswers: [
      'clean = (text or "").strip()',
      "clean = (text or '').strip()"
    ],
    explanation: "Using `text or \"\"` protects the strip() call when the value is None.",
    takeaway: "Guard a possibly missing string before calling string methods on it."
  },
  {
    id: "patch-score-none-validation",
    mode: "patch",
    type: "two_line_patch",
    title: "Validate a missing score without rejecting zero",
    difficulty: "hard",
    tags: ["none", "validation", "evals"],
    prompt: "Replace the comment with a two-line patch that marks the row invalid only when score is None.",
    code: 'score = 0\n# replace this comment\nreturn {"status": "ok"}',
    acceptedAnswers: [
      'if score is None:\n    return {"status": "invalid"}',
      "if score is None:\n    return {'status': 'invalid'}"
    ],
    explanation: "This preserves a valid score of 0 while still guarding the missing-value case with the clearest check.",
    takeaway: "When 0 is meaningful, avoid truthiness and validate None directly."
  }
];
