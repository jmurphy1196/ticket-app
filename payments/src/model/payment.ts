import mongoose from "mongoose";

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

export interface PaymentDoc extends mongoose.Document {
  orderid: string;
  stripeid: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const requiredString = {
  type: String,
  required: true,
};

const paymentSchema = new mongoose.Schema(
  {
    orderId: requiredString,
    stripeId: requiredString,
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

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);
export default Payment;
