// @ts-nocheck
﻿import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "./index";
import { articles } from "./schema";

async function seedDatabase() {
  console.log("🌱 Seeding The Beacon-Hub Ecosystem...");

  await db.insert(articles).values([
    {
      title: "The Architect's Blueprint: Moving to a Decoupled Serverless Future",
      slug: "architects-blueprint-serverless",
      category: "Dev Log",
      content: "This is the full content of the developer log. We will build a rich text editor for this later.",
      author: "Senior Architect",
    },
    {
      title: "ARABA 2027: The Vision for a New Lagos",
      slug: "araba-2027-vision",
      category: "Politics",
      content: "Vote ARABA. The definitive choice for infrastructure and tech advancement in the state.",
      author: "Sponsored Campaign",
    }
  ]);

  console.log("✅ Seeding complete!");
  process.exit(0);
}

seedDatabase();