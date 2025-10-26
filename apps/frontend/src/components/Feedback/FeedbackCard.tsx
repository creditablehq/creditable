import { useState } from "react";
import { Badge, Card, CardContent } from "../design-system";
import { ChevronDown, ChevronUp } from "lucide-react";

type FeedbackCardProps = {
  supportTicket: {
    id: string;
    message: string;
    type: "FEATURE_REQUEST" | "BUG";
    user: any;
    createdAt: string;
  };
  onDelete?: (id: string) => void;
};

export default function FeedbackCard({ supportTicket, onDelete }: FeedbackCardProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCloseDeleteModal = () => {
    setName('');
    setError('');
  }

  const formatFeedbackType = (type: string) => {
    switch (type) {
      case 'FEATURE_REQUEST':
        return 'Feature Request';
      case 'BUG':
        return 'Bug';
      default:
        return 'Feedback'
    }
  }

  const displayType = formatFeedbackType(supportTicket.type);
  const displayCreatedAt = new Date(supportTicket.createdAt).toLocaleDateString();

  return (
    <>
      <Card className="mb-4">
        <div
          className="flex items-center justify-between px-4 py-3 hover:bg-muted rounded-t"
        >
          <div>
            <p className="text-sm">
              <Badge
                variant={
                  supportTicket.type === 'FEATURE_REQUEST'
                    ? 'secondary'
                    : supportTicket.type === 'BUG'
                    ? 'destructive'
                    : 'success'
                }
              >
                {displayType}
              </Badge> submitted by
              <span className="font-semibold"> {supportTicket.user?.name}</span> on <span className="font-semibold"> {displayCreatedAt}</span>
            </p>
          </div>
        </div>
        <CardContent className="pt-0">
          <div className="grid gap-4 text-sm">
            <div className="flex gap-2">
              <strong>Message:</strong>
              <div>{supportTicket.message}</div>
            </div>
          </div>
          <p className="mt-4 text-xs">{supportTicket.id}</p>
        </CardContent>
      </Card>
    </>
  );
}
