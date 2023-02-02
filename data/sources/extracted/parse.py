import json
from math import ceil

HEADING_ROW_NAME = "Row Name"
HEADING_ROW_ID = "Row ID"
MINIMUM_ID = 40000

UNOBTAINABLE = [
    "Ragged Hat",
    "Ragged Hat (Altered)",
    "Ragged Armor",
    "Ragged Armor (Altered)",
    "Ragged Gloves",
    "Ragged Loincloth",
    "Millicent's Robe",
    "Millicent's Tunic",
    "Millicent's Gloves",
    "Millicent's Boots",
    "Brave's Leather Helm",
    "Brave's Cord Circlet",
    "Brave's Battlewear",
    "Brave's Battlewear (Altered)",
    "Brave's Bracer",
    "Brave's Legwraps",
    "Golden Prosthetic",
    "Deathbed Smalls",
    "Grass Hair Ornament",
]


class Table:

    def __init__(self, data):
        self.headings = []
        self.rows = []
        self.__parse(data)

    def __parse(self, data):
        lines = data.splitlines()
        self.headings = lines[0].split(";")
        self.rows = [x.split(";") for x in lines[1:]]

    def get_names(self):
        name_index = self.headings.index(HEADING_ROW_NAME)
        return list(set([x[name_index] for x in self.rows if x[name_index] != ""]))

    def get_value_by_name(self, name, value_heading):
        name_index = self.headings.index(HEADING_ROW_NAME)
        for row in self.rows:
            if row[name_index] == name:
                return row[self.headings.index(value_heading)]
        raise ValueError

    def get_row_object_for_name(self, name):
        output = {}

        desired_row = None
        name_index = self.headings.index(HEADING_ROW_NAME)
        for row in self.rows:
            if row[name_index] == name:
                desired_row = row
                break

        for i, heading in enumerate(self.headings):
            if heading == HEADING_ROW_NAME:
                continue
            output[heading] = desired_row[i]

        return output


def convert_toughness_correct_rate(value):
    return int(value * 1000)


def convert_cut_rate(value):
    return round((1 - value) * 100, 1)


def parse_data(armor_data):
    parsed = []

    for name in sorted(armor_data.get_names()):
        row_object = armor_data.get_row_object_for_name(name)

        if int(row_object[HEADING_ROW_ID]) < MINIMUM_ID or name in UNOBTAINABLE:
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

        parsed.append({
            "name": name,
            "slot": slot,
            "weight": float(row_object["weight"]),
            "poise": convert_toughness_correct_rate(float(row_object["toughnessCorrectRate"])),
            "immunity": int(row_object["resistPoison"]),
            "robustness": int(row_object["resistBlood"]),
            "focus": int(row_object["resistMadness"]),
            "vitality": int(row_object["resistCurse"]),
            "defensePhysical": convert_cut_rate(float(row_object["neutralDamageCutRate"])),
            "defensePhysicalSlash": convert_cut_rate(float(row_object["slashDamageCutRate"])),
            "defensePhysicalStrike": convert_cut_rate(float(row_object["blowDamageCutRate"])),
            "defensePhysicalPierce": convert_cut_rate(float(row_object["thrustDamageCutRate"])),
            "defenseMagic": convert_cut_rate(float(row_object["magicDamageCutRate"])),
            "defenseFire": convert_cut_rate(float(row_object["fireDamageCutRate"])),
            "defenseLightning": convert_cut_rate(float(row_object["thunderDamageCutRate"])),
            "defenseHoly": convert_cut_rate(float(row_object["darkDamageCutRate"])),
        })

    return parsed


if __name__ == "__main__":

    armor_data = None
    with open("EquipParamProtector.csv", "r") as f:
        armor_data = Table(f.read())

    parsed_data = parse_data(armor_data)

    with open("armor_data.json", "w") as f:
        json.dump(parsed_data, f, indent=2)
