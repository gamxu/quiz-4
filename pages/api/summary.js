import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB } from "../../backendLibs/dbLib";

export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    //return res.status(403).json({ ok: false, message: "Permission denied" });
    const user = checkToken(req);
    if (!user || user.isAdmin === false) {
      return res.status(403).json({
        ok: false,
        message: "Permission denied",
      });
    }

    //compute DB summary
    const users = readUsersDB();
    const admins = users.filter((x) => x.isAdmin === true);
    const adminCount = admins.length;
    const customers = users.filter((x) => x.isAdmin === false);
    const userCount = customers.length;
    let totalMoney = 0;
    for (const x of customers) {
      totalMoney += x.money;
    }

    //return response
    return res.json({ ok: true, userCount, adminCount, totalMoney });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
