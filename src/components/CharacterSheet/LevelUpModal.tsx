import { Button, Checkbox, Modal } from "antd";
import { LevelUpModalProps, SpellItem, Spell } from "../types";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import SpellData from "../../data/spells.json";

const roller = new DiceRoller();

const magicUserSpellBudget = [
  [2, 0, 0, 0, 0, 0],
  [3, 0, 0, 0, 0, 0],
  [3, 1, 0, 0, 0, 0],
  [3, 2, 0, 0, 0, 0],
  [3, 2, 1, 0, 0, 0],
  [4, 2, 2, 0, 0, 0],
  [4, 2, 2, 1, 0, 0],
  [4, 3, 2, 2, 0, 0],
  [4, 3, 2, 2, 1, 0],
  [5, 3, 3, 2, 2, 0],
  [5, 4, 3, 2, 2, 1],
  [5, 4, 3, 3, 2, 2],
  [5, 4, 4, 3, 2, 2],
  [5, 4, 4, 3, 3, 2],
  [6, 4, 4, 3, 3, 2],
  [6, 5, 4, 3, 3, 2],
  [6, 5, 4, 4, 3, 3],
  [7, 5, 4, 4, 3, 3],
  [7, 5, 5, 4, 3, 3],
  [7, 5, 5, 4, 4, 3],
];

const clericSpellBudget = [
  [0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 0, 0],
  [2, 1, 0, 0, 0, 0],
  [2, 2, 0, 0, 0, 0],
  [2, 2, 1, 0, 0, 0],
  [3, 2, 2, 0, 0, 0],
  [3, 2, 2, 1, 0, 0],
  [3, 3, 2, 2, 0, 0],
  [3, 3, 2, 2, 1, 0],
  [4, 3, 3, 2, 2, 0],
  [4, 4, 3, 2, 2, 1],
  [4, 4, 3, 3, 2, 2],
  [4, 4, 4, 3, 2, 2],
  [4, 4, 4, 3, 3, 2],
  [5, 4, 4, 3, 3, 2],
  [5, 5, 4, 3, 3, 2],
  [5, 5, 4, 4, 3, 3],
  [6, 5, 4, 4, 3, 3],
  [6, 5, 5, 4, 3, 3],
];

export default function LevelUpModal({
  character,
  handleCancel,
  isLevelUpModalOpen,
  hitDiceModifiers,
  setCharacter,
}: LevelUpModalProps) {
  const [checkedSpells, setCheckedSpells] = useState(
    character.spells.map((spell: SpellItem) => spell.name)
  );
  const [checkedSpellsCount, setCheckedSpellsCount] = useState<number[]>(
    new Array(magicUserSpellBudget[character.level - 1].length).fill(0)
  );

  console.log("this is here to pass github actions", clericSpellBudget);

  let newHitDice: string;

  const { uid, id } = useParams();

  // Determine how many hit dice to roll
  if (character.level + 1 >= 10) {
    newHitDice = "9" + character.hp.dice;
  } else {
    const prefix = character.level + 1;
    newHitDice = prefix.toString() + "d" + character.hp.dice.split("d")[1];
  }

  // Determine what, if any, modifier is added to the roll
  if (
    (character.class.includes("Fighter") ||
      character.class.includes("Thief")) &&
    hitDiceModifiers.double[character.level] !== null
  ) {
    newHitDice += `+${hitDiceModifiers.double[character.level]}`;
  } else if (hitDiceModifiers.single[character.level] !== null) {
    newHitDice += `+${hitDiceModifiers.single[character.level]}`;
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

    setCharacter({
      ...character,
      hp: { ...character.hp, max: result, dice },
      level: character.level + 1,
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
        level: character.level + 1,
        spells: selectedSpells,
      });
      console.log(
        `${character.name}'s level, max HP, HP dice, and spells have been updated.`
      );
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  useEffect(() => {
    const initialCheckedSpellsCount = magicUserSpellBudget[
      character.level - 1
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
  }, [character.level, checkedSpells]);

  return (
    <Modal
      title="LEVEL UP MODAL"
      open={isLevelUpModalOpen}
      onCancel={handleCancel}
      footer={false}
    >
      {character.class.includes("Magic-User") &&
        magicUserSpellBudget[character.level].map((max: number, index) => {
          if (max) {
            return (
              <Checkbox.Group
                key={index}
                value={checkedSpells}
                onChange={(checkedValues) => {
                  const newCheckedSpells = checkedValues as string[];

                  // Add only the spells from current level to checkedSpells
                  const otherLevelSpells = checkedSpells.filter(
                    (spellName) =>
                      !SpellData.some(
                        (spell) =>
                          spell.name === spellName &&
                          spell.level["magic-user"] === index + 1
                      )
                  );
                  setCheckedSpells([...otherLevelSpells, ...newCheckedSpells]);

                  // Update the count for current level in checkedSpellsCount
                  const newCheckedSpellsCount = [...checkedSpellsCount];
                  newCheckedSpellsCount[index] = newCheckedSpells.filter(
                    (spellName) =>
                      SpellData.some(
                        (spell) =>
                          spell.name === spellName &&
                          spell.level["magic-user"] === index + 1
                      )
                  ).length;
                  setCheckedSpellsCount(newCheckedSpellsCount);
                }}
              >
                level: {index + 1}{" "}
                {SpellData.filter(
                  (spell) => spell.level["magic-user"] === index + 1
                ).map((spell) => (
                  <Checkbox
                    key={spell.name}
                    value={spell.name}
                    disabled={
                      spell.name === "Read Magic" ||
                      (!checkedSpells.includes(spell.name) &&
                        checkedSpellsCount[index] >= max)
                    }
                  >
                    {spell.name}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            );
          }
          return undefined;
        })}

      {character.class.includes("Cleric") && <div>clerical</div>}
      <Button type="primary" onClick={() => rollNewHitPoints(newHitDice)}>
        Roll new Hit Points ({newHitDice})
      </Button>
    </Modal>
  );
}