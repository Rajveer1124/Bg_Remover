import { Webhook } from "svix";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body),{
      "svix-id":req.headers["svix-id"],
      "svix-timestamp":req.headers["svix-timestamp"],
      "svix-signature":req.headers["svix-signature"]
    })
    const {data,type} = req.body;

    console.log("Clerk Webhook Type:", type);

    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url
        };

        await userModel.create(userData);
        res.json({})
        break;
      }

      case "user.updated": {
        const updateData = {
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url
        };

        await userModel.findOneAndUpdate({ clerkId: data.id }, updateData);
        res.json({})
        break;
      }

      case "user.deleted": {
        await userModel.findOneAndDelete({ clerkId: data.id });
        res.json({})
        break;
      }

      default:
        console.warn("⚠️ Unhandled webhook type:", type);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

const userCredits = async (req, res) => {
  try {
    const { clerkId } = req.body;

    if (!clerkId) {
      return res.status(400).json({ success: false, message: "Missing clerkId" });
    }

    const user = await userModel.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      credits: user.creditBalance || 0,
    });
  } catch (error) {
    console.error("userCredits error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { clerkWebhooks ,userCredits };