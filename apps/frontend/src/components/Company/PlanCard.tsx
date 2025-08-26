import { useState } from 'react';
import { Badge, Card, CardContent } from '../design-system';
import { ChevronDown, ChevronUp, Download, Eye } from 'lucide-react';
import { CreditabilityStatus } from '@creditable/rule-engine';
import { Tooltip } from 'react-tooltip';
import { getReport } from '../../api/plans';

type PlanCardProps = {
  plan: {
    id: string;
    name: string;
    year: number;
    type: string;
    deductible: number;
    moop: number;
    monthlyPremiumRx: number;
    integratedDeductible: boolean;

    t1CostSharingType: 'COPAY' | 'COINSURANCE';
    t2CostSharingType: 'COPAY' | 'COINSURANCE';
    t3CostSharingType: 'COPAY' | 'COINSURANCE';
    t4CostSharingType: 'COPAY' | 'COINSURANCE';

    t1ShareValue: number;
    t2ShareValue: number;
    t3ShareValue: number;
    t4ShareValue: number;

    t1UsesDeductible: boolean;
    t2UsesDeductible: boolean;
    t3UsesDeductible: boolean;
    t4UsesDeductible: boolean;
    evaluations: {
      method: string;
      result: CreditabilityStatus;
      reasoning: string;
      isCreditable: boolean;
      actuarialValue: number;
      createdAt: Date;
    }[];
  };
};

export default function PlanCard({ plan }: PlanCardProps) {
  const [expanded, setExpanded] = useState(false);

  const latestEvaluation = plan.evaluations?.[0];

  const handleDownload = (action: "view" | "download") => {
    const report = getReport(plan.id, action);
  }

  return (
    <Card className="mb-4">
      <div
        className="flex items-center justify-between px-4 py-3 hover:bg-muted rounded-t"
      >
        <div>
          <h3 className="font-semibold cursor-pointer" onClick={() => setExpanded((prev) => !prev)}>{plan.name} ({plan.year})</h3>
          <div className="flex flex-row gap-2">

            <Badge
              variant={
                latestEvaluation?.isCreditable
                  ? 'success'
                  : !latestEvaluation?.isCreditable
                  ? 'destructive'
                  : 'secondary'
              }
            >
              {latestEvaluation?.isCreditable ? 'CREDITABLE' : !latestEvaluation?.isCreditable ? 'NOT CREDITABLE' : 'Unknown'}
            </Badge>
            {latestEvaluation.actuarialValue &&
            <>
              <Badge
                id="av-anchor"
                variant={
                  latestEvaluation?.result === 'CREDITABLE'
                    ? 'success'
                    : latestEvaluation?.result === 'NON_CREDITABLE'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {latestEvaluation?.actuarialValue * 100}%
              </Badge>
              <Tooltip anchorSelect="#av-anchor" place="bottom" style={{zIndex: '999'}}>
              {latestEvaluation.reasoning}
              </Tooltip>
            </>
            }
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <Eye size={20} id="view-anchor" className="cursor-pointer" onClick={() => handleDownload('view')} />
          <Download size={20} id="download-anchor" className="cursor-pointer" onClick={() => handleDownload('download')} />
          <Tooltip anchorSelect="#view-anchor" place="bottom">
            View Creditable Report
          </Tooltip>
          <Tooltip anchorSelect="#download-anchor" place="bottom">
            Download Creditable Report
          </Tooltip>
          {expanded ? <ChevronUp size={20} className="cursor-pointer" onClick={() => setExpanded((prev) => !prev)} /> : <ChevronDown size={20} className="cursor-pointer" onClick={() => setExpanded((prev) => !prev)} />}
        </div>
      </div>

      {expanded && (
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm pt-2">
            <div className="flex"><strong>Year:</strong><div className="w-full pl-14">{plan.year}</div></div>
            <div className="flex"><strong>Plan Type:</strong><div className="pl-4">{plan.type}</div></div>
            <div className="flex"><strong>Premium:</strong><div className="w-full pl-24">${plan.monthlyPremiumRx}</div></div>
            <div className="flex"><strong>Deductible:</strong><div className="w-full pl-2">${plan.deductible}</div></div>
            <div className="flex"><strong>MOOP:</strong> <div className="w-full pl-10">${plan.moop}</div></div>
            <div className="flex"><strong>Integrated Deductible:</strong><div className="pl-2">{plan.integratedDeductible ? 'Yes' : 'No'}</div></div>
          </div>
          <table className="min-w-full mt-8 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Share Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Share Value</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uses Deductible</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier 1
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {plan.t1CostSharingType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {plan.t1ShareValue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {plan.t1UsesDeductible ? 'Yes' : 'No'}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier 2
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {plan.t2CostSharingType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {plan.t2ShareValue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {plan.t2UsesDeductible ? 'Yes' : 'No'}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier 3
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {plan.t3CostSharingType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {plan.t3ShareValue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {plan.t3UsesDeductible ? 'Yes' : 'No'}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier 4
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {plan.t4CostSharingType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {plan.t4ShareValue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {plan.t4UsesDeductible ? 'Yes' : 'No'}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      )}
    </Card>
  );
}
