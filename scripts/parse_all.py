import json
import re

all_text = ""
for part in [1, 2, 3, 4]:
    with open(f"scripts/raw_part{part}.txt", "r") as f:
        all_text += "\n\n" + f.read()

# Pattern for matching:
# <number>. <question>
# A. <optA>
# B. <optB>
# C. <optC>
# D. <optD>
# ✓ Correct Answer: <letter>. <correct_text>

# Split by question number: e.g. "\n1. ", "\n2. ", etc.
blocks = re.split(r'\n(?=\d+\.\s)', all_text.strip())

questions = []
for block in blocks:
    lines = [line.strip() for line in block.strip().split('\n') if line.strip()]
    if not lines:
        continue
    
    # First line: <number>. <question>
    m_q = re.match(r'^(\d+)\.\s+(.*)', lines[0])
    if not m_q:
        continue
    q_num = m_q.group(1)
    q_text = m_q.group(2)
    
    # Options A, B, C, D
    opt_a, opt_b, opt_c, opt_d = "", "", "", ""
    correct_ans = ""
    
    idx = 1
    while idx < len(lines):
        line = lines[idx]
        if line.startswith("A.") or line.startswith("A "):
            opt_a = line[2:].strip()
        elif line.startswith("B.") or line.startswith("B "):
            opt_b = line[2:].strip()
        elif line.startswith("C.") or line.startswith("C "):
            opt_c = line[2:].strip()
        elif line.startswith("D.") or line.startswith("D "):
            opt_d = line[2:].strip()
        elif "Correct Answer:" in line:
            # ✓ Correct Answer: A. Mathura or ✓ Correct Answer: A
            m_c = re.search(r'Correct Answer:\s*([A-D])\.?\s*(.*)', line)
            if m_c:
                letter = m_c.group(1)
                text = m_c.group(2).strip()
                if text:
                    correct_ans = text
                else:
                    if letter == 'A': correct_ans = opt_a
                    elif letter == 'B': correct_ans = opt_b
                    elif letter == 'C': correct_ans = opt_c
                    elif letter == 'D': correct_ans = opt_d
        elif opt_a == "" and opt_b == "" and opt_c == "" and opt_d == "":
            # Continuation of question
            q_text += " " + line
        idx += 1
    
    # If correct_ans didn't match option text exactly (or only letter was found):
    # Match against options:
    options = [opt_a, opt_b, opt_c, opt_d]
    # Check if correct_ans matches one of the options
    found_match = False
    for opt in options:
        if opt and (opt.lower() == correct_ans.lower() or opt.lower() in correct_ans.lower() or correct_ans.lower() in opt.lower()):
            correct_ans = opt
            found_match = True
            break
    
    if not found_match and opt_a:
        # Fallback to matched letter
        for line in lines:
            if "Correct Answer:" in line:
                m_c = re.search(r'Correct Answer:\s*([A-D])', line)
                if m_c:
                    letter = m_c.group(1)
                    if letter == 'A': correct_ans = opt_a
                    elif letter == 'B': correct_ans = opt_b
                    elif letter == 'C': correct_ans = opt_c
                    elif letter == 'D': correct_ans = opt_d
    
    if opt_a and opt_b and opt_c and opt_d and correct_ans:
        questions.append({
            "id": str(len(questions)),
            "question": q_text,
            "options": [opt_a, opt_b, opt_c, opt_d],
            "correct": correct_ans
        })

print(f"Total parsed questions: {len(questions)}")

ts_content = """import { QuizQuestion } from "../types";

export const quizArray: QuizQuestion[] = """ + json.dumps(questions, indent=4) + """;

export const getRandomQuestions = (count: number) => {
  const shuffled = [...quizArray].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
"""

with open("src/data/questions.ts", "w") as f:
    f.write(ts_content)

print("Successfully wrote src/data/questions.ts")
