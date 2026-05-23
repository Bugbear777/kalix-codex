const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "KalixCodex";

async function seedHuman() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    const ancestries = db.collection("ancestries");
    const ancestryTraits = db.collection("ancestryTraits");
    const ancestryGifts = db.collection("ancestryGifts");

    await ancestries.updateOne(
      { slug: "human" },
      {
        $set: {
          name: "Human",
          slug: "human",
          category: "Ancestry",
          summary:
            "Humans are adaptable, ambitious, and widespread, known for their endurance, curiosity, and ability to thrive in nearly any environment.",
          description: [
            "Humans are among the most widespread peoples of the world. Though shorter-lived than many other ancestries, they are often driven by ambition, invention, and a desire to leave a mark on the world.",
            "Human communities vary widely in language, custom, appearance, and belief. Their greatest strength is often their adaptability, allowing them to flourish in deserts, forests, mountains, cities, and frontiers alike."
          ],
          size: "Medium",
          speed: 30,
          tags: ["ancestry", "playable", "humanoid"],
          imageUrl: "",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    await ancestryTraits.deleteMany({ ancestrySlug: "human" });

    await ancestryTraits.insertMany([
      {
        name: "Human Age",
        slug: "human-age",
        ancestrySlug: "human",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "Humans reach adulthood in their late teens and usually live less than a century.",
        effects: [],
        displayOrder: 1
      },
      {
        name: "Human Size",
        slug: "human-size",
        ancestrySlug: "human",
        type: "ancestryTrait",
        choiceType: "automatic",
        description: "Humans vary widely in height and build. Your size is Medium.",
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
        name: "Human Speed",
        slug: "human-speed",
        ancestrySlug: "human",
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
        name: "Human Languages",
        slug: "human-languages",
        ancestrySlug: "human",
        type: "ancestryTrait",
        choiceType: "automatic",
        description:
          "You can speak, read, write, and sign Common and one additional language of your choice.",
        choices: [
          {
            choiceId: "human-extra-language",
            choose: 1,
            from: "languages"
          }
        ],
        effects: [],
        displayOrder: 4
      }
    ]);

    await ancestryGifts.deleteMany({ ancestrySlug: "human" });

    await ancestryGifts.insertMany([
      {
        name: "Diehard Survivor",
        slug: "diehard-survivor",
        ancestrySlug: "human",
        type: "ancestryGift",
        choiceType: "selectable",
        summary:
          "You possess a stubborn survival instinct and can endure hardship better than most.",
        description: [
          "Some humans survive through grit alone. Whether raised in harsh wilds, war-torn lands, or unforgiving cities, you have learned how to keep going when others would fall."
        ],
        features: [
          {
            name: "Feast and Famine",
            description:
              "You can go longer than normal without food and water, and you are accustomed to surviving in poor conditions."
          },
          {
            name: "Radical Perseverance",
            description:
              "When hardship threatens to break you, your determination helps you push forward."
          }
        ],
        effects: [],
        prerequisites: {
          ancestrySlug: "human"
        },
        displayOrder: 1
      },
      {
        name: "Skilled",
        slug: "skilled",
        ancestrySlug: "human",
        type: "ancestryGift",
        choiceType: "selectable",
        summary: "You gain additional training through practice, education, or talent.",
        description: [
          "Many humans distinguish themselves through specialized training. You have developed a practical skill that gives you an edge."
        ],
        choices: [
          {
            choiceId: "human-skill-choice",
            choose: 1,
            from: "skills"
          }
        ],
        effects: [],
        prerequisites: {
          ancestrySlug: "human"
        },
        displayOrder: 2
      },
      {
        name: "Intrepid",
        slug: "intrepid",
        ancestrySlug: "human",
        type: "ancestryGift",
        choiceType: "selectable",
        summary:
          "You are bold, curious, and difficult to discourage when facing the unknown.",
        description: [
          "Some humans are driven by discovery. You are willing to press onward into danger, mystery, and strange lands."
        ],
        features: [
          {
            name: "Bold Explorer",
            description:
              "You are especially suited to exploration, travel, and facing unfamiliar dangers."
          }
        ],
        effects: [],
        prerequisites: {
          ancestrySlug: "human"
        },
        displayOrder: 3
      }
    ]);

    console.log("Human ancestry seeded successfully.");
  } catch (error) {
    console.error("Error seeding Human ancestry:", error);
  } finally {
    await client.close();
  }
}

seedHuman();