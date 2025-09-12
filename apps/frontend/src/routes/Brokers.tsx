import { useContext, useState } from "react";
import { Button } from "../components/design-system";
import { BrokerModal } from "../components/Broker/BrokerModal";
import { BrokersTable } from "../components/Broker/BrokersTable";
import { BrokerFormInput } from "../types/BrokerForm";
import { createBroker } from "../api/brokers";
import { AuthContext } from "../contexts/AuthContext";

export function Brokers() {
  const [isOpen, setIsOpen] = useState(false);
  const [createdBroker, setCreatedBroker] = useState(null);
  const auth = useContext(AuthContext);

  const handleCreateBroker = async (data: BrokerFormInput) => {
    const broker = await createBroker(data);
    setCreatedBroker(broker);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Brokers</h1>
        <Button onClick={() => setIsOpen(true)}>+ Add Broker</Button>
      </div>

      {
        auth?.token ?
        <BrokersTable newBroker={createdBroker} />
        : <div>Loading...</div>
      }

      <BrokerModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleCreateBroker}
      />
    </div>
  );
}
