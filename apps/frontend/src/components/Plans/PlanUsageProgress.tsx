import { Card, Flex, Text, Progress } from "@radix-ui/themes";

interface PlanUsageProgressProps {
  used: number;
  total: number;
}

export function PlanUsageProgress({ used, total }:PlanUsageProgressProps) {
  const percent = used && total ? (used / total ) * 100 : 0;

  return (
    <Card size="3" className="bg-white dark:bg-neutral-800 p-4 sm:p-8 rounded-lg shadow-sm border-neutral-200 dark:border-neutral-700">
      <Flex direction="column" gap="3">
        <Text weight="bold">Plans Usage</Text>
        <Text size="2" color="gray">{used} / {total} plans used</Text>

        <Progress
          value={percent}
          color={percent > 85 ? "red" : "green"}
          size="3"
        />
      </Flex>
    </Card>
  );
}
