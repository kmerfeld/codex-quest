import { useEffect, useState } from "react";
import {
  Abilities,
  AbilityTypes,
} from "../components/CharacterCreator/CharacterAbilities/definitions";
import { classes } from "../data/classes";
import { ClassNames, RaceNames } from "../data/definitions";
import { races } from "../data/races";
import { SavingThrowsType } from "../components/CharacterSheet/SavingThrows/definitions";
import { CharacterData, SetCharacterData } from "../components/definitions";
import equipmentItems from "../data/equipmentItems.json";
import { getCarryingCapacity } from "./formatSupport";

export const getClassType = (characterClass: string[]) => {
  // NONE
  if (
    characterClass.length === 0 ||
    characterClass.every((className) => className === "")
  )
    return "none";

  // STANDARD
  if (
    characterClass.length === 1 &&
    characterClass.every((className) => isStandardClass(className))
  ) {
    return "standard";
  }

  // COMBINATION
  if (
    characterClass.length === 1 &&
    characterClass[0]
      .split(" ")
      .every((className) => isStandardClass(className))
  ) {
    return "combination";
  }

  if (
    characterClass.length > 1 &&
    characterClass.every((className) => isStandardClass(className))
  ) {
    return "combination";
  }

  // CUSTOM
  return "custom";
};

export const isStandardClass = (className: string) =>
  Object.values(ClassNames).includes(className as ClassNames);

export const isStandardRace = (raceName: string) =>
  Object.values(RaceNames).includes(raceName as RaceNames);

export function getDisabledClasses(
  raceKey: RaceNames,
  abilities: Abilities
): ClassNames[] {
  const race = races[raceKey];
  const disabledClasses = [];

  // Check if the race is defined
  if (!race) return [];

  for (const className of Object.values(ClassNames)) {
    const classSetup = classes[className];

    // Check if the class is allowed for the race
    if (
      !race.allowedStandardClasses?.includes(className) &&
      !race.allowedCombinationClasses?.includes(className)
    ) {
      disabledClasses.push(className);
      continue;
    }

    // Check ability requirements
    if (classSetup.minimumAbilityRequirements) {
      for (const ability of Object.keys(
        classSetup.minimumAbilityRequirements
      ) as (keyof AbilityTypes)[]) {
        const requirement = classSetup.minimumAbilityRequirements[ability];
        if (requirement && +abilities.scores[ability] < requirement) {
          disabledClasses.push(className);
          break;
        }
      }
    }
  }

  return disabledClasses;
}

// Get the saving throws for a class at a given level
export const getSavingThrows = (className: string, level: number) =>
  classes[className as ClassNames]?.savingThrows.find(
    (savingThrow) => (savingThrow[0] as number) >= level
  )?.[1] as SavingThrowsType;

// Get the total weight of a saving throw object in order to determine "best"
export const getSavingThrowsWeight = (savingThrows: SavingThrowsType) =>
  Object.values(savingThrows).reduce((prev, curr) => prev + curr, 0);

export function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const getHitPointsModifier = (classArr: string[]) => {
  let modifier = 0;
  for (const className of classArr) {
    const classHitDiceModifier =
      classes[className as ClassNames]?.hitDiceModifier;
    if (classHitDiceModifier > modifier) {
      modifier = classHitDiceModifier;
    }
  }
  return modifier;
};

export const getSpecialAbilityRaceOverrides = (raceName: RaceNames) =>
  races[raceName]?.specialAbilitiesOverride ?? [];

export const getArmorClass = (
  characterData: CharacterData,
  setCharacterData: SetCharacterData,
  type: "missile" | "melee" = "melee"
) => {
  if (!characterData) return;

  let armorClass = races[characterData.race as RaceNames]?.altBaseAC || 11;
  let armorAC = 0;
  let shieldAC = 0;

  if (!characterData.wearing) {
    setCharacterData({
      ...characterData,
      wearing: { armor: "", shield: "" },
    });
  } else {
    armorAC = Number(
      equipmentItems.filter(
        (item) => item.name === characterData.wearing?.armor
      )[0]?.AC ||
        characterData.equipment.filter(
          (item) => item.name === characterData.wearing?.armor
        )[0]?.AC ||
        0
    );
    if (type === "melee") {
      shieldAC = Number(
        equipmentItems.filter(
          (item) => item.name === characterData.wearing?.shield
        )[0]?.AC ||
          characterData.equipment.filter(
            (item) => item.name === characterData.wearing?.shield
          )[0]?.AC ||
          0
      );
    } else {
      shieldAC = Number(
        equipmentItems.filter(
          (item) => item.name === characterData.wearing?.shield
        )[0]?.missileAC ||
          characterData.equipment.filter(
            (item) => item.name === characterData.wearing?.shield
          )[0]?.missileAC ||
          0
      );
    }
    armorClass =
      armorAC + shieldAC > armorClass + shieldAC
        ? armorAC + shieldAC
        : armorClass + shieldAC;
  }

  return armorClass;
};

export const getHitDice = (
  level: number,
  className: string[],
  dice: string
) => {
  const dieType = dice.split("d")[1].split("+")[0];
  const prefix = Math.min(level, 9);

  // Calculate the suffix
  let suffix = (level > 9 ? level - 9 : 0) * getHitPointsModifier(className);

  // Combine to create the result
  const result = `${prefix}d${dieType}${suffix > 0 ? "+" + suffix : ""}`;
  return result;
};

export const getAttackBonus = function (characterData: CharacterData) {
  if (getClassType(characterData.class) === "custom") return 0;
  let maxAttackBonus = 0;

  characterData.class.forEach((classPiece) => {
    const classAttackBonus =
      classes[classPiece as ClassNames]?.attackBonus[characterData.level];
    if (classAttackBonus > maxAttackBonus) {
      maxAttackBonus = classAttackBonus;
    }
  });

  return maxAttackBonus;
};

export const getMovement = (characterData: CharacterData) => {
  if (!characterData) return;

  const carryingCapacity = getCarryingCapacity(
    +characterData.abilities.scores.strength,
    characterData.race as RaceNames
  );

  const isWearing = (armorNames: string[]) => {
    return armorNames.includes(characterData?.wearing?.armor || "");
  };

  // This checks if there is armor being worn or not and adjusts movement.
  // TODO: Better way to do this?
  if (isWearing(["No Armor", "Magic Leather Armor", ""])) {
    return characterData.weight <= carryingCapacity.light ? 40 : 30;
  } else if (
    isWearing([
      "Studded Leather Armor",
      "Hide Armor",
      "Leather Armor",
      "Magic Metal Armor",
      "Hide Armor",
    ])
  ) {
    return characterData.weight <= carryingCapacity.light ? 30 : 20;
  } else if (
    isWearing([
      "Metal Armor",
      "Chain Mail",
      "Ring Mail",
      "Brigandine Armor",
      "Scale Mail",
      "Splint Mail",
      "Banded Mail",
      "Plate Mail",
      "Field Plate Mail",
      "Full Plate Mail",
    ])
  ) {
    return characterData.weight <= carryingCapacity.light ? 20 : 10;
  }
};
