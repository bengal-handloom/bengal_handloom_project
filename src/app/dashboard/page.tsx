import { Title, Text } from "@mantine/core";
import { MyOrdersSection } from "@/components/dashboard/MyOrdersSection";

export default function DashboardPage() {
  return (
    <>
      <Title order={1} className="mb-2 text-3xl font-bold text-white">
        My Dashboard
      </Title>
      <Text className="mb-10 text-white/50">
        Track your wholesale booking requests and production status.
      </Text>
      <MyOrdersSection />
    </>
  );
}