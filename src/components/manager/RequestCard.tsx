
import { Calendar, CheckCircle2, Clock, MessageSquare, UserSquare, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { EnhancedTestDriveRequest } from '@/types/requests';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import MessageDialog from './MessageDialog';
import ApproveDialog from './ApproveDialog';
import RejectDialog from './RejectDialog';

interface RequestCardProps {
  request: EnhancedTestDriveRequest;
  isResponseDialogOpen: boolean;
  selectedRequest: EnhancedTestDriveRequest | null;
  responseAction: 'approved' | 'rejected' | null;
  setIsResponseDialogOpen: (isOpen: boolean) => void;
  openResponseDialog: (request: EnhancedTestDriveRequest, action: 'approved' | 'rejected') => void;
  setResponseMessage: (message: string) => void;
  setSelectedRequest: (request: EnhancedTestDriveRequest | null) => void;
  handleResponseSubmit: () => void;
}

export function RequestCard({
  request,
  isResponseDialogOpen,
  selectedRequest,
  responseAction,
  setIsResponseDialogOpen,
  openResponseDialog,
  setResponseMessage,
  setSelectedRequest,
  handleResponseSubmit
}: RequestCardProps) {
  return (
    <div key={request.id} className="bg-white rounded-lg shadow-sm overflow-hidden border">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg">{request.car.make} {request.car.model}</h3>
            <p className="text-gray-600 text-sm">{request.car.year} • ${request.car.price.toLocaleString()}</p>
          </div>
          <Badge 
            variant="secondary"
            className={
              request.status === 'approved' ? 'bg-green-100 text-green-800' :
              request.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }
          >
            {request.status === 'approved' ? (
              <span className="flex items-center"><CheckCircle2 className="h-3 w-3 mr-1" /> Approved</span>
            ) : request.status === 'rejected' ? (
              <span className="flex items-center"><XCircle className="h-3 w-3 mr-1" /> Rejected</span>
            ) : (
              <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> Pending</span>
            )}
          </Badge>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-700">
            <UserSquare className="h-4 w-4 mr-2 text-gray-500" />
            <span>{request.user.name} ({request.user.email})</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              Requested: {new Date(request.preferredDate).toLocaleDateString()} at {
                request.preferredTimeSlot || new Date(request.preferredDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            </span>
          </div>
        </div>
        
        {request.message && (
          <div className="bg-gray-50 p-3 rounded-md mb-4 text-sm">
            <p className="font-medium mb-1">Customer message:</p>
            <p className="text-gray-600">{request.message}</p>
          </div>
        )}
        
        <Separator className="my-4" />
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            asChild
          >
            <a href={`/cars/${request.carId}`}>
              View Car
            </a>
          </Button>
          
          <MessageDialog 
            request={request}
            isResponseDialogOpen={isResponseDialogOpen}
            selectedRequest={selectedRequest}
            setIsResponseDialogOpen={setIsResponseDialogOpen}
            setResponseMessage={setResponseMessage}
            setSelectedRequest={setSelectedRequest}
          />
          
          {request.status === 'pending' && (
            <>
              <ApproveDialog 
                request={request}
                isResponseDialogOpen={isResponseDialogOpen}
                selectedRequest={selectedRequest}
                responseAction={responseAction}
                openResponseDialog={openResponseDialog}
                setIsResponseDialogOpen={setIsResponseDialogOpen}
                handleResponseSubmit={handleResponseSubmit}
              />
              
              <RejectDialog 
                request={request}
                isResponseDialogOpen={isResponseDialogOpen}
                selectedRequest={selectedRequest}
                responseAction={responseAction}
                openResponseDialog={openResponseDialog}
                setIsResponseDialogOpen={setIsResponseDialogOpen}
                handleResponseSubmit={handleResponseSubmit}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestCard;
