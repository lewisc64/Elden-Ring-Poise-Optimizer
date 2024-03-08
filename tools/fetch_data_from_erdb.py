import requests
import json

CATEGORY_TO_SLOT_MAP = {
    "Head": "head",
    "Body": "body",
    "Arms": "arms",
    "Legs": "legs",
}

ERDB_ARMOR_ENDPOINT = "https://api.erdb.wiki/v1/latest/armor/"


def fetch_erdb_data():
    return requests.get(ERDB_ARMOR_ENDPOINT).json()


def transform_erdb_data(erdb_data):
    data = []
    for key, item in erdb_data.items():
        data.append({
            "name": key,
            "slot": CATEGORY_TO_SLOT_MAP[item["category"]],
            "weight": item["weight"],
            "poise": item["resistances"]["poise"],
            "immunity": item["resistances"]["immunity"],
            "robustness": item["resistances"]["robustness"],
            "focus": item["resistances"]["focus"],
            "vitality": item["resistances"]["vitality"],
            "defensePhysical": item["absorptions"]["physical"],
            "defensePhysicalStrike": item["absorptions"]["strike"],
            "defensePhysicalSlash": item["absorptions"]["slash"],
            "defensePhysicalPierce": item["absorptions"]["pierce"],
            "defenseMagic": item["absorptions"]["magic"],
            "defenseFire": item["absorptions"]["fire"],
            "defenseLightning": item["absorptions"]["lightning"],
            "defenseHoly": item["absorptions"]["holy"]
        })

    data.sort(key=lambda x: x["name"])
    return data


if __name__ == "__main__":
    erdb_data = fetch_erdb_data()
    data = transform_erdb_data(erdb_data)

    with open("data.json", "w") as file:
        json.dump(data, file)
