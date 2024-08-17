import json
import sys


def convert_toughness_correct_rate(value):
    return int(value * 1000)


def convert_cut_rate(value):
    return round((1 - value) * 100, 1)


def parse(csv_contents):
    lines = csv_contents.splitlines()
    column_names = lines[0].split(",")

    armor_data = []
    for line in lines[1:]:
        row_object = {column_name: value.strip() for column_name,
                      value in zip(column_names, line.split(","))}

        if row_object["sortId"] == "99999" or row_object["sortId"] == "9999999":
            continue

        name = row_object["Row Name"]

        if name == "":
            continue

        slot = "unknown"
        for column, equip_type in [["headEquip", "head"], ["bodyEquip", "body"], ["armEquip", "arms"], ["legEquip", "legs"]]:
            if row_object[column] == "1":
                slot = equip_type
                break

        # correction for rotten duelist greaves
        if name == "Rotten Duelist Greaves":
            slot = "legs"

        # correction for deathbed dress
        if name == "Deathbed Dress":
            slot = "body"

        # correction for fia's robe
        if name == "Fia's Robe" or name == "Fia's Robe (Altered)":
            slot = "body"

        armor_data.append({
            "name": name,
            "slot": slot,
            "weight": float(row_object["weight"]),
            "poise": convert_toughness_correct_rate(float(row_object["toughnessCorrectRate"])),
            "immunity": int(row_object["resistPoison"]),
            "robustness": int(row_object["resistBlood"]),
            "focus": int(row_object["resistMadness"]),
            "vitality": int(row_object["resistCurse"]),
            "defensePhysical": convert_cut_rate(float(row_object["neutralDamageCutRate"])),
            "defensePhysicalStrike": convert_cut_rate(float(row_object["blowDamageCutRate"])),
            "defensePhysicalSlash": convert_cut_rate(float(row_object["slashDamageCutRate"])),
            "defensePhysicalPierce": convert_cut_rate(float(row_object["thrustDamageCutRate"])),
            "defenseMagic": convert_cut_rate(float(row_object["magicDamageCutRate"])),
            "defenseFire": convert_cut_rate(float(row_object["fireDamageCutRate"])),
            "defenseLightning": convert_cut_rate(float(row_object["thunderDamageCutRate"])),
            "defenseHoly": convert_cut_rate(float(row_object["darkDamageCutRate"])),
        })

    armor_data.sort(key=lambda x: x["name"])

    return armor_data


if __name__ == "__main__":
    with open(sys.argv[1], "r") as file:
        csv_contents = file.read()
    armor_data = parse(csv_contents)
    with open("armor_data.json", "w") as file:
        json.dump(armor_data, file)
