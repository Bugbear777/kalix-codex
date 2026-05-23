const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "KalixCodex";

async function seedAsurai() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    const ancestries = db.collection("ancestries");
    const ancestryTraits = db.collection("ancestryTraits");
    const ancestryGifts = db.collection("ancestryGifts");

    await ancestries.updateOne(
      { slug: "asurai" },
      {
        $set: {
          name: "Asurai",
          slug: "asurai",
          category: "Ancestry",
          summary:
            "The Asurai are powerful, passionate people known for fierce emotion, great strength, ancestral memory, and a drive to master whatever calling seizes their spirit.",
          description: [
            "The Asurai are a strong-bodied people whose passions burn brightly. When an Asurai gives themself to a craft, cause, art, faith, rivalry, or oath, they often pursue it with a force that others find overwhelming.",
            "Many outsiders mistake Asurai intensity for savagery, but this is a shallow reading of a deeply expressive people. Asurai communities are often rich with song, carving, storytelling, wrestling, painted histories, and fierce bonds of family and honor.",
            "Physically, Asurai are usually tall and powerfully built, with prominent tusks, pointed ears, dark hair, and skin tones that vary across clans and regions. Their appearance often reflects the lands and traditions of their ancestors."
          ],
          size: "Medium",
          speed: 30,
          tags: ["ancestry", "playable", "humanoid", "asurai", "strong"],
          imageUrl: "",
          suggestedCultures: [
            "caravanner",
            "stoic-asurai",
            "warhordling",
            "wildling"
          ],
          source: {
            name: "Level Up A5E Orc mechanics, renamed Asurai for Kalix",
            url: "https://a5e.tools/rules/orc"
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    await ancestryTraits.deleteMany({ ancestrySlug: "asurai" });

    await ancestryTraits.insertMany([
      {
        name: "Asurai Age",
        slug: "asurai-age",
        ancestrySlug: "asurai",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "Asurai mature faster than humans, often reaching adulthood around age 14. They age more quickly and commonly live between 60 and 75 years.",
        effects: [],
        displayOrder: 1
      },
      {
        name: "Asurai Size",
        slug: "asurai-size",
        ancestrySlug: "asurai",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "Asurai are rarely under 6 feet tall and are powerfully built. Your size is Medium.",
        effects: [
          {
            target: "size",
            operation: "set",
            value: "Medium"
          }
        ],
        displayOrder: 2
      },
      {
        name: "Asurai Speed",
        slug: "asurai-speed",
        ancestrySlug: "asurai",
        type: "ancestryTrait",
        choiceType: "automatic",
        description: "Your base walking speed is 30 feet.",
        effects: [
          {
            target: "speed",
            operation: "set",
            value: 30
          }
        ],
        displayOrder: 3
      },
      {
        name: "Darkvision",
        slug: "asurai-darkvision",
        ancestrySlug: "asurai",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light. You cannot discern color in darkness, only shades of gray.",
        effects: [
          {
            target: "darkvision",
            operation: "set",
            value: 60
          }
        ],
        displayOrder: 4
      },
      {
        name: "Heavy Lifter",
        slug: "asurai-heavy-lifter",
        ancestrySlug: "asurai",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "When determining your carrying capacity and the weight you can push, drag, or lift, your size is considered Large.",
        effects: [
          {
            target: "carryingCapacitySize",
            operation: "set",
            value: "Large"
          }
        ],
        displayOrder: 5
      },
      {
        name: "Mighty Attacks",
        slug: "asurai-mighty-attacks",
        ancestrySlug: "asurai",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "When you score a critical hit with a melee weapon attack, you can roll one of the weapon’s damage dice an additional time and add it to the extra damage of the critical hit.",
        effects: [
          {
            target: "criticalHit",
            operation: "add",
            value:
              "Roll one additional weapon damage die on melee weapon critical hits."
          }
        ],
        displayOrder: 6
      }
    ]);

    await ancestryGifts.deleteMany({ ancestrySlug: "asurai" });

    await ancestryGifts.insertMany([
      {
        name: "Acclimatized",
        slug: "asurai-acclimatized",
        ancestrySlug: "asurai",
        type: "ancestryGift",
        choiceType: "selectable",
        summary:
          "Your family adapted to extreme terrain, granting you resilience and survival instincts tied to that ancestral homeland.",
        description: [
          "Some Asurai lineages come from harsh lands such as arctic wastes, burning deserts, jagged mountains, or dangerous swamps. Even if you were not raised there, your body carries the memory of that place."
        ],
        features: [
          {
            name: "Just Like Home",
            description:
              "Choose one terrain type: arctic, desert, mountain, or swamp. You ignore naturally created difficult terrain of that type, gain an expertise die on Survival checks made in that terrain, and gain a related damage resistance: arctic gives cold resistance, desert gives fire resistance, mountain gives lightning resistance, and swamp gives poison resistance."
          }
        ],
        choices: [
          {
            choiceId: "asurai-acclimatized-terrain",
            choose: 1,
            from: [
              {
                terrain: "arctic",
                resistance: "cold"
              },
              {
                terrain: "desert",
                resistance: "fire"
              },
              {
                terrain: "mountain",
                resistance: "lightning"
              },
              {
                terrain: "swamp",
                resistance: "poison"
              }
            ]
          }
        ],
        effects: [
          {
            target: "terrain",
            operation: "choice",
            value:
              "Ignore naturally created difficult terrain of chosen type and gain expertise die on Survival checks there."
          },
          {
            target: "damageResistance",
            operation: "choice",
            value:
              "Gain resistance based on chosen terrain: cold, fire, lightning, or poison."
          }
        ],
        prerequisites: {
          ancestrySlug: "asurai"
        },
        displayOrder: 1
      },
      {
        name: "Ancestral Blessing",
        slug: "asurai-ancestral-blessing",
        ancestrySlug: "asurai",
        type: "ancestryGift",
        choiceType: "selectable",
        summary:
          "Your ancestors have marked you with divine protection and a small measure of protective magic.",
        description: [
          "Asurai with this gift are believed to have been blessed by their ancestors. Some families see this as a reward for noble deeds, clan triumphs, artistic greatness, or mercy shown to a child born in desperate circumstances."
        ],
        features: [
          {
            name: "Divine Protection",
            description: "You have resistance to radiant damage."
          },
          {
            name: "Touch of Divinity",
            description:
              "You know the resistance cantrip. In addition, you can cast shield once per long rest."
          }
        ],
        effects: [
          {
            target: "damageResistance",
            operation: "add",
            value: "radiant"
          },
          {
            target: "spell",
            operation: "add",
            value: {
              name: "resistance",
              level: 0,
              list: "cantrip"
            }
          },
          {
            target: "spell",
            operation: "add",
            value: {
              name: "shield",
              level: 1,
              uses: 1,
              reset: "longRest"
            }
          }
        ],
        prerequisites: {
          ancestrySlug: "asurai"
        },
        displayOrder: 2
      },
      {
        name: "Magic Adept",
        slug: "asurai-magic-adept",
        ancestrySlug: "asurai",
        type: "ancestryGift",
        choiceType: "selectable",
        summary:
          "You are born with magic in your blood, learning a wizard cantrip and later a limited wizard spell.",
        description: [
          "Some Asurai lineages carry old magic. Elders tell stories of fey-touched ancestors, spirit bargains, or forgotten bloodlines that left their descendants with an instinctive talent for spellcraft."
        ],
        features: [
          {
            name: "Innate Arcana",
            description:
              "You learn one cantrip of your choice from the wizard spell list."
          },
          {
            name: "Adept Spell",
            description:
              "At 3rd level, choose one 1st- or 2nd-level spell from the wizard spell list. You can cast it once per long rest without material components. If you choose a 1st-level spell, you may cast it as though using a 2nd-level spell slot if the spell allows."
          },
          {
            name: "Spellcasting Ability",
            description:
              "Your spellcasting ability for this gift is the ability used by the spellcasting class in which you have the highest level, or Charisma if you have no levels in a spellcasting class."
          }
        ],
        choices: [
          {
            choiceId: "asurai-wizard-cantrip",
            choose: 1,
            from: "wizardCantrips"
          },
          {
            choiceId: "asurai-wizard-spell",
            choose: 1,
            from: "wizardSpellsLevel1Or2",
            levelRequirement: 3
          }
        ],
        effects: [
          {
            target: "spellcasting",
            operation: "add",
            value:
              "One wizard cantrip and one 1st- or 2nd-level wizard spell at 3rd level."
          }
        ],
        prerequisites: {
          ancestrySlug: "asurai"
        },
        displayOrder: 3
      },
      {
        name: "Relentless Resilience",
        slug: "asurai-relentless-resilience",
        ancestrySlug: "asurai",
        type: "ancestryParagonGift",
        choiceType: "paragon",
        levelRequirement: 10,
        summary:
          "Your ancestral endurance lets you survive a deadly blow and harden yourself against weaker attacks.",
        description: [
          "At 10th level, your Asurai endurance reaches legendary strength."
        ],
        features: [
          {
            name: "Relentless Endurance",
            description:
              "When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. Once you use this trait, you cannot use it again until you finish a long rest."
          },
          {
            name: "Thick Skin",
            description: "Your Armor Class increases by 1."
          }
        ],
        effects: [
          {
            target: "dropToOneHp",
            operation: "add",
            uses: 1,
            reset: "longRest",
            value:
              "When reduced to 0 hit points but not killed outright, drop to 1 hit point instead."
          },
          {
            target: "armorClass",
            operation: "increase",
            value: 1
          }
        ],
        prerequisites: {
          ancestrySlug: "asurai",
          level: 10
        },
        displayOrder: 10
      }
    ]);

    console.log("Asurai ancestry seeded successfully.");
  } catch (error) {
    console.error("Error seeding Asurai ancestry:", error);
  } finally {
    await client.close();
  }
}

seedAsurai();