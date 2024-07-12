import "module-alias/register";

import app from "@/app";
import { User } from "@/models/user-model";
User;
const port = process.env.PORT || 9999;

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
