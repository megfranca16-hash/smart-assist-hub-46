import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Send, MessageCircle, Bot, BarChart3, Settings } from 'lucide-react';

import { KanbanBoard } from './kanban-board';
import { MessageAutomation } from './message-automation';
import { WhatsAppInterface } from './whatsapp-interface';
import { Chatbots } from './chatbots';
import { AnalyticsDashboard } from './analytics-dashboard';
import { AttendantSettings } from '../attendant-settings';

interface CRMDashboardProps {
  user: any;
}

export const CRMDashboard = ({ user }: CRMDashboardProps) => {
  const [activeTab, setActiveTab] = useState('crm');

  const tabs = [
    { id: 'crm', label: 'CRM Kanban', icon: Users },
    { id: 'automation', label: 'Automação', icon: Send },
    { id: 'whatsapp', label: 'WhatsApp Web', icon: MessageCircle },
    { id: 'chatbots', label: 'Chatbots IA', icon: Bot },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">RDA WHATSAPP WEB</CardTitle>
          <p className="text-muted-foreground">
            Sistema completo de CRM e automação para WhatsApp
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="crm" className="space-y-4">
          <KanbanBoard user={user} />
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <MessageAutomation user={user} />
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-4">
          <WhatsAppInterface user={user} />
        </TabsContent>

        <TabsContent value="chatbots" className="space-y-4">
          <Chatbots user={user} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <AttendantSettings user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};