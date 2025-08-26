import { useState } from "react";
import { Button } from "../components/design-system";
import { CompanyModal } from "../components/Company/CompanyModal";
import { createCompany } from "../api/companies";
import { CompaniesTable } from "../components/Company/CompaniesTable";

export function Clients() {
  const [isOpen, setIsOpen] = useState(false);
  const [createdCompany, setCreatedCompany] = useState(null);

  const handleCreateCompany = async (data: { name: string }) => {
    const company = await createCompany(data);
    setCreatedCompany(company);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Clients</h1>
        <Button onClick={() => setIsOpen(true)}>+ New Company</Button>
      </div>

      <CompaniesTable newCompany={createdCompany} />

      <CompanyModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleCreateCompany}
      />
    </div>
  );
}
