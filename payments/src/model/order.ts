import { OrderStatus } from "@tkmaster/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface OrderAttrs {
  id: string;
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

export interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const requiredString = {
  type: String,
  required: true,
};

const orderSchema = new mongoose.Schema(
  {
    userId: requiredString,
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set("versionKey", "version");

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};

orderSchema.plugin(updateIfCurrentPlugin);

const Order = mongoose.model<OrderDoc, OrderModel>("order", orderSchema);

export default Order;
