const express = require("express");
const app = express();
const cors = require("cors");
const { google } = require("googleapis");
const fs = require("fs");
const dotenv = require("dotenv");
const morgan = require("morgan");
const formidable = require("formidable");
const userCredentials = require("./client_secret.json");
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
dotenv.config();

const PORT = process.env.PORT || 5000;
const client_id = userCredentials.web.client_id;
const client_secret = userCredentials.web.client_secret;
const redirect_uris = userCredentials.web.redirect_uris;
const authClient = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const SCOPE = [
  "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.file",
];

app.get("/", (req, res) => {
  res.status(200).json("welcome to OAuth backend implementation");
});

//get auth url
app.get("/getUrl", (req, res) => {
  try {
    const authUrl = authClient.generateAuthUrl({
      access_type: "offline",
      scope: SCOPE,
      prompt: "consent",
    });
    console.log(authUrl);
    return res.status(200).json(authUrl);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/getToken", (req, res) => {
  try {
    if (!req.body.code) return res.status(400).jason("invalid code");
    authClient.getToken(req.body.code, (err, token) => {
      if (err) return res.status(400).json(err);
      return res.send(token);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//access user profile details
app.post("/userDetails", (req, res) => {
  try {
    if (req.body.token == null) return res.status(400).send("no token found");
    authClient.setCredentials(req.body.token);
    const gauth2 = google.oauth2({ version: "v2", auth: authClient });

    gauth2.userinfo.get((err, response) => {
      if (err) return res.status(400).json(err);
      res.status(200).json(response.data);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//read drive files

app.post("/driveInfo", (req, res) => {
  try {
    if (req.body.token == null) return res.status(400).json("no token found");
    authClient.setCredentials(req.body.token);
    const gdrive = google.drive({ version: "v3", auth: authClient });
    gdrive.files.list(
      {
        pageSize: 8,
      },
      (err, response) => {
        if (err) {
          return res.status(400).json(err);
        }
        const files = response.data.files;
        res.status(200).json(files);
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/upload", (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    console.log(form);

    form.parse(req, (err, fields, files) => {
      if (err) return res.status(400).send(err.message);
      const token = JSON.parse(fields.token);

      if (token == null) return res.status(400).send("no token found");
      authClient.setCredentials(token);
      //   console.log(files.file);
      const drive = google.drive({ version: "v3", auth: authClient });
      const fileMetadata = {
        name: files.file.name,
      };
      const media = {
        mimeType: files.file.type,
        body: fs.createReadStream(files.file.path),
      };
      drive.files.create(
        {
          resource: fileMetadata,
          media: media,
          fields: "id",
        },
        (err, file) => {
          authClient.setCredentials(null);
          if (err) {
            res.status(400).json(err);
          } else {
            res.status(200).json("Successful");
          }
        }
      );
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.delete("/delete/:id", (req, res) => {
  try {
    if (req.body.token == null) return res.status(400).send("Token not found");
    authClient.setCredentials(req.body.token);
    const gdrive = google.drive({ version: "v3", auth: authClient });
    const fileId = req.params.id;
    gdrive.files
      .delete({ fileId: fileId })
      .then(() => {
        res.status(200).json("file deleted successfully");
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/download/:id", (req, res) => {
  try {
    if (req.body.token == null) return res.status(400).json("no token found");
    authClient.setCredentials(req.body.token);
    const drive = google.drive({ version: "v3", auth: authClient });
    const fileId = req.params.id;
    drive.files.get(
      { fileId: fileId, alt: "media" },
      { responseType: "stream" },
      (err, response) => {
        response?.data
          .on("end", () => {
            console.log("Done");
          })
          .on("error", (err) => {
            console.log("Error", err);
          })
          .pipe(res);
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(PORT, () => {
  console.log(`${PORT} listen sucessfully`);
});
