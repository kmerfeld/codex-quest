import { RadioChangeEvent, UploadFile } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { User } from "firebase/auth";
import { CharSteps } from "./CreateCharacter/definitions";

export interface AbilityTypes {
  strength: number | string;
  intelligence: number | string;
  wisdom: number | string;
  dexterity: number | string;
  constitution: number | string;
  charisma: number | string;
}
interface Abilities {
  scores: AbilityTypes;
  modifiers: AbilityTypes;
}
interface HP {
  dice: string;
  points: number;
  max: number;
  desc: string;
}
interface SpellLevels {
  cleric: number | null;
  "magic-user": number | null;
}
export interface Spell {
  name: string;
  range: string;
  level: SpellLevels;
  duration: string;
  description: string;
}
interface SpecialRestriction {
  race: string[];
  class: string[];
}
interface SavingThrows {
  deathRayOrPoison: number;
  magicWands: number;
  paralysisOrPetrify: number;
  dragonBreath: number;
  spells: number;
}
export interface CharacterData {
  abilities: Abilities;
  class: string;
  race: string;
  hp: HP;
  spells: Spell[];
  gold: number;
  equipment: EquipmentItem[];
  weight: number;
  name: string;
  avatar: string;
  id?: string;
  level: number;
  specials: SpecialRestriction;
  restrictions: SpecialRestriction;
  savingThrows: SavingThrows;
  xp: number;
  desc: string;
  wearing?: { armor: string; shield: string };
}
export interface CharEquipmentStepProps extends CharSteps {
  equipmentItems: EquipmentItem[];
  rollGold?: boolean;
}
export interface EquipmentSelectorProps extends CharSteps {
  armorSelection: EquipmentItem | null;
  equipmentCategories: string[];
  equipmentItems: EquipmentItem[];
  handleWeightChange: () => void;
  updateArmorSelection: any;
  weightRestrictions: any;
}
export interface PurchasedEquipmentProps extends CharSteps {
  weightRestrictions: { light: number; heavy: number };
}
export interface EquipmentCheckboxProps extends CharSteps {
  itemName: string;
  equipmentItems: EquipmentItem[];
  handleWeightChange: () => void;
  weightRestrictions: any;
}

export interface EquipmentItem {
  name: string;
  costValue: number;
  costCurrency: string;
  weight?: number;
  category: string;
  size?: string;
  damage?: string;
  AC?: string | number;
  amount: number;
  type?: string;
}

export type Capacity = { light: number; heavy: number };
export type CapacityMap = Record<string, Capacity>;

export type SpellItem = {
  name: string;
};

export interface SpellType {
  name: string;
  range: string;
  level: {
    cleric: number | null;
    "magic-user": number | null;
  };
  duration: string;
  description: string;
}

export interface CreateCharacterModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  onCharacterAdded: () => void;
}

export interface CharacterListProps {
  user: User | null;
  characters: CharacterData[];
  onCharacterDeleted: () => void;
  className?: string;
}

export interface CharacterDetails {
  character: CharacterData;
  setCharacter?: (character: CharacterData) => void;
  className?: string;
  userIsOwner?: boolean;
  showLevelUpModal?: () => void;
}

export interface SavingThrowsTables {
  [characterClass: string]: {
    [levelRange: string]: SavingThrows;
  };
}

interface ModalProps {
  handleCancel: () => void;
  character: CharacterData;
}

export interface AttackButtonsProps {
  weapon: EquipmentItem;
  damage: (damage: string) => void;
  attack: (attack: "melee" | "missile") => void;
  type: "melee" | "missile";
  className?: string;
}

export interface RangeRadioButtons {
  missileRangeBonus: number;
  handleRangeChange: (e: RadioChangeEvent) => void;
  missileRangeValues: number[];
}

export interface CustomImageProps {
  fileList: UploadFile<any>[];
  handlePreview: (file: UploadFile) => Promise<void>;
  handleChange: (info: UploadChangeParam<UploadFile<any>>) => void;
  uploadButton: JSX.Element;
  previewOpen: boolean;
  previewTitle: string;
  handleCancel: () => void;
  previewImage: string;
}
