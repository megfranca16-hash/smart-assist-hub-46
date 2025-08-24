import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send, MessageSquare, Calendar, Users, Plus, Edit3 } from 'lucide-react';

interface MessageAutomationProps {
  user: any;
}

export const MessageAutomation = ({ user }: MessageAutomationProps) => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    content: '',
    category: ''
  });
  
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    template_id: '',
    scheduled_at: ''
  });

  useEffect(() => {
    if (user) {
      fetchTemplates();
      fetchCampaigns();
      fetchContacts();
    }
  }, [user]);

  const fetchTemplates = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await (supabase as any)
        .from('message_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar templates:', error);
    }
  };

  const fetchCampaigns = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await (supabase as any)
        .from('campaigns')
        .select('*, message_templates(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar campanhas:', error);
    }
  };

  const fetchContacts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await (supabase as any)
        .from('contacts')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar contatos:', error);
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplate.name || !newTemplate.content || !user) return;
    
    try {
      const { error } = await (supabase as any)
        .from('message_templates')
        .insert([{
          ...newTemplate,
          user_id: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Template criado",
        description: "Template de mensagem criado com sucesso!"
      });
      
      fetchTemplates();
      setNewTemplate({ name: '', content: '', category: '' });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCreateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.template_id || !user) return;
    
    try {
      const { error } = await (supabase as any)
        .from('campaigns')
        .insert([{
          ...newCampaign,
          user_id: user.id,
          total_contacts: contacts.length,
          status: newCampaign.scheduled_at ? 'scheduled' : 'draft'
        }]);

      if (error) throw error;

      toast({
        title: "Campanha criada",
        description: "Campanha de mensagens criada com sucesso!"
      });
      
      fetchCampaigns();
      setNewCampaign({ name: '', template_id: '', scheduled_at: '' });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const categories = [...new Set(templates.map(t => t.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Automação de Mensagens
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-4 w-4" />
              Templates de Mensagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Criar Template */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm">Criar Novo Template</h4>
              <Input
                placeholder="Nome do template"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
              />
              <Input
                placeholder="Categoria (ex: vendas, suporte)"
                value={newTemplate.category}
                onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
              />
              <Textarea
                placeholder="Conteúdo da mensagem..."
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                className="h-24"
              />
              <Button onClick={handleCreateTemplate} size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Criar Template
              </Button>
            </div>

            {/* Lista de Templates */}
            <div className="space-y-2">
              {templates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum template criado</p>
                </div>
              ) : (
                templates.map((template) => (
                  <Card key={template.id} className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        {template.category && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {template.category}
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {template.content}
                    </p>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Campanhas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-4 w-4" />
              Campanhas de Envio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Criar Campanha */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm">Nova Campanha</h4>
              <Input
                placeholder="Nome da campanha"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
              />
              <Select 
                value={newCampaign.template_id} 
                onValueChange={(value) => setNewCampaign({...newCampaign, template_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} {template.category && `(${template.category})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="datetime-local"
                placeholder="Agendar envio (opcional)"
                value={newCampaign.scheduled_at}
                onChange={(e) => setNewCampaign({...newCampaign, scheduled_at: e.target.value})}
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{contacts.length} contatos serão incluídos</span>
              </div>
              <Button onClick={handleCreateCampaign} size="sm" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Criar Campanha
              </Button>
            </div>

            {/* Lista de Campanhas */}
            <div className="space-y-2">
              {campaigns.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma campanha criada</p>
                </div>
              ) : (
                campaigns.map((campaign) => (
                  <Card key={campaign.id} className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{campaign.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Template: {campaign.message_templates?.name || 'N/A'}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          campaign.status === 'completed' ? 'default' :
                          campaign.status === 'running' ? 'secondary' :
                          campaign.status === 'scheduled' ? 'outline' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{campaign.total_contacts} contatos</span>
                      <span>{campaign.sent_count || 0} enviados</span>
                      {campaign.scheduled_at && (
                        <span>Agendado: {new Date(campaign.scheduled_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};