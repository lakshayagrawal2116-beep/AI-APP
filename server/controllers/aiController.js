import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js'
import { GoogleGenAI } from "@google/genai";
// import FormData from "form-data";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({ success: false, message: "Limit reached. Upgrade to continue." })
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [{
        role: "user",
        content: prompt,
      },
      ],
      temperature: 0.7,
      max_tokens: 2048,
      stream: true,
    });

    let content = "";
    for await (const chunk of response) {
      const text = chunk.choices[0]?.delta?.content || "";
      if (text) {
        content += text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }
    res.write(`data: [DONE]\n\n`);

    await sql` INSERT INTO creations (user_id, prompt, content, type) 
        VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      })
    }

    res.end();

  } catch (error) {
    console.log(error.message)
    if (!res.headersSent) {
      res.json({ success: false, message: error.message });
    } else {
      res.end();
    }
  }
}

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({ success: false, message: "Limit reached. Upgrade to continue." })
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt, }],
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    });

    let content = "";
    for await (const chunk of response) {
      const text = chunk.choices[0]?.delta?.content || "";
      if (text) {
        content += text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }
    res.write(`data: [DONE]\n\n`);

    await sql` INSERT INTO creations (user_id, prompt, content, type) 
        VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      })
    }

    res.end();

  } catch (error) {
    console.log(error.message)
    if (!res.headersSent) {
      res.json({ success: false, message: error.message });
    } else {
      res.end();
    }
  }
}
export const explainCode = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { code, language } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (!code || !code.trim()) {
      return res.json({ success: false, message: "Code is required" });
    }

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const prompt = `
You are a senior software engineer.

Explain the following ${language} code in detail.
Include:
1. High-level overview
2. Line-by-line explanation
3. Time complexity
4. Space complexity
5. Edge cases
6. Optimization suggestions

Code:
${code}
`;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 5000,
      stream: true,
    });

    let content = "";
    for await (const chunk of response) {
      const text = chunk.choices[0]?.delta?.content || "";
      if (text) {
        content += text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }
    res.write(`data: [DONE]\n\n`);

    // ✅ FIXED SQL INSERT
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Explain ${language} code`}, ${content}, 'code-explanation')
    `;

    // ✅ FIX FREE USAGE UPDATE
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.json({ success: false, message: error.message });
    } else {
      res.end();
    }
  }
};



export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== 'premium') {
      return res.json({ success: false, message: "This feature is only available for premium subscriptions" })
    }


    const formData = new FormData()
    formData.append('prompt', prompt)
    const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
      headers: { 'x-api-key': process.env.CLIPDROP_API_KEY, },
      responseType: "arraybuffer",
    })

    const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image)


    await sql` INSERT INTO creations (user_id, prompt, content, type, publish) 
        VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

    res.json({ success: true, content: secure_url })

  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}



// export const generateImage = async (req, res) => {
//   try {
//     const { userId } = req.auth();
//     const { prompt, publish } = req.body;
//     const plan = req.plan;

//     if (plan !== "premium") {
//       return res.json({
//         success: false,
//         message: "This feature is only available for premium subscriptions",
//       });
//     }

//     if (!prompt || !prompt.trim()) {
//       return res.json({ success: false, message: "Prompt is required" });
//     }

//     const response = await genAI.models.generateContent({
//       model: "gemini-2.5-flash-image",
//       contents: prompt,
//     });

//     const parts = response.candidates?.[0]?.content?.parts || [];
//     const imagePart = parts.find((p) => p.inlineData);

//     if (!imagePart) {
//       return res.json({
//         success: false,
//         message: "Image generation failed",
//       });
//     }

//     const base64 = imagePart.inlineData.data;
//     const mimeType = imagePart.inlineData.mimeType || "image/png";

//     const upload = await cloudinary.uploader.upload(
//       `data:${mimeType};base64,${base64}`
//     );

//     await sql`
//       INSERT INTO creations (user_id, prompt, content, type, publish)
//       VALUES (${userId}, ${prompt}, ${upload.secure_url}, 'image', ${publish ?? false})
//     `;

//     res.json({ success: true, content: upload.secure_url });
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== 'premium') {
      return res.json({ success: false, message: "This feature is only available for premium subscriptions" })
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: 'background_removal',
          background_removal: 'remove_the_background'
        }
      ]
    })

    await sql` INSERT INTO creations (user_id, prompt, content, type) 
        VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;

    res.json({ success: true, content: secure_url })

  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;   // full user sentence
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.status(402).json({
        success: false,
        message: "This feature is only available for premium users",
      });
    }

    if (!image || !prompt) {
      return res.status(400).json({
        success: false,
        message: "Image and prompt are required",
      });
    }

    // 🧠 Extract object from user prompt (simple & safe)
    const object = prompt
      .toLowerCase()
      .replace(/remove|delete|erase|from|the|a|an|background|image/gi, "")
      .trim()
      .split(" ")[0];

    if (!object) {
      return res.status(400).json({
        success: false,
        message: "Could not detect object to remove",
      });
    }

    // 1️⃣ Upload original image
    const upload = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    });

    // 2️⃣ Apply Cloudinary GenAI removal
    const resultUrl = cloudinary.url(upload.public_id, {
      transformation: [
        { effect: `gen_remove:${object}` },
      ],
      version: Date.now(), // 🚨 force GenAI render
      secure: true,
    });

    // 3️⃣ Save to DB
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (
        ${userId},
        ${prompt},
        ${resultUrl},
        'image'
      )
    `;

    res.json({
      success: true,
      content: resultUrl,
    });

  } catch (error) {
    console.error("Remove object error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to remove object from image",
    });
  }
};



export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (plan !== 'premium') {
      return res.json({ success: false, message: "This feature is only available for premium subscriptions" })
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({ success: false, message: "Resume file size exceeds allowed size (5MB)." })
    }

    const dataBuffer = fs.readFileSync(resume.path)
    const pdfData = await pdf(dataBuffer)

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}`

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt, }],
      temperature: 0.7,
      max_tokens: 5000,
      stream: true,
    });

    let content = "";
    for await (const chunk of response) {
      const text = chunk.choices[0]?.delta?.content || "";
      if (text) {
        content += text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }
    res.write(`data: [DONE]\n\n`);

    await sql` INSERT INTO creations (user_id, prompt, content, type) 
        VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;

    res.end();

  } catch (error) {
    console.log(error.message)
    if (!res.headersSent) {
      res.json({ success: false, message: error.message });
    } else {
      res.end();
    }
  }
}