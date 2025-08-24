import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, Phone, Search, Plus, RefreshCw, Send, User } from 'lucide-react';
import { AIAssistantsBar } from '../ai-assistants-bar';

interface WhatsAppInterfaceProps {
  user: any;
}

export const WhatsAppInterface = ({ user }: WhatsAppInterfaceProps) => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newContactOpen, setNewContactOpen] = useState(false);
  const [profile, setProfile] = useState({
    attendant_name: '',
    department_name: '',
    signature: ''
  });
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    tags: ''
  });

  useEffect(() => {
    if (user) {
      fetchContacts();
      fetchProfile();
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

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('attendant_name, department_name, signature')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          attendant_name: data.attendant_name || '',
          department_name: data.department_name || '',
          signature: data.signature || ''
        });
      }
    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !selectedContact) return;

    // Adicionar assinatura se não estiver presente
    let messageWithSignature = currentMessage;
    const signature = profile.signature || 
      (profile.attendant_name && profile.department_name ? 
        `${profile.attendant_name} - ${profile.department_name}` : '');
    
    if (signature && !messageWithSignature.includes(signature)) {
      messageWithSignature += `\n\n${signature}`;
    }

    const newMessage = {
      id: Date.now().toString(),
      text: messageWithSignature,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');
  };

  const handleCreateContact = async () => {
    if (!newContact.name || !newContact.phone || !user) return;
    
    try {
      const tags = newContact.tags ? newContact.tags.split(',').map(tag => tag.trim()) : [];
      
      const { error } = await (supabase as any)
        .from('contacts')
        .insert([{
          name: newContact.name,
          phone: newContact.phone,
          email: newContact.email || null,
          tags: tags,
          user_id: user.id,
          status: 'lead',
          stage: 'new'
        }]);

      if (error) throw error;

      toast({
        title: "Contato criado",
        description: "Novo contato adicionado com sucesso!"
      });
      
      fetchContacts();
      setNewContact({ name: '', phone: '', email: '', tags: '' });
      setNewContactOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSyncContacts = () => {
    // Simular sincronização com contatos de exemplo
    const exampleContacts = [
      { name: 'João Silva', phone: '(11) 99999-0001', email: 'joao@email.com', tags: ['cliente'] },
      { name: 'Maria Santos', phone: '(11) 99999-0002', email: 'maria@email.com', tags: ['lead'] },
      { name: 'Pedro Costa', phone: '(11) 99999-0003', email: 'pedro@email.com', tags: ['prospect'] }
    ];

    exampleContacts.forEach(async (contact) => {
      try {
        await (supabase as any)
          .from('contacts')
          .insert([{
            ...contact,
            user_id: user.id,
            status: 'lead',
            stage: 'new'
          }]);
      } catch (error) {
        console.error('Erro ao inserir contato:', error);
      }
    });

    setTimeout(() => {
      fetchContacts();
      toast({
        title: "Contatos sincronizados",
        description: "Contatos do WhatsApp foram importados com sucesso!"
      });
    }, 1000);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  return (
    <div className="h-[600px] flex border rounded-lg overflow-hidden">
      {/* Lista de Contatos */}
      <div className="w-1/3 border-r bg-muted/30">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">WhatsApp Web</h3>
          </div>
          
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar contatos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Dialog open={newContactOpen} onOpenChange={setNewContactOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <Plus className="h-4 w-4 mr-1" />
                  Novo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Contato</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newContact.email}
                      onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                    <Input
                      id="tags"
                      value={newContact.tags}
                      onChange={(e) => setNewContact({...newContact, tags: e.target.value})}
                      placeholder="cliente, vip, suporte"
                    />
                  </div>
                  <Button onClick={handleCreateContact} className="w-full">
                    Criar Contato
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" onClick={handleSyncContacts}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Sync
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[500px]">
          {filteredContacts.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum contato encontrado</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-muted/50 ${
                    selectedContact?.id === contact.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{contact.name}</h4>
                      <p className="text-xs text-muted-foreground">{contact.phone}</p>
                      {contact.tags && contact.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {contact.tags.slice(0, 2).map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Header do Chat */}
            <div className="p-4 border-b bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">{selectedContact.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {selectedContact.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Mensagens */}
            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Inicie uma conversa com {selectedContact.name}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'me'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Assistentes IA */}
            <div className="border-t p-2">
              <AIAssistantsBar
                attendantName={profile.attendant_name}
                department={profile.department_name}
                onMessageGenerated={(message) => setCurrentMessage(message)}
              />
            </div>

            {/* Input de Mensagem */}
            <div className="p-4 border-t">
              {profile.signature && (
                <div className="mb-2 text-xs text-muted-foreground">
                  Assinatura: {profile.signature}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!currentMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Selecione um contato</p>
              <p className="text-sm">Escolha um contato para iniciar a conversa</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};