import sys
import os
import json
import re
import datetime
import subprocess

def find_repo_root():
    cur = os.path.abspath(os.getcwd())
    while cur:
        if os.path.exists(os.path.join(cur, ".git")) or os.path.exists(os.path.join(cur, ".agent-logs")) or os.path.exists(os.path.join(cur, ".agents")):
            return cur
        parent = os.path.dirname(cur)
        if parent == cur:
            break
        cur = parent
    return os.path.abspath(os.getcwd())

def get_git_author():
    try:
        res = subprocess.run(["git", "config", "user.name"], capture_output=True, text=True, check=False)
        name = res.stdout.strip()
        if name:
            return name
    except Exception:
        pass
    return "ParvGatecha"

def clean_prompt(content):
    if not content:
        return ""
    # Check if wrapped in <USER_REQUEST>...</USER_REQUEST>
    m = re.search(r'<USER_REQUEST>\s*(.*?)\s*</USER_REQUEST>', content, re.DOTALL)
    if m:
        return m.group(1).strip()
    return content.strip()

def process_transcript(transcript_path, conversation_id, model_name="gemini-3.7-flash", workspace_path=None):
    if not os.path.exists(transcript_path):
        alt_path = os.path.join(os.path.dirname(transcript_path), "transcript_full.jsonl")
        if os.path.exists(alt_path):
            transcript_path = alt_path
        else:
            return

    # Prefer transcript_full.jsonl for complete untruncated content
    full_path = os.path.join(os.path.dirname(transcript_path), "transcript_full.jsonl")
    if os.path.exists(full_path):
        transcript_path = full_path

    entries = []
    with open(transcript_path, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            try:
                entries.append(json.loads(line))
            except Exception:
                pass

    exchanges = []
    current_prompt = None
    current_responses = []

    for entry in entries:
        etype = entry.get("type")
        source = entry.get("source")
        
        if etype == "USER_INPUT" and source == "USER_EXPLICIT":
            if current_prompt is not None:
                resp_content = ""
                resp_time = current_prompt["created_at"]
                if current_responses:
                    last_resp = current_responses[-1]
                    resp_content = last_resp.get("content") or ""
                    resp_time = last_resp.get("created_at") or resp_time
                exchanges.append({
                    "prompt": current_prompt,
                    "response_content": resp_content,
                    "response_time": resp_time
                })
            current_prompt = {
                "content": clean_prompt(entry.get("content")),
                "created_at": entry.get("created_at"),
                "model": model_name
            }
            current_responses = []
        elif etype == "PLANNER_RESPONSE":
            if entry.get("content"):
                current_responses.append(entry)

    if current_prompt is not None:
        resp_content = ""
        resp_time = current_prompt["created_at"]
        if current_responses:
            last_resp = current_responses[-1]
            resp_content = last_resp.get("content") or ""
            resp_time = last_resp.get("created_at") or resp_time
        exchanges.append({
            "prompt": current_prompt,
            "response_content": resp_content,
            "response_time": resp_time
        })

    if not exchanges:
        return

    if not workspace_path:
        workspace_path = find_repo_root()

    agent_logs_dir = os.path.join(workspace_path, ".agent-logs")
    os.makedirs(agent_logs_dir, exist_ok=True)

    session_id = conversation_id or "unknown-session"
    short_session_id = session_id[:8]
    first_prompt_time_str = exchanges[0]["prompt"]["created_at"]
    last_prompt_time_str = exchanges[-1]["prompt"]["created_at"]

    try:
        first_dt = datetime.datetime.fromisoformat(first_prompt_time_str.replace("Z", "+00:00"))
        date_str = first_dt.strftime("%Y-%m-%d")
        file_timestamp = first_dt.strftime("%Y-%m-%d_%H-%M-%S")
    except Exception:
        date_str = datetime.datetime.utcnow().strftime("%Y-%m-%d")
        file_timestamp = datetime.datetime.utcnow().strftime("%Y-%m-%d_%H-%M-%S")

    author = get_git_author()
    project = os.path.basename(os.path.abspath(workspace_path))
    model = model_name or "gemini-3.7-flash"
    tool = "antigravity"

    log_filename = f"{file_timestamp}_{session_id}.md"
    log_filepath = os.path.join(agent_logs_dir, log_filename)

    # Build markdown strictly adhering to specification
    lines = [
        "---",
        f"session_id: {session_id}",
        f"date: {date_str}",
        f"author: {author}",
        f"model: {model}",
        f"tool: {tool}",
        f"project: {project}",
        f"total_exchanges: {len(exchanges)}",
        f"first_prompt_time: {first_prompt_time_str}",
        f"last_prompt_time: {last_prompt_time_str}",
        "---",
        "",
        f"# Session Log - {date_str}",
        "",
        f"Session: `{short_session_id}` | Project: `{project}` | Author: `{author}`",
        "",
        "---",
        ""
    ]

    for idx, ex in enumerate(exchanges, 1):
        p = ex["prompt"]
        lines.append(f"[LOG_ENTRY type=PROMPT num={idx} session={short_session_id}]")
        lines.append(f"timestamp: {p['created_at']}")
        lines.append(f"model: {p['model']}")
        lines.append("")
        lines.append(p["content"])
        lines.append("")
        lines.append("")
        lines.append(f"[LOG_ENTRY type=RESPONSE num={idx} session={short_session_id}]")
        lines.append(f"timestamp: {ex['response_time']}")
        lines.append(f"model: {p['model']}")
        lines.append("")
        lines.append(ex["response_content"])
        lines.append("")
        lines.append("")

    with open(log_filepath, "w", encoding="utf-8") as f:
        f.write("\n".join(lines).strip() + "\n")

    return log_filepath

def main():
    try:
        raw_input = sys.stdin.read()
        if raw_input.strip():
            payload = json.loads(raw_input)
        else:
            payload = {}
    except Exception:
        payload = {}

    conv_id = payload.get("conversationId")
    transcript_path = payload.get("transcriptPath")
    model_name = payload.get("modelName") or "gemini-3.7-flash"
    workspace_paths = payload.get("workspacePaths") or []
    workspace_path = workspace_paths[0] if workspace_paths else find_repo_root()

    if conv_id and transcript_path:
        process_transcript(transcript_path, conv_id, model_name, workspace_path)

    print(json.dumps({"decision": "allow"}))

if __name__ == "__main__":
    main()
