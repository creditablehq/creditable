import { useEffect, useState } from "react";
import { getSupportTickets } from "../api/supportTickets";
import FeedbackCard from "../components/Feedback/FeedbackCard";

export function Feedback() {
  const [loading, setLoading] = useState(true);
  const [feedbackTickets, setFeedbackTickets] = useState([]);

  useEffect(() => {
    async function fetchFeedback() {
      await getSupportTickets().then(setFeedbackTickets);
      setLoading(false);
    }

    fetchFeedback();
  }, []);

  if (loading) return <p>Loading Feedback data...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Submitted Feedback</h1>
      </div>

      {!feedbackTickets.length && 
        <div className="flex w-full h-56 items-center text-center justify-center">All clear! No user submitted feedback!</div>
      }

      {feedbackTickets.length > 0 && feedbackTickets.map((ticket: any) => {
        return (<FeedbackCard key={ticket?.id} supportTicket={ticket} />);
      })}
    </div>
  )
}
