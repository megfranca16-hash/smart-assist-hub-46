import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users, Plus, Phone, Mail } from 'lucide-react';

interface KanbanBoardProps {
  user: any;
}

const stages = [
  { id: 'new', label: 'Novos', color: 'bg-blue-500' },
  { id: 'contacted', label: 'Contatados', color: 'bg-yellow-500' },
  { id: 'qualified', label: 'Qualificados', color: 'bg-purple-500' },
  { id: 'proposal', label: 'Proposta', color: 'bg-orange-500' },
  { id: 'negotiation', label: 'Negociação', color: 'bg-red-500' },
  { id: 'closed', label: 'Fechados', color: 'bg-green-500' }
];

export const KanbanBoard = ({ user }: KanbanBoardProps) => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await (supabase as any)
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar contatos:', error);
    }
  };

  const updateContactStage = async (contactId: string, newStage: string) => {
    try {
      const { error } = await (supabase as any)
        .from('contacts')
        .update({ stage: newStage })
        .eq('id', contactId);

      if (error) throw error;

      setContacts(contacts.map(contact => 
        contact.id === contactId ? { ...contact, stage: newStage } : contact
      ));

      toast({
        title: "Contato atualizado",
        description: "Estágio do contato foi alterado com sucesso!"
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getContactsByStage = (stage: string) => {
    return contacts.filter(contact => contact.stage === stage);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            CRM - Funil de Vendas
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 min-h-[600px]">
        {stages.map((stage) => {
          const stageContacts = getContactsByStage(stage.id);
          
          return (
            <Card key={stage.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  {stage.label}
                  <Badge variant="secondary" className="ml-auto">
                    {stageContacts.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-3">
                {stageContacts.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Nenhum contato</p>
                  </div>
                ) : (
                  stageContacts.map((contact) => (
                    <Card key={contact.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">{contact.name}</h4>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </div>
                        
                        {contact.email && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {contact.email}
                          </div>
                        )}
                        
                        {contact.tags && contact.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {contact.tags.slice(0, 2).map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <Badge 
                          variant="secondary" 
                          className={`text-xs w-fit ${
                            contact.status === 'customer' ? 'bg-green-100 text-green-800' :
                            contact.status === 'prospect' ? 'bg-blue-100 text-blue-800' :
                            contact.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {contact.status}
                        </Badge>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {stages.filter(s => s.id !== contact.stage).map((targetStage) => (
                            <Button
                              key={targetStage.id}
                              variant="ghost"
                              size="sm"
                              className="text-xs h-6 px-2"
                              onClick={() => updateContactStage(contact.id, targetStage.id)}
                            >
                              → {targetStage.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};