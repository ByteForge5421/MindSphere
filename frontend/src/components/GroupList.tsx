import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus } from "lucide-react";

interface Member {
  _id: string;
  name: string;
  profilePicture?: string;
}

// --- FIX: Make this interface consistent with the parent component ---
interface Group {
  _id: string;
  name: string;
  description: string;
  members: Array<Member | string>; // Now accepts objects or strings
  category: string;
}

interface GroupListProps {
  groups: Group[];
  currentUserId: string;
  joinGroup: (groupId: string) => void;
  setSelectedGroup: (groupId: string) => void;
}

const GroupList: React.FC<GroupListProps> = ({ groups, currentUserId, joinGroup, setSelectedGroup }) => {
  
  const isMember = (group: Group) => {
    if (!currentUserId || !group || !group.members) return false;
    return group.members.some(member => {
      if (typeof member === 'object' && member !== null && member._id) {
        return member._id.toString() === currentUserId.toString();
      }
      if (typeof member === 'string') {
        return member.toString() === currentUserId.toString();
      }
      return false;
    });
  };
  
  if (groups.length === 0) {
    return (
        <div className="text-center py-8">
            <h3 className="text-lg font-medium">No community groups yet</h3>
            <p className="text-sm text-muted-foreground">Be the first to create one!</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div 
          key={group._id} 
          className="p-4 border rounded-md cursor-pointer transition-colors hover:bg-gray-50"
          onClick={() => setSelectedGroup(group._id)}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900">{group.name}</h3>
            <Badge variant="outline">{group.category}</Badge>
          </div>
          <p className="text-sm text-gray-600 mt-1">{group.description}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-xs text-gray-500">
              <Users className="h-3 w-3 mr-1" />
              {group.members.length} member{group.members.length !== 1 ? 's' : ''}
            </div>
            {!isMember(group) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  joinGroup(group._id);
                }}
              >
                <UserPlus className="h-3 w-3 mr-1" />
                Join
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupList;