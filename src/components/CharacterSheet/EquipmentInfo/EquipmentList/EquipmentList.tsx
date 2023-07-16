import { EquipmentListProps } from "./definitions";
import equipmentItems from "../../../../data/equipment-items.json";
import { Button, Descriptions, Radio, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { EquipmentItem } from "../../../EquipmentStore/definitions";

const itemDescription = (item: EquipmentItem) => (
  <Descriptions bordered size="small" column={1}>
    {item.weight && (
      <Descriptions.Item label="Weight">{item.weight}</Descriptions.Item>
    )}
    {item.size && (
      <Descriptions.Item label="Size">{item.size}</Descriptions.Item>
    )}
    {item.amount && (
      <Descriptions.Item label="Amount">{item.amount}</Descriptions.Item>
    )}
    {item.AC && <Descriptions.Item label="AC">{item.AC}</Descriptions.Item>}
    {item.damage && (
      <Descriptions.Item label="Damage">{item.damage}</Descriptions.Item>
    )}
  </Descriptions>
);

export default function EquipmentList({
  characterData,
  setCharacterData,
  categories,
  handleCustomDelete,
  handleAttack,
  handleAttackClick,
  updateAC,
  attackBonus,
  setWeapon,
  showAttackModal,
}: EquipmentListProps) {
  const shownItems = characterData.equipment
    .filter((item) => categories.includes(item.category))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleUpdateAC = (item: string, type: string) => {
    const oldArmor = characterData.wearing?.armor;
    const oldShield = characterData.wearing?.shield;

    setCharacterData({
      ...characterData,
      wearing: {
        armor: characterData.wearing?.armor || "",
        shield: characterData.wearing?.shield || "",
        [type]: item,
      },
    });

    const newArmor = characterData.wearing?.armor;
    const newShield = characterData.wearing?.shield;

    if (oldArmor !== newArmor || oldShield !== newShield) {
      updateAC && updateAC();
    }
  };

  console.error("TODOS STILL UNRESOLVED");

  return categories.includes("armor") || categories.includes("shields") ? (
    <Radio.Group
      className="flex flex-col"
      size="small"
      value={
        categories.includes("armor")
          ? characterData.wearing?.armor
          : characterData.wearing?.shield
      }
      onChange={(e) => {
        const type = categories.includes("armor") ? "armor" : "shield";
        handleUpdateAC(e.target.value, type);
      }}
    >
      {categories.includes("armor") && (
        <Radio value="">
          <Typography.Paragraph className="font-bold mb-3">
            No Armor
          </Typography.Paragraph>
        </Radio>
      )}
      {categories.includes("shields") && (
        <Radio value="">
          <Typography.Paragraph className="font-bold mb-3">
            No Shield
          </Typography.Paragraph>
        </Radio>
      )}
      {shownItems.map((item) => {
        if (item.name === "No Shield" || item.name === "No Armor") return null;
        return (
          <Radio key={item.name} value={item.name}>
            <div>
              <Typography.Paragraph className="font-bold mb-3">
                {item.name}
              </Typography.Paragraph>
              {!equipmentItems.some(
                (equipmentItem) => equipmentItem.name === item.name
              ) &&
                characterData.wearing &&
                item.name !== characterData.wearing.armor &&
                item.name !== characterData.wearing.shield && (
                  <Button
                    type="default"
                    icon={<DeleteOutlined />}
                    shape="circle"
                    onClick={() => handleCustomDelete(item)}
                  />
                )}
            </div>
            {itemDescription(item)}
          </Radio>
        );
      })}
    </Radio.Group>
  ) : (
    <div className="[&>div+div]:mt-4">
      {shownItems.map((item) => (
        <div key={item.name}>
          <div className="flex items-baseline gap-4">
            <Typography.Paragraph className="font-bold mb-3">
              {item.name}
            </Typography.Paragraph>
            {!equipmentItems.some(
              (equipmentItem) => equipmentItem.name === item.name
            ) && (
              <Button
                type="default"
                icon={<DeleteOutlined />}
                shape="circle"
                onClick={() => handleCustomDelete(item)}
              />
            )}
          </div>
          {itemDescription(item)}
          {handleAttack && handleAttackClick && (
            <>
              <div className="text-right mt-3">
                <Button type="primary" onClick={() => handleAttackClick(item)}>
                  Attack
                </Button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// import {
//   Button,
//   Descriptions,
//   Radio,
//   RadioChangeEvent,
//   Typography,
// } from "antd";
// import { EquipmentListProps, ItemDescriptionProps } from "./definitions";
// import { EquipmentItem } from "../../../EquipmentStore/definitions";
// import { DeleteOutlined } from "@ant-design/icons";
// import allEquipmentItems from "../../../../data/equipment-items.json";
// import { useEffect, useMemo, useState } from "react";

// export default function EquipmentList({
//   character,
//   setCharacter,
//   categories,
//   handleAttack,
//   setWeapon,
//   showAttackModal,
//   calculatedAC,
//   setCalculatedAC,
//   radios,
// }: EquipmentListProps) {
//   const equipmentItems = useMemo(() => {
//     if (typeof categories === "string") {
//       return character.equipment
//         .filter((items) => items.category === categories)
//         .sort((a, b) => a.name.localeCompare(b.name));
//     } else {
//       return character.equipment
//         .filter((item) => {
//           // Check if the item's category is in the categories array
//           if (categories.includes(item.category)) {
//             // Further filter based on name if the category is 'armor-and-shields'
//             // This is being done because originally, there was an 'armor-and-shields' category that included both armor and shields
//             if (item.category === "armor-and-shields") {
//               if (categories.includes("armor")) {
//                 // Only include the item if its name includes 'Armor' (case insensitive)
//                 return item.name.toLowerCase().includes("armor");
//               } else if (categories.includes("shields")) {
//                 // Only include the item if its name includes 'Shield' (case insensitive)
//                 return item.name.toLowerCase().includes("shield");
//               }
//             }
//             // If the category is not 'armor-and-shields', include the item
//             return true;
//           }
//           // If the item's category is not in the categories array, exclude the item
//           return false;
//         })
//         .sort((a, b) => a.name.localeCompare(b.name));
//     }
//   }, [character.equipment, categories]);

//   const handleAttackClick = (item: EquipmentItem) => {
//     if (setWeapon) {
//       setWeapon(item);
//     }
//     if (showAttackModal) {
//       showAttackModal();
//     }
//   };

//   const handleCustomDelete = (item: EquipmentItem) => {
//     const newEquipment = character.equipment.filter(
//       (e) => e.name !== item.name
//     );
//     if (setCharacter) setCharacter({ ...character, equipment: newEquipment });
//     else
//       console.error("Cannot delete item because setCharacter is not defined");
//   };

//   const ItemDescription = ({
//     item,
//     hideAmount,
//     hideTrash,
//   }: ItemDescriptionProps) => {
//     return (
//       <>
//         <div className="flex items-baseline gap-4">
//           <Typography.Paragraph className="font-bold mb-3">
//             {item.name}
//           </Typography.Paragraph>
//           {!hideTrash &&
//             !allEquipmentItems.find((e) => e.name === item.name) && (
//               <Button
//                 type="default"
//                 icon={<DeleteOutlined />}
//                 shape="circle"
//                 onClick={() => handleCustomDelete(item)}
//               />
//             )}
//         </div>
//         <Descriptions bordered size="small" column={1}>
//           {item.weight && (
//             <Descriptions.Item label="Weight">{item.weight}</Descriptions.Item>
//           )}
//           {item.size && (
//             <Descriptions.Item label="Size">{item.size}</Descriptions.Item>
//           )}
//           {item.amount && !hideAmount && (
//             <Descriptions.Item label="Amount">{item.amount}</Descriptions.Item>
//           )}
//           {item.AC && (
//             <Descriptions.Item label="AC">{item.AC}</Descriptions.Item>
//           )}
//           {item.damage && (
//             <Descriptions.Item label="Damage">{item.damage}</Descriptions.Item>
//           )}
//         </Descriptions>
//         {handleAttack && (
//           <>
//             <div className="text-right mt-3">
//               <Button type="primary" onClick={() => handleAttackClick(item)}>
//                 Attack
//               </Button>
//             </div>
//           </>
//         )}
//       </>
//     );
//   };

//   // const handleWearingChange = (event: RadioChangeEvent) => {
//   //   if (setCharacter) {
//   //     if (event.target.value.toLowerCase().includes("armor")) {
//   //       setArmorWorn(event.target.value);
//   //       setCharacter({
//   //         ...character,
//   //         wearing: {
//   //           armor: event.target.value,
//   //           shield: character.wearing?.shield || "No Shield",
//   //         },
//   //       });
//   //     } else {
//   //       setShieldWorn(event.target.value);
//   //       setCharacter({
//   //         ...character,
//   //         wearing: {
//   //           shield: event.target.value,
//   //           armor: character.wearing?.armor || "No Armor",
//   //         },
//   //       });
//   //     }
//   //   }
//   // };

//   // useEffect(() => {
//   //   const armorAC =
//   //     equipmentItems.find((item) => item.name === character.wearing?.armor)
//   //       ?.AC || 11;
//   //   const shieldAC =
//   //     equipmentItems.find((item) => item.name === character.wearing?.shield)
//   //       ?.AC || 0;
//   //   console.log(armorAC, +shieldAC, character.wearing);
//   //   setCalculatedAC && setCalculatedAC(+armorAC + +shieldAC);
//   // }, [character.wearing]);

//   return (
//     <></>
//     //  {radios ? (
//     //     <Radio.Group
//     //       size="small"
//     //       className="flex flex-col"
//     //       onChange={handleWearingChange}
//     //       value={categories.includes("armor") ? armorWorn : shieldWorn}
//     //     >
//     //       <Radio
//     //         className="block"
//     //         value={categories.includes("armor") ? "No Armor" : "No Shield"}
//     //       >
//     //         <ItemDescription
//     //           item={{
//     //             name: categories.includes("armor") ? "No Armor" : "No Shield",
//     //             costValue: 0,
//     //             costCurrency: "gp",
//     //             category: categories.includes("armor") ? "armor" : "shield",
//     //             weight: 0,
//     //             amount: 1,
//     //             AC: categories.includes("armor") ? 11 : 0,
//     //           }}
//     //           hideAmount
//     //           hideTrash
//     //         />
//     //       </Radio>
//     //       {equipmentItems.map((item) => (
//     //         <Radio key={item.name} value={item.name} className="block">
//     //           <ItemDescription item={item} />
//     //         </Radio>
//     //       ))}
//     //     </Radio.Group>
//     //   ) : (
//     //     <ul className="list-none p-0 m-0 [&>li+li]:mt-4 [&>li+li]:border-solid [&>li+li]:border-t [&>li+li]:border-t-gray-200 [&>li+li]:border-l-0 [&>li+li]:border-r-0 [&>li+li]:border-b-0 [&>li+li]:pt-4">
//     //       {equipmentItems.map((item) => (
//     //         <li>
//     //           <ItemDescription item={item} />
//     //         </li>
//     //       ))}
//     //     </ul>
//     //   )}
//     // </>
//   );
// }
