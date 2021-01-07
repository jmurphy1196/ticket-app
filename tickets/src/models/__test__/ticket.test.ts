import Ticket from "../ticket";
import mongoose from "mongoose";

it("impletments optimistic concurrency control", async (done) => {
  const ticket = Ticket.build({
    title: "concert",
    price: 34,
    userId: mongoose.Schema.Types.ObjectId.toString(),
  });

  await ticket.save();

  const firstInstance: mongoose.Document = await Ticket.findById(ticket.id);
  const secondInstance: mongoose.Document = await Ticket.findById(ticket.id);

  firstInstance.set({ price: 10 });
  secondInstance.set({ price: 34 });

  await firstInstance.save();
  try {
    await secondInstance.save();
  } catch (err) {
    return done();
  }
  throw new Error("should not reach this point");
});

it("version number should increment by one", async () => {
  const ticket = Ticket.build({
    title: "lskdjf",
    price: 34,
    userId: mongoose.Schema.Types.ObjectId.toString(),
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
});
