import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bot, MessageSquare, Settings, Plus } from 'lucide-react';

interface ChatbotsProps {
  user: any;
}

export const Chatbots = ({ user }: ChatbotsProps) => {
  const { toast } = useToast();
  const [bots, setBots] = useState<any[]>([]);
  const [editingBot, setEditingBot] = useState<string | null>(null);
  const [editBot, setEditBot] = useState<any>(null);
  const [newBot, setNewBot] = useState({
    name: '',
    description: '',
    welcome_message: '',
    ai_provider: 'openai' as const,
    ai_model: 'gpt-4',
    prompt_template: '',
    department_name: ''
  });

  useEffect(() => {
    if (user) {
      fetchBots();
    }
  }, [user]);

  const fetchBots = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await (supabase as any)
        .from('chatbots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBots(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar chatbots:', error);
    }
  };

  const handleCreateBot = async () => {
    if (!newBot.name || !user) return;
    
    try {
      const { error } = await (supabase as any)
        .from('chatbots')
        .insert([{
          ...newBot,
          user_id: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Chatbot criado",
        description: "Seu chatbot foi criado com sucesso!"
      });
      
      fetchBots();
      setNewBot({
        name: '',
        description: '',
        welcome_message: '',
        ai_provider: 'openai',
        ai_model: 'gpt-4',
        prompt_template: '',
        department_name: ''
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEditBot = async () => {
    if (!editBot || !user) return;
    
    try {
      const { error } = await (supabase as any)
        .from('chatbots')
        .update({
          name: editBot.name,
          description: editBot.description,
          welcome_message: editBot.welcome_message,
          ai_provider: editBot.ai_provider,
          ai_model: editBot.ai_model,
          prompt_template: editBot.prompt_template,
          department_name: editBot.department_name
        })
        .eq('id', editBot.id);

      if (error) throw error;

      toast({
        title: "Chatbot atualizado",
        description: "Chatbot editado com sucesso!"
      });
      
      fetchBots();
      setEditBot(null);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const toggleBot = async (id: string, isActive: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('chatbots')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      setBots(bots.map(bot => 
        bot.id === id ? { ...bot, is_active: isActive } : bot
      ));

      toast({
        title: isActive ? "Chatbot ativado" : "Chatbot desativado",
        description: `O chatbot foi ${isActive ? 'ativado' : 'desativado'} com sucesso!`
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Chatbots Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum chatbot configurado ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bots.map((bot) => (
                <Card key={bot.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-sm">{bot.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{bot.description}</p>
                      {bot.department_name && (
                        <p className="text-xs text-blue-600 mt-1">Depto: {bot.department_name}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={bot.is_active} 
                        onCheckedChange={(checked) => toggleBot(bot.id, checked)}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditBot(bot);
                          setEditingBot(bot.id);
                        }}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <Bot className="h-3 w-3 text-blue-500" />
                      <span>{bot.ai_provider} - {bot.ai_model}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-3 w-3 text-green-500" />
                      <span className="truncate">{bot.welcome_message || 'Sem mensagem'}</span>
                    </div>
                  </div>

                  {editingBot === bot.id && editBot && (
                    <div className="mt-3 pt-3 border-t space-y-2">
                      <Input
                        placeholder="Nome do bot"
                        value={editBot.name}
                        onChange={(e) => setEditBot({...editBot, name: e.target.value})}
                        className="text-xs"
                      />
                      <Input
                        placeholder="Departamento"
                        value={editBot.department_name || ''}
                        onChange={(e) => setEditBot({...editBot, department_name: e.target.value})}
                        className="text-xs"
                      />
                      <Textarea
                        placeholder="Descrição"
                        value={editBot.description || ''}
                        onChange={(e) => setEditBot({...editBot, description: e.target.value})}
                        className="text-xs h-16"
                      />
                      <Input
                        placeholder="Mensagem de boas-vindas"
                        value={editBot.welcome_message || ''}
                        onChange={(e) => setEditBot({...editBot, welcome_message: e.target.value})}
                        className="text-xs"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs" onClick={handleEditBot}>
                          Salvar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-xs"
                          onClick={() => {
                            setEditingBot(null);
                            setEditBot(null);
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Criar Novo Chatbot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Input
                placeholder="Nome do chatbot"
                value={newBot.name}
                onChange={(e) => setNewBot({...newBot, name: e.target.value})}
                className="text-sm"
              />

              <Input
                placeholder="Departamento"
                value={newBot.department_name}
                onChange={(e) => setNewBot({...newBot, department_name: e.target.value})}
                className="text-sm"
              />
              
              <Textarea
                placeholder="Descrição do chatbot"
                value={newBot.description}
                onChange={(e) => setNewBot({...newBot, description: e.target.value})}
                className="text-sm"
              />

              <Input
                placeholder="Mensagem de boas-vindas"
                value={newBot.welcome_message}
                onChange={(e) => setNewBot({...newBot, welcome_message: e.target.value})}
                className="text-sm"
              />

              <Select 
                value={newBot.ai_provider} 
                onValueChange={(value: any) => setNewBot({...newBot, ai_provider: value})}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Provedor de IA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI (ChatGPT)</SelectItem>
                  <SelectItem value="claude">Anthropic (Claude)</SelectItem>
                  <SelectItem value="gemini">Google (Gemini)</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Modelo de IA (ex: gpt-4)"
                value={newBot.ai_model}
                onChange={(e) => setNewBot({...newBot, ai_model: e.target.value})}
                className="text-sm"
              />

              <Textarea
                placeholder="Template de prompt personalizado"
                value={newBot.prompt_template}
                onChange={(e) => setNewBot({...newBot, prompt_template: e.target.value})}
                className="text-sm h-20"
              />

              <Button onClick={handleCreateBot} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Criar Chatbot
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};