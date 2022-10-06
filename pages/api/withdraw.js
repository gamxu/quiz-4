import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";

export default function withdrawRoute(req, res) {
  if (req.method === "PUT") {
    //check authentication
    //return res.status(403).json({ ok: false, message: "You do not have permission to withdraw" });
    const user = checkToken(req);
    if (!user || user.isAdmin === true) {
      return res.status(403).json({
        ok: false,
        message: "You do not have permission to withdraw",
      });
    }

    const amount = req.body.amount;
    //validate body
    if (typeof amount !== "number")
      return res.status(400).json({ ok: false, message: "Invalid amount" });

    //check if amount < 1
    // return res.status(400).json({ ok: false, message: "Amount must be greater than 0" });
    if (amount < 1)
      return res
        .status(400)
        .json({ ok: false, message: "Amount must be greater than 0" });

    //find and update money in DB (if user has enough money)
    const users = readUsersDB();
    const userIdx = users.findIndex((x) => x.username === user.username);

    //return res.status(400).json({ ok: false, message: "You do not has enough money" });
    if (users[userIdx].money < amount)
      return res
        .status(400)
        .json({ ok: false, message: "You do not has enough money" });

    users[userIdx].money -= amount;
    writeUsersDB(users);

    //return response
    return res.json({ ok: true, money: users[userIdx].money });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
