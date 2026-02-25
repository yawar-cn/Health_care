import { apiRequest } from "./request";
import { getEndpointOrThrow } from "./serviceRegistry";
import { requireFields } from "../utils/validation";

export const createPaymentOrder = async ({ referenceId, paymentType, amount }) => {
  requireFields({ referenceId, paymentType, amount }, [
    "referenceId",
    "paymentType",
    "amount"
  ]);

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "PAYMENT-SERVICE",
    method: "POST",
    path: "/payments/create-order"
  });

  return apiRequest({
    service,
    method: endpoint.method,
    url: endpoint.path,
    data: { referenceId, paymentType, amount }
  });
};

export const verifyPayment = async ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  referenceId,
  paymentType,
  amount
}) => {
  requireFields(
    { razorpayOrderId, razorpayPaymentId, razorpaySignature, referenceId, paymentType, amount },
    [
      "razorpayOrderId",
      "razorpayPaymentId",
      "razorpaySignature",
      "referenceId",
      "paymentType",
      "amount"
    ]
  );

  const { service, endpoint } = getEndpointOrThrow({
    serviceName: "PAYMENT-SERVICE",
    method: "POST",
    path: "/payments/verify"
  });

  return apiRequest({
    service,
    method: endpoint.method,
    url: endpoint.path,
    data: {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      referenceId,
      paymentType,
      amount
    }
  });
};
