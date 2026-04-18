export type ComplaintStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ComplaintTimelineEntry {
  label: string;
  timestamp: string;
  note: string;
}

export interface Complaint {
  id: number;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  department: string;
  citizenId: number;
  citizenName: string;
  assignedOfficerId?: number;
  assignedOfficerName?: string;
  imageUrl?: string;
  proofImageUrl?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
  feedbackRating?: number;
  feedbackComments?: string;
  timeline: ComplaintTimelineEntry[];
}
