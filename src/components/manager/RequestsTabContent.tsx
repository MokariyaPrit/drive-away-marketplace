
import { Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedTestDriveRequest } from '@/types/requests';
import RequestCard from './RequestCard';

interface RequestsTabContentProps {
  requests: EnhancedTestDriveRequest[];
  status?: 'pending' | 'approved' | 'rejected';
  isResponseDialogOpen: boolean;
  selectedRequest: EnhancedTestDriveRequest | null;
  responseAction: 'approved' | 'rejected' | null;
  setIsResponseDialogOpen: (isOpen: boolean) => void;
  openResponseDialog: (request: EnhancedTestDriveRequest, action: 'approved' | 'rejected') => void;
  setResponseMessage: (message: string) => void;
  setSelectedRequest: (request: EnhancedTestDriveRequest | null) => void;
  handleResponseSubmit: () => void;
}

export function RequestsTabContent({
  requests,
  status,
  isResponseDialogOpen,
  selectedRequest,
  responseAction,
  setIsResponseDialogOpen,
  openResponseDialog,
  setResponseMessage,
  setSelectedRequest,
  handleResponseSubmit
}: RequestsTabContentProps) {
  // Filter requests by status if provided
  const filteredRequests = status 
    ? requests.filter(r => r.status === status) 
    : requests;

  if (filteredRequests.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        {status === 'pending' ? (
          <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        ) : status === 'approved' ? (
          <CheckCircle2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        ) : status === 'rejected' ? (
          <XCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        ) : (
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        )}
        
        {!status ? (
          <>
            <h3 className="text-xl font-medium mb-2">No test drive requests yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't received any test drive requests yet. Make sure your car listings are up to date.
            </p>
            <Button asChild>
              <a href="/manager/listings">View My Listings</a>
            </Button>
          </>
        ) : (
          <p className="text-gray-600">No {status} test drive requests.</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredRequests.map(request => (
        <RequestCard
          key={request.id}
          request={request}
          isResponseDialogOpen={isResponseDialogOpen}
          selectedRequest={selectedRequest}
          responseAction={responseAction}
          setIsResponseDialogOpen={setIsResponseDialogOpen}
          openResponseDialog={openResponseDialog}
          setResponseMessage={setResponseMessage}
          setSelectedRequest={setSelectedRequest}
          handleResponseSubmit={handleResponseSubmit}
        />
      ))}
    </div>
  );
}

export default RequestsTabContent;
