const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "KalixCodex";

async function seedDwarf() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    const ancestries = db.collection("ancestries");
    const ancestryTraits = db.collection("ancestryTraits");
    const ancestryGifts = db.collection("ancestryGifts");

    await ancestries.updateOne(
      { slug: "dwarf" },
      {
        $set: {
          name: "Dwarf",
          slug: "dwarf",
          category: "Ancestry",
          summary:
            "Dwarves are stout, enduring creators shaped by earth, iron, craft, and ancestral tradition.",
          description: [
            "Many dwarf legends say dwarves were not born, but forged from earth and iron by the Forge God. Whether literally true or not, dwarves are widely known for an instinctive gift for creation, shaping raw materials into enduring works of beauty and strength.",
            "Dwarves can carve out a home almost anywhere. Caves become halls, mountains become castles, and hard places become thriving communities beneath the rhythm of hammer, chisel, song, and fire.",
            "Though broad and muscular, dwarves are not tall. Their compact frames make them hardy and strong, and their long beards, gemstone-like eyes, and deep ties to clan and craft are central to many dwarven traditions."
          ],
          size: "Medium",
          speed: 25,
          tags: ["ancestry", "playable", "humanoid", "dwarf", "crafting", "stout"],
          imageUrl: "",
          suggestedCultures: [
            "deep-dwarf",
            "forsaken",
            "godbound",
            "hill-dwarf",
            "mountain-dwarf"
          ],
          source: {
            name: "Level Up A5E Dwarf",
            url: "https://a5e.tools/rules/dwarf"
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    await ancestryTraits.deleteMany({ ancestrySlug: "dwarf" });

    await ancestryTraits.insertMany([
      {
        name: "Dwarf Age",
        slug: "dwarf-age",
        ancestrySlug: "dwarf",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "Dwarves age at roughly the same rate as humans, though many cultures do not consider them adults until age 50. They can live for centuries, with some reaching over 400 years.",
        effects: [],
        displayOrder: 1
      },
      {
        name: "Dwarf Size",
        slug: "dwarf-size",
        ancestrySlug: "dwarf",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "Dwarves are short and stout, commonly standing around 4 to 5 feet tall. Your size is Medium.",
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
        name: "Dwarf Speed",
        slug: "dwarf-speed",
        ancestrySlug: "dwarf",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "Your base Speed is 25 feet. Your Speed is not reduced by wearing heavy armor or wielding tower shields.",
        effects: [
          {
            target: "speed",
            operation: "set",
            value: 25
          },
          {
            target: "speedReduction",
            operation: "ignore",
            value: "Heavy armor and tower shields."
          }
        ],
        displayOrder: 3
      },
      {
        name: "Darkvision",
        slug: "dwarf-darkvision",
        ancestrySlug: "dwarf",
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
        name: "Creator's Blessing",
        slug: "dwarf-creators-blessing",
        ancestrySlug: "dwarf",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "You gain proficiency with one set of artisan's tools: brewer's supplies, mason's tools, or smith's tools. During a long rest, you can use those tools for crafting instead of sleeping and still gain the full benefits of the long rest.",
        choices: [
          {
            choiceId: "dwarf-artisans-tool",
            choose: 1,
            from: ["brewer's supplies", "mason's tools", "smith's tools"]
          }
        ],
        effects: [
          {
            target: "toolProficiency",
            operation: "choice",
            value: "Choose brewer's supplies, mason's tools, or smith's tools."
          },
          {
            target: "longRestCrafting",
            operation: "add",
            value:
              "Can craft with chosen artisan's tools during a long rest instead of sleeping."
          }
        ],
        displayOrder: 5
      },
      {
        name: "Tough",
        slug: "dwarf-tough",
        ancestrySlug: "dwarf",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "Your hit point maximum increases by 1, and it increases by 1 again whenever you gain a level.",
        effects: [
          {
            target: "hitPointMaximum",
            operation: "increasePerLevel",
            value: 1
          }
        ],
        displayOrder: 6
      }
    ]);

    await ancestryGifts.deleteMany({ ancestrySlug: "dwarf" });

    await ancestryGifts.insertMany([
      {
        name: "Dwarven Stability",
        slug: "dwarven-stability",
        ancestrySlug: "dwarf",
        type: "ancestryGift",
        choiceType: "selectable",
        summary:
          "You are difficult to knock down or force out of position.",
        description: [
          "Your compact frame and stubborn footing make you remarkably hard to topple, shove, or displace."
        ],
        features: [
          {
            name: "Stable Stance",
            description:
              "You gain an expertise die on saving throws against effects that would knock you prone, and on saving throws made to resist being shoved."
          }
        ],
        effects: [
          {
            target: "savingThrow",
            operation: "addExpertiseDie",
            value: "Against effects that would knock you prone."
          },
          {
            target: "savingThrow",
            operation: "addExpertiseDie",
            value: "Against being shoved."
          }
        ],
        prerequisites: {
          ancestrySlug: "dwarf"
        },
        displayOrder: 1
      },
      {
        name: "Dwarven Toughness",
        slug: "dwarven-toughness",
        ancestrySlug: "dwarf",
        type: "ancestryGift",
        choiceType: "selectable",
        summary:
          "You can call on deep reserves of endurance and resist poison.",
        description: [
          "Your body is especially hardy, even by dwarven standards, allowing you to withstand poison and draw on a sudden surge of stamina."
        ],
        features: [
          {
            name: "Temporary Endurance",
            description:
              "As a bonus action, you gain temporary hit points equal to 1d10 plus your level. These temporary hit points last for 1 minute. Once you use this trait, you cannot use it again until you finish a long rest."
          },
          {
            name: "Poison Resilience",
            description:
              "You gain an expertise die on saving throws against poison, and you have resistance to poison damage."
          }
        ],
        effects: [
          {
            target: "temporaryHitPoints",
            operation: "add",
            value: "1d10 + level",
            duration: "1 minute",
            actionType: "bonusAction",
            uses: 1,
            reset: "longRest"
          },
          {
            target: "savingThrow",
            operation: "addExpertiseDie",
            value: "Against poison."
          },
          {
            target: "damageResistance",
            operation: "add",
            value: "poison"
          }
        ],
        prerequisites: {
          ancestrySlug: "dwarf"
        },
        displayOrder: 2
      },
      {
        name: "Fury of the Earth",
        slug: "fury-of-the-earth",
        ancestrySlug: "dwarf",
        type: "ancestryParagonGift",
        choiceType: "paragon",
        levelRequirement: 10,
        summary:
          "You strike the ground and unleash earth-shaking force around you.",
        description: [
          "At 10th level, you can call upon the fury of the earth, turning the ground around you into broken terrain and knocking enemies from their feet."
        ],
        features: [
          {
            name: "Earthshaking Strike",
            description:
              "As an action, you strike the ground with a melee weapon you are proficient with. The ground in a 30-foot burst centered on you becomes difficult terrain. Each creature on the ground in the area must make a Dexterity saving throw or be knocked prone. A creature concentrating on a spell must make a Constitution saving throw or lose concentration. Once you use this feature, you cannot use it again until you finish a long rest."
          }
        ],
        effects: [
          {
            target: "areaEffect",
            operation: "add",
            value: {
              area: "30-foot burst centered on self",
              terrain: "difficult terrain",
              save: "Dexterity",
              dc: "8 + proficiency bonus + Strength modifier",
              failure: "knocked prone"
            }
          },
          {
            target: "concentration",
            operation: "forceSave",
            value: "Constitution saving throw or concentration is broken."
          }
        ],
        uses: {
          amount: 1,
          reset: "longRest"
        },
        prerequisites: {
          ancestrySlug: "dwarf",
          level: 10
        },
        displayOrder: 10
      },
      {
        name: "Unbreakable",
        slug: "unbreakable",
        ancestrySlug: "dwarf",
        type: "ancestryParagonGift",
        choiceType: "paragon",
        levelRequirement: 10,
        summary:
          "Your will to live is so strong that even a death save can become a return to your feet.",
        description: [
          "At 10th level, your endurance becomes legendary. When death reaches for you, you can spend your own vitality to stand again."
        ],
        features: [
          {
            name: "Unbreakable",
            description:
              "When you succeed on a death saving throw, you can expend one Hit Die to regain 1 hit point as if your check result were a natural 20. Once you use this feature, you cannot use it again until you finish a short or long rest."
          }
        ],
        effects: [
          {
            target: "deathSavingThrow",
            operation: "modify",
            value:
              "On a success, expend one Hit Die to regain 1 hit point as if the result were a natural 20."
          }
        ],
        uses: {
          amount: 1,
          reset: "shortRest"
        },
        prerequisites: {
          ancestrySlug: "dwarf",
          level: 10
        },
        displayOrder: 11
      }
    ]);

    console.log("Dwarf ancestry seeded successfully.");
  } catch (error) {
    console.error("Error seeding Dwarf ancestry:", error);
  } finally {
    await client.close();
  }
}

seedDwarf();