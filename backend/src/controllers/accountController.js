import mongoose from "mongoose";
import Account from "../models/accountModel.js";
export const balance = async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId });

    res.json({ balance: account.balance });
  } catch (error) {
    console.error("Balance error:", error);
    return res
      .status(500)
      .json({ error: "Server error while getting balance" });
  }
};

export const transfer = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { receiver, amount } = req.body;
    const senderAccount = await Account.findOne({
      userId: req.userId,
    }).session(session);

    console.log(senderAccount);
    console.log(senderAccount.balance);
    if (!senderAccount || senderAccount.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Insufficient balance" });
    }
    const toAccount = await Account.findOne({
      userId: receiver,
    }).session(session);
    if (!toAccount) {
      await session.aboutTransaction();
      return res.status(400).json({ error: "Receiver not found" });
    }
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.updateOne(
      { userId: receiver },
      { $inc: { balance: amount } }
    ).session(session);
    await session.commitTransaction();
    res.status(200).json({ message: "Transfer successful" });
  } catch (error) {}
};
