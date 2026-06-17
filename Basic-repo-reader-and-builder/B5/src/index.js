const { createApp } = require("./app");

const PORT = process.env.PORT || 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`[INFO] Transaction service listening on http://127.0.0.1:${PORT}`);
});
