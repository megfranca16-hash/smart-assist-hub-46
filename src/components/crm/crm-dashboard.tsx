import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, Send, MessageCircle, Bot, BarChart3, Settings, LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('crm');

  const handleLogout = () => {
    window.location.reload();
    toast({
      title: "Logout realizado",
      description: "Até logo!"
    });
  };

  const tabs = [
    { id: 'crm', label: 'CRM Kanban', icon: Users },
    { id: 'automation', label: 'Automação', icon: Send },
    { id: 'whatsapp', label: 'WhatsApp Web', icon: MessageCircle },
    { id: 'chatbots', label: 'Chatbots IA', icon: Bot },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <MessageCircle className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RDA WHATSAPP WEB</h1>
                <p className="text-sm text-gray-500">Sistema completo de CRM e automação</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.name || user?.email}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Bem-vindo ao RDA WHATSAPP WEB
            </CardTitle>
            <p className="text-green-100">
              Gerencie seus contatos, automatize mensagens e use IA para melhorar seu atendimento
            </p>
          </CardHeader>
        </Card>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
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
    </div>
  );
};