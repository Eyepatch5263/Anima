with open(".next/dev/logs/next-development.log", "r") as f:
    lines = f.readlines()

found_indices = []
for idx, line in enumerate(lines):
    if "Top 10 candidates before MMR" in line:
        found_indices.append(idx)

for num, idx in enumerate(found_indices, 1):
    print(f"\n===== MATCH {num} (line {idx}) =====")
    start = max(0, idx - 1)
    end = min(len(lines), idx + 11)
    for j in range(start, end):
        print(lines[j].strip())
