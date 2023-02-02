from bs4 import BeautifulSoup
import requests
import json

HEADING_ORDER = [
    "defensePhysical",
    "defensePhysicalStrike",
    "defensePhysicalSlash",
    "defensePhysicalPierce",
    "defenseMagic",
    "defenseFire",
    "defenseLightning",
    "defenseHoly",
    "immunity",
    "robustness",
    "focus",
    "vitality",
    "poise",
    "weight",
]


def extract_from_html(content, slot):
    soup = BeautifulSoup(content, features="html.parser")
    for table_row in soup.find_all("tr"):
        name_cell = table_row.find("td")
        if name_cell is None:
            continue
        name = name_cell.find_all("a")[-1].get_text().strip()

        armor = {
            "name": name,
            "slot": slot,
            "weight": 0,
            "poise": 0,
            "immunity": 0,
            "robustness": 0,
            "focus": 0,
            "vitality": 0,
            "defensePhysical": 0,
            "defensePhysicalStrike": 0,
            "defensePhysicalSlash": 0,
            "defensePhysicalPierce": 0,
            "defenseMagic": 0,
            "defenseFire": 0,
            "defenseLightning": 0,
            "defenseHoly": 0,
        }

        for attribute, cell in zip(HEADING_ORDER, [x for x in table_row.children if x != "\n"][1:len(HEADING_ORDER) + 1]):
            cell_text = cell.get_text()
            if "defense" in attribute or attribute == "weight":
                armor[attribute] = float(cell_text)
            else:
                armor[attribute] = int(cell_text)

        yield armor


if __name__ == "__main__":
    armor_data = []
    armor_data.extend(extract_from_html(requests.get(
        "https://eldenring.wiki.fextralife.com/Helms").text, "head"))
    armor_data.extend(extract_from_html(requests.get(
        "https://eldenring.wiki.fextralife.com/Chest+Armor").text, "body"))
    armor_data.extend(extract_from_html(requests.get(
        "https://eldenring.wiki.fextralife.com/Gauntlets").text, "arms"))
    armor_data.extend(extract_from_html(requests.get(
        "https://eldenring.wiki.fextralife.com/Leg+Armor").text, "legs"))
    armor_data.sort(key=lambda x: x["name"])
    with open("armor_data.json", "w") as f:
        json.dump(armor_data, f, indent=2)
