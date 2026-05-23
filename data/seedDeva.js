const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "KalixCodex";

async function seedDeva() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    const ancestries = db.collection("ancestries");
    const ancestryTraits = db.collection("ancestryTraits");
    const ancestryGifts = db.collection("ancestryGifts");

    await ancestries.updateOne(
      { slug: "deva" },
      {
        $set: {
          name: "Deva",
          slug: "deva",
          category: "Ancestry",
          summary:
            "Devas are reincarnating souls touched by immortality, returning again and again in adult bodies with fragments of memory from past lives.",
          description: [
            "Devas are people, often originally human, who carry a sliver of immortality. When they die, they reincarnate into a fully grown adult body within a few days, usually appearing somewhere within a few miles of where they died.",
            "A reincarnated deva retains vague memories of previous lives. These memories may draw them back to old companions and places, or they may instead push the deva toward an entirely new path.",
            "Physically, devas resemble their original people, but with an uncanny stillness and otherworldly beauty. Some have skin marked by geometric patterns of light and shadow, and especially powerful devas may manifest decorative, insubstantial wings."
          ],
          size: "Medium",
          speed: 30,
          tags: ["ancestry", "playable", "humanoid", "celestial-touched", "reincarnation"],
          imageUrl: "",
          suggestedCultures: ["forsaken", "godbound"],
          source: {
            name: "Level Up A5E Deva",
            url: "https://a5e.tools/rules/deva"
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    await ancestryTraits.deleteMany({ ancestrySlug: "deva" });

    await ancestryTraits.insertMany([
      {
        name: "Deva Type",
        slug: "deva-type",
        ancestrySlug: "deva",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "You are Humanoid. However, you can be detected by magic that detects celestials.",
        effects: [
          {
            target: "creatureType",
            operation: "set",
            value: "Humanoid"
          },
          {
            target: "detection",
            operation: "add",
            value: "Detected by magic that detects celestials."
          }
        ],
        displayOrder: 1
      },
      {
        name: "Deva Age",
        slug: "deva-age",
        ancestrySlug: "deva",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "Devas reincarnate into adult bodies and may die of old age roughly seventy years after an incarnation begins.",
        effects: [],
        displayOrder: 2
      },
      {
        name: "Deva Size",
        slug: "deva-size",
        ancestrySlug: "deva",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "Most devas are Medium, though Small devas who were once gnomes or halflings are not unknown.",
        choices: [
          {
            choiceId: "deva-size-choice",
            choose: 1,
            from: ["Medium", "Small"]
          }
        ],
        effects: [
          {
            target: "size",
            operation: "setDefault",
            value: "Medium"
          }
        ],
        displayOrder: 3
      },
      {
        name: "Deva Speed",
        slug: "deva-speed",
        ancestrySlug: "deva",
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
        displayOrder: 4
      },
      {
        name: "Deathless Calm",
        slug: "deathless-calm",
        ancestrySlug: "deva",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "You gain resistance to necrotic and radiant damage, and you cannot be blinded by bright light.",
        effects: [
          {
            target: "damageResistance",
            operation: "add",
            value: "necrotic"
          },
          {
            target: "damageResistance",
            operation: "add",
            value: "radiant"
          },
          {
            target: "conditionProtection",
            operation: "add",
            value: "Cannot be blinded by bright light."
          }
        ],
        displayOrder: 5
      },
      {
        name: "Memory of Past Lifetimes",
        slug: "memory-of-past-lifetimes",
        ancestrySlug: "deva",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "You can choose to gain an expertise die on an ability check or saving throw. If the check uses a skill, tool, or vehicle you are not proficient with, you gain proficiency with it for the next minute. After using this trait, you cannot use it again until you complete a short or long rest.",
        effects: [
          {
            target: "expertiseDie",
            operation: "add",
            trigger: "ability-check-or-saving-throw",
            value: "Once per short or long rest."
          },
          {
            target: "temporaryProficiency",
            operation: "add",
            duration: "1 minute",
            value: "Skill, tool, or vehicle used for the check if not already proficient."
          }
        ],
        uses: {
          amount: 1,
          reset: "shortRest"
        },
        displayOrder: 6
      }
    ]);

    await ancestryGifts.deleteMany({ ancestrySlug: "deva" });

    await ancestryGifts.insertMany([
      {
        name: "Pluripotent Form",
        slug: "pluripotent-form",
        ancestrySlug: "deva",
        type: "ancestryGift",
        choiceType: "selectable",
        summary:
          "You manifest spiritual arms that can hold objects, confound restraints, and empower your unarmed strikes.",
        description: [
          "You have one or more extra sets of spiritual arms. They are clearly magical, float near you instead of attaching to your torso, and can be dismissed or manifested with a thought."
        ],
        features: [
          {
            name: "Spiritual Arms",
            description:
              "Your spiritual arms can hold many extra hands' worth of items. They do not grant extra actions and only two limbs can wield weapons, shields, or similar equipment."
          },
          {
            name: "Greater Grasp",
            description:
              "You count as one size larger for the purpose of grabbing and shoving."
          },
          {
            name: "Radiant Strikes",
            description:
              "Your unarmed strikes count as magical. Once per round when you hit with an unarmed strike, you can deal an extra 1 radiant damage."
          }
        ],
        effects: [
          {
            target: "extraLimbs",
            operation: "add",
            value: "Spiritual arms that can hold objects but grant no extra actions."
          },
          {
            target: "grappleSize",
            operation: "increase",
            value: 1
          },
          {
            target: "unarmedStrike",
            operation: "add",
            value: "Counts as magical and can deal +1 radiant damage once per round."
          }
        ],
        prerequisites: {
          ancestrySlug: "deva"
        },
        displayOrder: 1
      },
      {
        name: "Presence of the Divine",
        slug: "presence-of-the-divine",
        ancestrySlug: "deva",
        type: "ancestryGift",
        choiceType: "selectable",
        summary:
          "You carry divine magic, learning a cleric cantrip and later gaining limited cleric spellcasting.",
        description: [
          "A trace of divinity manifests through you as sacred magic, allowing you to channel a small portion of clerical power."
        ],
        features: [
          {
            name: "Divine Cantrip",
            description:
              "You know one cantrip of your choice from the cleric spell list."
          },
          {
            name: "Divine Spell",
            description:
              "At 3rd level, choose one 1st- or 2nd-level cleric spell. You can cast it once per long rest without material components. A 1st-level spell chosen this way may be cast as if using a 2nd-level spell slot if the spell allows. Wisdom is your spellcasting ability for these spells."
          }
        ],
        choices: [
          {
            choiceId: "deva-cleric-cantrip",
            choose: 1,
            from: "clericCantrips"
          },
          {
            choiceId: "deva-cleric-spell",
            choose: 1,
            from: "clericSpellsLevel1Or2",
            levelRequirement: 3
          }
        ],
        effects: [
          {
            target: "spellcasting",
            operation: "add",
            ability: "Wisdom",
            value: "One cleric cantrip and one 1st- or 2nd-level cleric spell at 3rd level."
          }
        ],
        prerequisites: {
          ancestrySlug: "deva"
        },
        displayOrder: 2
      },
      {
        name: "Combined Soul",
        slug: "combined-soul",
        ancestrySlug: "deva",
        type: "ancestryParagonGift",
        choiceType: "paragon",
        levelRequirement: 10,
        summary:
          "Your memories broaden to include many past devas, granting greater skill and temporary training.",
        description: [
          "Your memories now include those of many devas who lived before you."
        ],
        features: [
          {
            name: "Ancestral Memory",
            description:
              "You gain an expertise die on ability checks."
          },
          {
            name: "Borrowed Training",
            description:
              "When you finish a long rest, you gain proficiency with one skill or tool kit of your choice until you finish your next long rest."
          }
        ],
        choices: [
          {
            choiceId: "combined-soul-proficiency",
            choose: 1,
            from: ["skills", "toolKits"],
            reset: "longRest"
          }
        ],
        effects: [
          {
            target: "abilityChecks",
            operation: "add",
            value: "expertiseDie"
          },
          {
            target: "temporaryProficiency",
            operation: "add",
            reset: "longRest",
            value: "One skill or tool kit."
          }
        ],
        prerequisites: {
          ancestrySlug: "deva",
          level: 10
        },
        displayOrder: 10
      },
      {
        name: "Manifest Incarnation",
        slug: "manifest-incarnation",
        ancestrySlug: "deva",
        type: "ancestryParagonGift",
        choiceType: "paragon",
        levelRequirement: 10,
        summary:
          "You can call forth a shimmering manifestation of a past life that moves independently but shares your actions and vitality.",
        description: [
          "You learn to call forth one of your past lives as a corporeal manifestation. This incarnation shares your senses, hit points, and action economy, and can be destroyed, absorbed, or recalled after resting."
        ],
        features: [
          {
            name: "Past-Life Manifestation",
            description:
              "As a bonus action, you call forth a shimmering 3rd-level deva incarnation created with your same base ability scores. It moves independently, but you share a single pool of one action, one bonus action, and one reaction per round."
          },
          {
            name: "Shared Vitality",
            description:
              "You and the incarnation share hit points. If you fall unconscious, or if you and the incarnation are separated by more than 250 feet, the incarnation is destroyed."
          },
          {
            name: "Absorb Incarnation",
            description:
              "If the incarnation is adjacent to you, you can spend a bonus action to absorb it. If absorbed, you can manifest it again after a short rest. If destroyed without being absorbed, you cannot manifest it again until you complete a long rest."
          },
          {
            name: "Spiritual Equipment",
            description:
              "When manifested, the incarnation has spiritual mundane equipment worth no more than 200 gold. Equipment that leaves its possession vanishes after one round."
          },
          {
            name: "Strife",
            description:
              "For every minute the incarnation is active, you suffer a level of strife, which goes away when the incarnation is destroyed or absorbed."
          }
        ],
        effects: [
          {
            target: "summon",
            operation: "add",
            value: "3rd-level deva past-life incarnation."
          },
          {
            target: "rangeLimit",
            operation: "set",
            value: 250
          },
          {
            target: "strife",
            operation: "add",
            value: "1 level per minute while active."
          }
        ],
        prerequisites: {
          ancestrySlug: "deva",
          level: 10
        },
        displayOrder: 11
      }
    ]);

    console.log("Deva ancestry seeded successfully.");
  } catch (error) {
    console.error("Error seeding Deva ancestry:", error);
  } finally {
    await client.close();
  }
}

seedDeva();