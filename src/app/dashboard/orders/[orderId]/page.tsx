import { redirect } from "next/navigation";
import { requireUserPage } from "@/lib/requireUser";
import { getOrderById } from "@/lib/orderFirestore";
import { OrderSuccessView } from "@/components/dashboard/OrderSuccessView";

type PageProps = { params: Promise<{ orderId: string }> };

export default async function OrderDetailPage({ params }: PageProps) {
  const user = await requireUserPage();
  const { orderId } = await params;
  const order = await getOrderById(orderId);
  if (!order || order.userId !== user.uid) redirect("/dashboard");
  return <OrderSuccessView order={order} />;
}