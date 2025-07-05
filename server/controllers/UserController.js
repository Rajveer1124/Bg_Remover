import { Webhook } from "svix";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = req.body;
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const evt = whook.verify(payload, headers);
    const { data, type } = evt;
    console.log(type);
    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };
        console.log("Creating user:", userData);
        await userModel.create(userData);
        return res.status(200).json({ success: true });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };
        await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
        return res.status(200).json({ success: true });
      }

      case "user.deleted": {
        await userModel.findOneAndDelete({ clerkId: data.id });
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(400).json({ success: false, message: "Unhandled event type" });
    }
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const userCredits = async (req, res) => {
  try {
    const { clerkId } = req;
    const userData = await userModel.findOne({ clerkId });

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, credits: userData.creditBalance });
  } catch (error) {
    console.error("❌ userCredits error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { clerkWebhooks, userCredits };
