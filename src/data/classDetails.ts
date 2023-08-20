import { marked } from "marked";
import { ClassNames } from "../components/definitions";

marked.use({ mangle: false, headerIds: false });

export const classDetails: Record<
  string,
  { description: string; specials: string[]; restrictions: string[] }
> = {
  [ClassNames.ILLUSIONIST]: {
    description: marked(
      `Illusionists are “specialist” Magic-Users who focus on the creation and manipulation of illusions, whether visual, auditory, or mental, and at higher levels quasi-real things made of tangible shadow. Though “normal” Magic-Users can create illusions, those created by a true Illusionist are superior in quality and realism. `
    ),
    specials: [
      marked(
        `**Illusionists** begins play knowing Read Magic and one other spell of first level.`
      ),
      marked(
        `Because of their expertise at creating and understanding illusions, **Illusionists** always gain an additional +2 on saves vs. any sort of illusion or phantasm.`
      ),
      marked(
        `**Illusionists** produce magic much like other types of Magic-Users, but have different spell choices. They can learn spells from each other so long as the spells are available to both classes. Illusionists may learn spells by being taught directly by another Illusionist or by studying another Illusionist's spellbook. The Illusionist may also learn appropriate spells from standard Magic-Users (or other arcane casters, if used); the spell always being at the level as it appears on the Illusionist Spell List.  If being taught, a spell can be learned in a single day; researching another Illusionist's spellbook takes one day per spell level. Either way, the spell learned must be transcribed into the Illusionist's own spellbook, at a cost of 500 gp per spell level transcribed.`
      ),
      marked(
        `Like other Magic-Users, a first level **Illusionist** begins play knowing Read Magic and one other spell of first level, recorded within a spell book`
      ),
    ],
    restrictions: [
      marked(
        `**Illusionists** may not wear any armor of any sort or use shields.`
      ),
      marked(
        `**Illusionists**, like other Magic-Users, can utilize a walking staff (or cudgel) or dagger, and of course they may use magical weapons of those types.`
      ),
    ],
  },
  [ClassNames.DRUID]: {
    description: marked(
      `Druids are nature priests, revering the gods of the natural world. Often a Druid uses mistletoe as a holy symbol, but this can vary with specific nature deities. Druids spend their time contemplating nature or in mundane forms of service such as ministering in rural areas. However, there are those who are called to go abroad to serve the natural order in a more direct way by working actively to restore balance.`
    ),
    specials: [
      marked(
        `**Druids** can cast spells of divine nature starting at 2nd level.`
      ),
      marked(
        `**Druids** have the power of **Animal Affinity**, working much like the Clerical ability to Turn Undead. They can identify any natural animal or plant, and can identify clean water.`
      ),
    ],
    restrictions: [
      marked(
        `**Druids** may not utilize metal armor of any type, and they are likewise limited to wooden shields.`
      ),
      marked(
        `**Druids** utilize any one-handed melee weapon, as well as staff, sling, and shortbow.`
      ),
    ],
  },
  [ClassNames.BARBARIAN]: {
    description: marked(
      `Barbarians are warriors born in savage lands, far from the mollifying comforts of civilization. Barbarians rely on hardiness, stealth, and foolhardy bravery to beat their enemies.`
    ),
    specials: [
      marked(
        `**Barbarians** may use any armor or shields, and may wield any weapons desired.`
      ),
      marked(
        `**Barbarians** wearing no armor or at most leather armor may employ the following abilities:`
      ),
      marked(
        `**Alertness**: Only a Thief one or more levels higher than the **Barbarian** can use their Backstab ability on the **Barbarian**.`
      ),
      marked(
        `**Animal reflexes**: The **Barbarian** can be surprised only on a roll of 1 on 1d6.`
      ),
      marked(
        `**Hunter**: In the wilderness **Barbarians** can surprise enemies on a roll of 1-3 on 1d6.`
      ),
      marked(
        `**Runner**: The **Barbarian** adds 5 feet to their tactical movement.`
      ),
      marked(
        `**Rage**: Once per day a **Barbarian** can fly into a Rage, which will last ten rounds. While raging, a **Barbarian** cannot use any abilities that require patience or concentration, nor can they activate magic items of any kind (including potions). Of course, magic items with a continuous effect (like a **Ring of Protection**) continue to function. **Barbarian**s hcan always use Rage, regardless of armor worn.

While raging, the **Barbarian** must charge directly into combat with the nearest recognizable enemy. If no enemy is nearby, the **Barbarian** must end their rage (see below) or else attack the nearest character.
        
While raging, the character temporarily gains a +2 bonus on attack rolls, damage rolls, and saving throws versus mind-altering spells, but suffers a penalty of -2 to armor class.
        
The **Barbarian** may prematurely end their rage with a successful save vs. Spells.
        
At the end of the rage, the **Barbarian** loses the rage modifiers and becomes fatigued, suffering a penalty of -2 to attack rolls, damage, armor class, and saving throws. While fatigued, the **Barbarian** may not charge nor move at a running rate. This state of fatigue lasts for an hour.
        
A **Barbarian** may use this ability up to two times per day at 6th level and three times per day at 12th level.`
      ),
    ],
    restrictions: [],
  },
  [ClassNames.ASSASSIN]: {
    description: marked(
      `There are those who make their living dealing death from the shadows. These people are called assassins. Most are trained by secret guilds or societies; civilized lands generally forbid and destroy such organizations.`
    ),
    specials: [
      marked(
        `**Assassins** have several special abilities (see table). Some abilities are shared with the Thief class, and are described in the Core Rules.`
      ),
      marked(
        `**Poison**: Assassins learn the art of making lethal poisons. Poisons are often quite expensive to make; it is not uncommon for a single application of contact poison to cost 500 gp or more. The GM is advised to take care that poison does not become too much of an easy solution for the Assassin.`
      ),
      marked(
        `**Assassinate**: This is the Assassin's primary special ability. As with the Thief's Sneak Attack ability, any time an Assassin is behind an opponent in melee and it is reasonably likely the opponent doesn't know he or she is there, an attempt to assassinate may be made. The attack must be carried out with a one-handed piercing weapon, such as a dagger or sword. The attack is rolled at an attack bonus of +4, and if the attack hits, the victim must roll a saving throw vs. Death Ray or be instantly killed. If this saving throw is a success, the victim still suffers normal weapon damage. At the GM's option, characters two or more levels lower than the Assassin may be denied a saving throw.`
      ),
      marked(
        `**Waylay**: An Assassin can attempt to knock out an opponent in a single strike. This is performed in much the same way as the Assassinate ability, but the Assassin must be using a weapon that does subduing damage normally (i.e. a club or cudgel). The attack is rolled at a +4 attack bonus; if the Assassin hits, the victim must make a saving throw vs. Death Ray or be knocked unconscious. If this roll is made, the victim still suffers normal subduing damage. Creatures knocked unconscious by a Waylay attack will remain that way for 2d8 turns if not awakened. Note that bounty hunters are often Assassins, who use the Waylay ability in the course of their (more or less) lawful activities.`
      ),
    ],
    restrictions: [
      marked(
        `**Assassins** may use any weapon, but may not wear metal armor as it interferes with stealthy activities, nor may they use shields of any sort.`
      ),
    ],
  },
  [ClassNames.CLERIC]: {
    description: marked(
      `Clerics are those who have devoted themselves to the service of a deity, pantheon or other belief system. Most Clerics spend their time in mundane forms of service such as preaching and ministering in a temple; but there are those who are called to go abroad from the temple and serve their deity in a more direct way, smiting undead monsters and aiding in the battle against evil and chaos. Player character Clerics are assumed to be among the latter group.`
    ),
    specials: [
      marked(
        `**Clerics** can cast spells of divine nature starting at 2nd level.`
      ),
      marked(`**Clerics** have the power to Turn the Undead.`),
    ],
    restrictions: [
      marked(
        `**Clerics** may wear any armor, but may only use blunt weapons (specifically including warhammer, mace, maul, club, quarterstaff, and sling).`
      ),
    ],
  },
  [ClassNames.FIGHTER]: {
    description: marked(
      `Fighters include soldiers, guardsmen, barbarian warriors, and anyone else for whom fighting is a way of life. They train in combat, and they generally approach problems head-on, weapon in hand.`
    ),
    specials: [
      marked(
        `Although they are not skilled in the ways of magic, **Fighters** can nonetheless use many magic items, including but not limited to magical weapons and armor.`
      ),
    ],
    restrictions: [],
  },
  [ClassNames.MAGICUSER]: {
    description: marked(
      `Magic-Users are those who seek and use knowledge of the arcane. They do magic not as the Cleric does, by faith in a greater power, but rather through insight and understanding.`
    ),
    specials: [
      marked(
        `**Magic-Users** begins play knowing Read Magic and one other spell of first level.`
      ),
    ],
    restrictions: [
      marked(
        `The only weapons **Magic-Users** become proficient with are the dagger and the walking staff (or cudgel).`
      ),
      marked(
        `**Magic-Users** may not wear armor of any sort nor use a shield as such things interfere with spellcasting.`
      ),
    ],
  },
  [ClassNames.THIEF]: {
    description: marked(
      `Thieves are those who take what they want or need by stealth, disarming traps and picking locks to get to the gold they crave; or "borrowing" money from pockets, beltpouches, etc. right under the nose of the "mark" without the victim ever knowing.`
    ),
    specials: [
      marked(`**Thieves** have a number of special abilities (see table).`),
    ],
    restrictions: [
      marked(
        `**Thieves** may use any weapon, but may not wear metal armor as it interferes with stealthy activities, nor may they use shields of any sort.`
      ),
    ],
  },
};
