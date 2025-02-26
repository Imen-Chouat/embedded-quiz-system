import envConfig from "./config/envConfig";
import app from "./app";

const PORT = envConfig.PORT || 5000 ;//Imen : choose any port that available for you

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});