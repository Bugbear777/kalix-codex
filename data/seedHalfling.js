const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "KalixCodex";

async function seedHalfling() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    const ancestries = db.collection("ancestries");
    const ancestryTraits = db.collection("ancestryTraits");
    const ancestryGifts = db.collection("ancestryGifts");

    await ancestries.updateOne(
      { slug: "halfling" },
      {
        $set: {
          name: "Halfling",
          slug: "halfling",
          category: "Ancestry",
          summary:
            "Halflings are small, resilient folk known for courage, good fortune, loyalty, and a talent for surviving dangers far larger than themselves.",
          description: [
            "Halflings are diminutive people who resemble humans at a much smaller scale. Though they are often overlooked by larger folk, they have endured by relying on courage, community, caution, and a surprising amount of luck.",
            "Many halflings prefer peaceful homes, close neighborhoods, and reliable companions. Even so, stories are full of halflings who stood against bullies, monsters, tyrants, and impossible odds when others needed them most.",
            "A halfling’s small stature often makes the world feel enormous, but that same quality helps them pass unnoticed, move where others cannot, and escape danger at the last possible moment."
          ],
          size: "Small",
          speed: 25,
          tags: ["ancestry", "playable", "humanoid", "small"],
          imageUrl: "",
          suggestedCultures: [
            "kithbain-halfling",
            "mustbairn-halfling",
            "stout-halfling",
            "tunnel-halfling"
          ],
          source: {
            name: "Level Up A5E Halfling",
            url: "https://a5e.tools/rules/halfling"
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    await ancestryTraits.deleteMany({ ancestrySlug: "halfling" });

    await ancestryTraits.insertMany([
      {
        name: "Halfling Age",
        slug: "halfling-age",
        ancestrySlug: "halfling",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "Halflings usually reach adulthood around age 20 and can live well over a century.",
        effects: [],
        displayOrder: 1
      },
      {
        name: "Halfling Size",
        slug: "halfling-size",
        ancestrySlug: "halfling",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "Halflings stand around 3 feet tall. Your size is Small.",
        effects: [
          {
            target: "size",
            operation: "set",
            value: "Small"
          }
        ],
        displayOrder: 2
      },
      {
        name: "Halfling Speed",
        slug: "halfling-speed",
        ancestrySlug: "halfling",
        type: "ancestryTrait",
        choiceType: "automatic",
        description: "Your base walking speed is 25 feet.",
        effects: [
          {
            target: "speed",
            operation: "set",
            value: 25
          }
        ],
        displayOrder: 3
      },
      {
        name: "Fearless",
        slug: "halfling-fearless",
        ancestrySlug: "halfling",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "You are immune to the frightened condition. You may still recognize danger, but fear does not control your actions.",
        effects: [
          {
            target: "conditionImmunity",
            operation: "add",
            value: "frightened"
          }
        ],
        displayOrder: 4
      },
      {
        name: "Halfling Nimbleness",
        slug: "halfling-nimbleness",
        ancestrySlug: "halfling",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "You can move through the space of creatures larger than you.",
        effects: [
          {
            target: "movement",
            operation: "add",
            value: "Can move through the space of larger creatures."
          }
        ],
        displayOrder: 5
      },
      {
        name: "Lucky",
        slug: "halfling-lucky",
        ancestrySlug: "halfling",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "When you roll a natural 1 on a d20 for an attack roll, ability check, or saving throw, you can reroll it and must use the new result.",
        effects: [
          {
            target: "d20Reroll",
            operation: "add",
            trigger: "natural-1",
            value: "Reroll and use the new result."
          }
        ],
        displayOrder: 6
      }
    ]);

    await ancestryGifts.deleteMany({ ancestrySlug: "halfling" });

    await ancestryGifts.insertMany([
      {
        name: "Burrowing Claws",
        slug: "burrowing-claws",
        ancestrySlug: "halfling",
        type: "ancestryGift",
        choiceType: "selectable",
        summary:
          "You possess claw-like nails and a natural talent for digging through soft earth, mud, sand, or snow.",
        description: [
          "Some halflings bear older, earthier traits: sturdy nails, wide dark eyes, and a tougher, more rugged appearance than their kin."
        ],
        features: [
          {
            name: "Burrow",
            description:
              "You gain a burrowing speed of 10 feet through loose natural materials such as sand, mud, soft earth, or snow. You cannot burrow through solid rock."
          },
          {
            name: "Claws",
            description:
              "Your claws are natural weapons. Your unarmed strikes with them deal 1d4 slashing damage plus your Strength modifier."
          }
        ],
        effects: [
          {
            target: "burrowSpeed",
            operation: "set",
            value: 10
          },
          {
            target: "naturalWeapon",
            operation: "add",
            value: {
              name: "Claws",
              damage: "1d4",
              damageType: "slashing",
              ability: "Strength"
            }
          }
        ],
        prerequisites: {
          ancestrySlug: "halfling"
        },
        displayOrder: 1
      },
      {
        name: "Tuft Feet",
        slug: "tuft-feet",
        ancestrySlug: "halfling",
        type: "ancestryGift",
        choiceType: "selectable",
        summary:
          "Your tough, hairy feet help you keep your footing and ignore many painful ground hazards.",
        description: [
          "You have broad, calloused feet with thick patches of hair. Shoes are optional at best, and rough ground bothers you far less than it bothers others."
        ],
        features: [
          {
            name: "Big Feet",
            description:
              "You gain an expertise die on checks and saving throws made to resist being knocked prone."
          },
          {
            name: "Thick Soles",
            description:
              "You ignore damage from sharp terrain hazards such as caltrops or broken glass, and such hazards do not count as difficult terrain for you. Other difficult terrain slows you by 5 feet instead of halving your speed."
          }
        ],
        effects: [
          {
            target: "proneResistance",
            operation: "add",
            value: "expertiseDie"
          },
          {
            target: "terrain",
            operation: "add",
            value: "Resistant to sharp terrain hazards."
          }
        ],
        prerequisites: {
          ancestrySlug: "halfling"
        },
        displayOrder: 2
      },
      {
        name: "Twilight-Touched",
        slug: "twilight-touched",
        ancestrySlug: "halfling",
        type: "ancestryGift",
        choiceType: "selectable",
        summary:
          "You are marked by strange twilight traits, gaining darkvision and limited telepathy.",
        description: [
          "Some halflings carry an eerie stillness, pale features, or strange eyes. Their connection to others can become almost wordless, allowing them to communicate mind-to-mind."
        ],
        features: [
          {
            name: "Darkvision",
            description:
              "You can see in dim light within 30 feet as if it were bright light, and in darkness as if it were dim light. You see only shades of gray in darkness."
          },
          {
            name: "Telepathy",
            description:
              "You can communicate telepathically with one creature you can see within 30 feet, provided you share a language."
          }
        ],
        effects: [
          {
            target: "darkvision",
            operation: "set",
            value: 30
          },
          {
            target: "telepathy",
            operation: "set",
            value: 30
          }
        ],
        prerequisites: {
          ancestrySlug: "halfling"
        },
        displayOrder: 3
      },
      {
        name: "Increased Luck",
        slug: "increased-luck",
        ancestrySlug: "halfling",
        type: "ancestryParagonGift",
        choiceType: "paragon",
        levelRequirement: 10,
        summary:
          "Your luck improves, allowing your Lucky trait to trigger more often.",
        description: [
          "At 10th level, your halfling luck becomes even more reliable."
        ],
        features: [
          {
            name: "Improved Lucky",
            description:
              "When using your Lucky trait, you may also reroll natural results of 2 or 3."
          }
        ],
        effects: [
          {
            target: "d20Reroll",
            operation: "modify",
            trigger: "natural-1-2-3",
            value: "Lucky also applies to natural 2s and 3s."
          }
        ],
        prerequisites: {
          ancestrySlug: "halfling",
          level: 10
        },
        displayOrder: 10
      }
    ]);

    console.log("Halfling ancestry seeded successfully.");
  } catch (error) {
    console.error("Error seeding Halfling ancestry:", error);
  } finally {
    await client.close();
  }
}

seedHalfling();