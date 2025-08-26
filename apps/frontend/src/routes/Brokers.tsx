import { useState } from "react";
import { Button } from "../components/design-system";
import { BrokerModal } from "../components/Broker/BrokerModal";
import { BrokersTable } from "../components/Broker/BrokersTable";
import { BrokerFormInput } from "../types/BrokerForm";
import { createBroker } from "../api/brokers";

export function Brokers() {
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateBroker = async (data: BrokerFormInput) => {
    const broker = await createBroker(data);
    window.location.reload();
    // Optionally trigger a refetch or update UI
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Brokers</h1>
        <Button onClick={() => setIsOpen(true)}>+ Add Broker</Button>
      </div>

      <BrokersTable />

      <BrokerModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleCreateBroker}
      />
    </div>
  );
}
