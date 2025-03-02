import envConfig from "./config/envConfig.js";
import app from "./app.js";

const PORT = envConfig.PORT || 5000 ;//Imen : choose any port that available for you

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});