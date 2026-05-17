// @ts-nocheck
﻿import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "./index";
import { articles } from "./schema";
import { eq } from "drizzle-orm";

async function updateCampaign() {
  console.log("🔄 Updating headline to Kwara State...");

  await db.update(articles)
    .set({
      title: "THE NEW VISION FOR KWARA. APC APPROVED ARABA AS THE NEXT RUNNING CANDIDATE FOR 2027 ELECTION",
      author: "Political Desk"
    })
    .where(eq(articles.slug, "araba-2027-vision"));

  console.log("✅ Kwara State Headline Live!");
  process.exit(0);
}

updateCampaign();
