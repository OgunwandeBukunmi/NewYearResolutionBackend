import { generateId } from "../utils/idGenerator.js";
import clientPromise from "../libs/mongodb.js";
import cloudinary from "../libs/cloudinary.js";


const client = await clientPromise

// POST /api/share
export const createShare = async (req, res) => {
  try {
    const { image, title, summary } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "resolution-guides",
      resource_type: "image",
    });

    // Generate share ID
    const shareId = generateId()
    // test
    console.log(uploadResult.secure_url)

    console.log(process.env.RAILWAY_PUBLIC_DOMAIN)
    const backendUrl = process.env.RAILWAY_PUBLIC_DOMAIN
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
      : `http://localhost:${process.env.PORT || 5000}`;

    const shareUrl = `${backendUrl}/share/${shareId}`;

    const frontendUrl = process.env.RAILWAY_PUBLIC_DOMAIN
      ? `${process.env.FRONTEND_URL}`
      : `http://localhost:5173`;

    // Sending URL to mongodb backend

    const db = client.db("newyearresolutionguide")
    const collection = await db.collection("imageUrls")
    const doc = await collection.insertOne({
      image: uploadResult.secure_url,
      uniqueId: shareId,
      title: title
    });



    res.json({
      shareId,
      imageUrl: uploadResult.secure_url,
      shareUrl: shareUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};

// GET /share/:id
export const getSharePage = async (req, res) => {
  try {
    const { id } = req.params
    console.log(id)
    const db = client.db("newyearresolutionguide")
    const collection = await db.collection("imageUrls")
    const doc = await collection.findOne({ uniqueId: id })

      const frontendUrl = process.env.RAILWAY_PUBLIC_DOMAIN
      ? `${process.env.FRONTEND_URL}`
      : `http://localhost:5173`;
      
    if (!doc) {
  console.log("No document found with that id");
  return;
} 
  let {image} = doc
  console.log(image)
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="og:title" content="My New Year Resolution Guide" />
          <meta property="og:description" content="I created my AI-generated guide 🎯" />
          <meta property="og:image" content="${image}" />
          <meta name="twitter:card" content="summary_large_image" />
          <title>My Resolution Guide</title>
        </head>
        <body>
          <img src="${image}" alt="AI Generated Guide"  />
            <script>
        window.location.href = "${frontendUrl}";
      </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
