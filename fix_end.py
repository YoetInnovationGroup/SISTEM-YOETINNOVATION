with open('src/components/clients/ClientDetail.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "onUpdateService={handleUpdateService}" in line or "onUpdateServiceStatus={handleUpdateServiceStatus}" in line or "/>" in line and skip:
        continue
    if "      )}" in line and new_lines[-1].strip() == "</AnimatePresence>":
        continue
    new_lines.append(line)

with open('src/components/clients/ClientDetail.tsx', 'w') as f:
    f.writelines(new_lines)
