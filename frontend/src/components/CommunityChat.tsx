import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { Send, Users, Loader2, UserPlus, Plus, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import GroupList from '@/components/GroupList';
import axios from "axios";

interface Member {
  _id: string;
  name: string;
  profilePicture?: string;
}

interface Group {
  _id: string;
  name: string;
  description: string;
  members: Array<Member | string>;
  category: string;
  messages: Message[];
}

interface Message {
  _id: string;
  content: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
}

const CATEGORIES = [
  { value: "support", label: "Support Group" },
  { value: "wellness", label: "Wellness & Self-Care" },
  { value: "students", label: "Student Life" },
  { value: "positivity", label: "Positivity & Growth" },
  { value: "other", label: "Other" }
];

export function CommunityChat() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "", category: "" });
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupDetails(selectedGroup);
    }
  }, [selectedGroup]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/community`);
      setGroups(response.data);
      if (response.data.length > 0 && !selectedGroup) {
        setSelectedGroup(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupDetails = async (groupId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/community/${groupId}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching group details:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedGroup) return;
    setSendingMessage(true);
    try {
      const response = await api.post(`/community/${selectedGroup}/message`, { content: message });
      setMessages(prev => [...prev, response.data]);
      setMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const createGroup = async () => {
    if (!newGroup.name.trim() || !newGroup.description.trim() || !newGroup.category) return;
    setCreatingGroup(true);
    try {
      const response = await api.post(`/community`, newGroup);
      setGroups(prev => [response.data, ...prev]);
      setSelectedGroup(response.data._id);
      setActiveTab("chat");
      setNewGroup({ name: "", description: "", category: "" });
      setCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Community group created successfully!",
      });
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setCreatingGroup(false);
    }
  };

const joinGroup = async (groupId: string) => {
  try {
    const response = await api.post(`/community/${groupId}/join`);
    setGroups(prev =>
      prev.map(g => (g._id === groupId ? response.data : g))
    );
    toast({
      title: "Joined Group",
      description: "You have successfully joined the group",
    });
  } catch (error: any) {
    const msg = error?.response?.data?.message;

    // ✅ Treat "Already a member" as success
    if (msg === "Already a member of this group") {
      try {
        const res = await api.get(`/community/${groupId}`);
        setGroups(prev =>
          prev.map(g => (g._id === groupId ? res.data : g))
        );
        setMessages(res.data.messages || []);
        toast({
          title: "Already Joined",
          description: "You are already a member of this group.",
        });
        return;
      } catch (e) {
        console.error("Failed to refetch group:", e);
      }
    }

    console.error("Join group error:", error);
    toast({
      title: "Error",
      description: msg || "Could not join the group",
      variant: "destructive",
    });
  }
};

  
  const leaveGroup = async (groupId: string) => {
    try {
      const response = await api.post(`/community/${groupId}/leave`);
      setGroups(prev => prev.map(g => g._id === groupId ? response.data : g));
      toast({
        title: "Left Group",
        description: "You have left the group",
      });
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const refreshGroups = async () => {
    setRefreshing(true);
    await fetchGroups();
    setRefreshing(false);
    toast({
      title: "Refreshed",
      description: "Community groups have been refreshed",
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const groupMessagesByDate = () => {
    const grouped: { [key: string]: Message[] } = {};
    messages.forEach(message => {
      const date = new Date(message.createdAt).toLocaleDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(message);
    });
    return grouped;
  };

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const isGroupMember = (group: Group | undefined): boolean => {
    if (!user?.id || !group?.members) {
      return false;
    }
    return group.members.some(member => {
      if (typeof member === 'object' && member !== null && member._id) {
        return member._id.toString() === user.id.toString();
      }
      if (typeof member === 'string') {
        return member.toString() === user.id.toString();
      }
      return false;
    });
  };
  
  const currentGroup = groups.find(g => g._id === selectedGroup);

  return (
    <Card className="flex flex-col min-h-[600px] shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Community Support
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={refreshGroups} disabled={refreshing}>
              {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" /> New Group</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Community Group</DialogTitle>
                  <DialogDescription>
                    Create a new group to connect with others on similar wellness journeys.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="group-name">Group Name</Label>
                    <Input id="group-name" value={newGroup.name} onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })} placeholder="Give your group a name"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="group-description">Description</Label>
                    <Textarea id="group-description" value={newGroup.description} onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })} placeholder="What is this group about?" rows={3}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="group-category">Category</Label>
                    <Select value={newGroup.category} onValueChange={(value) => setNewGroup({ ...newGroup, category: value })}>
                      <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={createGroup} disabled={creatingGroup}>
                    {creatingGroup && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Create Group
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1">
          <div className="px-4 border-b">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="chat" className="flex-1 flex flex-col">
            {!currentGroup ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a group to start chatting or create a new one.
              </div>
            ) : loading && messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-wellness-green" />
              </div>
            ) : (
              <>
                <div className="border-b p-2 bg-muted/30">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{currentGroup.name}</span>
                    {isGroupMember(currentGroup) ? (
                      <Button variant="ghost" size="sm" onClick={() => leaveGroup(currentGroup._id)}>Leave</Button>
                    ) : (
                      <Button variant="default" size="sm" onClick={() => joinGroup(currentGroup._id)}>
                        <UserPlus className="h-4 w-4 mr-1" /> Join
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No messages yet. Be the first to say hello!
                    </div>
                  ) : (
                    Object.entries(groupMessagesByDate()).map(([date, msgs]) => (
                      <div key={date} className="space-y-4">
                        <div className="flex justify-center">
                          <Badge variant="outline" className="bg-background">
                            {new Date(msgs[0].createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                          </Badge>
                        </div>
                        {msgs.map((msg) => (
                          <div key={msg._id} className={`flex ${msg.user._id === user?.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex ${msg.user._id === user?.id ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
                              <Avatar className={`h-8 w-8 ${msg.user._id === user?.id ? 'ml-2' : 'mr-2'}`}>
                                <AvatarImage src={msg.user.profilePicture || ""} />
                                <AvatarFallback className={msg.user._id === user?.id ? "bg-wellness-green-light text-wellness-green-dark" : "bg-wellness-purple-light text-wellness-purple-dark"}>
                                  {getInitials(msg.user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className={`rounded-lg p-3 text-sm ${msg.user._id === user?.id ? 'bg-wellness-green text-white' : 'bg-gray-100 text-gray-800'}`}>
                                  {msg.content}
                                </div>
                                <div className={`text-xs text-gray-500 mt-1 ${msg.user._id === user?.id ? 'text-right' : 'text-left'}`}>
                                  {msg.user.name} • {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="p-3 border-t">
                  {isGroupMember(currentGroup) ? (
                    <div className="flex space-x-2">
                      <Input placeholder="Type your message..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyPress} disabled={sendingMessage} className="flex-1" />
                      <Button onClick={sendMessage} disabled={!message.trim() || sendingMessage} className="bg-wellness-green hover:bg-wellness-green-dark text-white">
                        {sendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-sm text-muted-foreground p-2">
                      Join this group to send messages
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="groups" className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-wellness-green" />
              </div>
            ) : (
              <GroupList
                groups={groups}
                currentUserId={user.id}
                joinGroup={joinGroup}
                setSelectedGroup={(groupId) => {
                  setSelectedGroup(groupId);
                  setActiveTab("chat");
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}