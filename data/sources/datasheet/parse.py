import csv
import json

SLOT_MAP = {
    "Head": "head",
    "Body": "body",
    "Arm": "arms",
    "Leg": "legs",
}

rows = []
with open("data.csv", "r") as f:
    reader = csv.reader(f, delimiter=",", quotechar="\"")
    rows = list(reader)

armor_data = []
headings = rows[0]

for row in rows[1:]:
    armor = {
        "name": row[headings.index("Name")],
        "slot": SLOT_MAP[row[headings.index("Equip Slot")]],
        "weight": float(row[headings.index("Weight")]),
        "poise": int(row[headings.index("Poise")]),
        "immunity": int(row[headings.index("Immunity (Poison and Rot)")]),
        "robustness": int(row[headings.index("Robustness (Blood)")]),
        "focus": int(row[headings.index("Focus (Madness)")]),
        "vitality": int(row[headings.index("Vitality (Death Blight)")]),
        "defensePhysical": float(row[headings.index("Damage Negation (Physical)")]),
        "defensePhysicalStrike": float(row[headings.index("Damage Negation (VS Strike)")]),
        "defensePhysicalSlash": float(row[headings.index("Damage Negation (VS Slash)")]),
        "defensePhysicalPierce": float(row[headings.index("Damage Negation (VS Pierce)")]),
        "defenseMagic": float(row[headings.index("Damage Negation (Magic)")]),
        "defenseFire": float(row[headings.index("Damage Negation (Fire)")]),
        "defenseLightning": float(row[headings.index("Damage Negation (Lightning)")]),
        "defenseHoly": float(row[headings.index("Damage Negation (Holy)")]),
    }
    armor_data.append(armor)
armor_data.sort(key=lambda x: x["name"])

with open("armor_data.json", "w") as f:
    json.dump(armor_data, f, indent=2)
