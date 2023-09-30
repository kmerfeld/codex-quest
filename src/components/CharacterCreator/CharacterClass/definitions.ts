import { CharacterDataStatePair, Spell } from "../../../data/definitions";

export interface CharacterClassProps extends CharacterDataStatePair {
  comboClass: boolean;
  setComboClass: (comboClass: boolean) => void;
  checkedClasses: string[];
  setCheckedClasses: (checkedClasses: string[]) => void;
  selectedSpell: Spell | null;
  setSelectedSpell: (spell: Spell | null) => void;
}
