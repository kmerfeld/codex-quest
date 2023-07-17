import { Button, Checkbox, Modal, Typography } from "antd";
import { SpellItem, Spell } from "../components/types";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import SpellData from "../data/spells.json";
import { clericSpellBudget, magicUserSpellBudget } from "../data/spellBudgets";
import { hitDiceModifiers } from "../data/hitDiceModifiers";
import ModalCloseIcon from "./ModalCloseIcon/ModalCloseIcon";
import { classChoices } from "../data/classDetails";
import { LevelUpModalProps, SpellCheckboxGroupProps } from "./definitions";
import HomebrewWarning from "../components/HomebrewWarning/HomebrewWarning";

const roller = new DiceRoller();

const getSpellBudget = (characterClass: string) => {
  if (characterClass.includes("Magic-User")) {
    return magicUserSpellBudget;
  } else if (characterClass.includes("Cleric")) {
    return clericSpellBudget;
  } else if (!classChoices.includes(characterClass)) {
    return new Array(9).fill(Infinity);
  }
};

const getSpellLevel = (spell: Spell, characterClass: string) => {
  if (characterClass.includes("Magic-User")) {
    return spell.level["magic-user"];
  } else if (characterClass.includes("Cleric")) {
    return spell.level["cleric"];
  } else if (!classChoices.includes(characterClass)) {
    return Math.max(...Object.values(spell.level));
  }
};

const SpellCheckboxGroup = ({
  characterClass,
  level,
  max,
  checkedSpells,
  setCheckedSpells,
  checkedSpellsCount,
  setCheckedSpellsCount,
  unrestricted = false,
}: SpellCheckboxGroupProps) => {
  if (max) {
    return (
      <>
        <Typography.Title level={4}>Level {level + 1} Spells</Typography.Title>
        <Checkbox.Group
          value={checkedSpells}
          className="mb-4"
          onChange={(checkedValues) => {
            const newCheckedSpells = checkedValues as string[];

            // Add only the spells from current level to checkedSpells
            const otherLevelSpells = checkedSpells.filter(
              (spellName: string) =>
                !SpellData.some(
                  (spell) =>
                    spell.name === spellName &&
                    getSpellLevel(spell, characterClass) === level + 1
                )
            );
            setCheckedSpells([...otherLevelSpells, ...newCheckedSpells]);

            // Update the count for current level in checkedSpellsCount
            const newCheckedSpellsCount = [...checkedSpellsCount];
            newCheckedSpellsCount[level] = newCheckedSpells.filter(
              (spellName) =>
                SpellData.some(
                  (spell) =>
                    spell.name === spellName &&
                    getSpellLevel(spell, characterClass) === level + 1
                )
            ).length;
            setCheckedSpellsCount(newCheckedSpellsCount);
          }}
        >
          {SpellData.filter(
            (spell) => getSpellLevel(spell, characterClass) === level + 1
          ).map((spell) => (
            <Checkbox
              key={spell.name}
              value={spell.name}
              className="flex-[1_1_40%] py-1"
              disabled={
                spell.name === "Read Magic" ||
                (!checkedSpells.includes(spell.name) &&
                  checkedSpellsCount[level] >= max)
              }
            >
              {spell.name}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </>
    );
  }
  return null;
};

export default function LevelUpModal({
  characterData,
  handleCancel,
  isLevelUpModalOpen,
  setCharacterData,
}: LevelUpModalProps) {
  const [checkedSpells, setCheckedSpells] = useState(
    characterData.spells.map((spell: SpellItem) => spell.name)
  );
  const [checkedSpellsCount, setCheckedSpellsCount] = useState<number[]>(
    new Array(magicUserSpellBudget[characterData.level - 1].length).fill(0)
  );

  let newHitDice: string;

  const { uid, id } = useParams();

  // Determine how many hit dice to roll
  if (characterData.level + 1 >= 10) {
    newHitDice = characterData.hp.dice.split("+")[0];
  } else {
    const prefix = characterData.level + 1;
    newHitDice = prefix.toString() + "d" + characterData.hp.dice.split("d")[1];
  }

  // Determine what, if any, modifier is added to the roll
  if (
    (characterData.class.includes("Fighter") ||
      characterData.class.includes("Assassin") ||
      characterData.class.includes("Thief")) &&
    hitDiceModifiers.double[characterData.level] !== null
  ) {
    newHitDice += `+${hitDiceModifiers.double[characterData.level]}`;
  } else if (hitDiceModifiers.single[characterData.level] !== null) {
    newHitDice += `+${hitDiceModifiers.single[characterData.level]}`;
  }

  const getSelectedSpells = (checkedSpells: string[]): Spell[] => {
    return checkedSpells
      .map((spellName) => SpellData.find((spell) => spell.name === spellName))
      .filter(Boolean) as Spell[];
  };

  const rollNewHitPoints = async (dice: string) => {
    handleCancel();
    const result = roller.roll(dice).total;

    const selectedSpells = getSelectedSpells(checkedSpells);

    setCharacterData({
      ...characterData,
      hp: { ...characterData.hp, max: result, dice },
      level: characterData.level + 1,
      spells: selectedSpells,
    });

    if (!uid || !id) {
      console.error("User ID or Character ID is undefined");
      return;
    }

    const docRef = doc(db, "users", uid, "characters", id);
    try {
      await updateDoc(docRef, {
        "hp.max": result,
        "hp.dice": dice,
        level: characterData.level + 1,
        spells: selectedSpells,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  useEffect(() => {
    const initialCheckedSpellsCount = magicUserSpellBudget[
      characterData.level - 1
    ].map(
      (_, index) =>
        checkedSpells.filter((spellName) =>
          SpellData.some(
            (spell) =>
              spell.name === spellName &&
              spell.level["magic-user"] === index + 1
          )
        ).length
    );

    setCheckedSpellsCount(initialCheckedSpellsCount);
  }, [characterData.level, checkedSpells]);

  return (
    <Modal
      title="LEVEL UP MODAL"
      open={isLevelUpModalOpen}
      onCancel={handleCancel}
      footer={false}
      closeIcon={<ModalCloseIcon />}
    >
      {classChoices.map((characterClass) => {
        if (characterData.class.includes(characterClass)) {
          const spellBudget = getSpellBudget(characterClass);
          if (spellBudget && spellBudget[characterData.level]) {
            return spellBudget[characterData.level].map(
              (max: number, index: number) => (
                <SpellCheckboxGroup
                  key={index}
                  characterClass={characterClass}
                  level={index}
                  max={max}
                  checkedSpells={checkedSpells}
                  setCheckedSpells={setCheckedSpells}
                  checkedSpellsCount={checkedSpellsCount}
                  setCheckedSpellsCount={setCheckedSpellsCount}
                />
              )
            );
          }
        }
        return null;
      })}

      {!classChoices.includes(characterData.class) && (
        <HomebrewWarning homebrew="Race or Class" />
      )}
      {!classChoices.some((choice) => characterData.class.includes(choice)) && // For classes that are not in classChoices
        new Array(6)
          .fill(0)
          .map((_, index) => (
            <SpellCheckboxGroup
              key={index}
              characterClass={characterData.class}
              level={index}
              max={Infinity}
              checkedSpells={checkedSpells}
              setCheckedSpells={setCheckedSpells}
              checkedSpellsCount={checkedSpellsCount}
              setCheckedSpellsCount={setCheckedSpellsCount}
            />
          ))}

      <Button type="primary" onClick={() => rollNewHitPoints(newHitDice)}>
        Roll new Hit Points ({newHitDice})
      </Button>
    </Modal>
  );
}
