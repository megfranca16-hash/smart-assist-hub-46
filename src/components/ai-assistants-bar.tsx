import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bot, Sparkles, Brain, Zap } from 'lucide-react';

interface AIAssistantsBarProps {
  attendantName?: string;
  department?: string;
  onMessageGenerated: (message: string) => void;
}

export const AIAssistantsBar = ({ 
  attendantName = '', 
  department = '', 
  onMessageGenerated 
}: AIAssistantsBarProps) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  const providers = [
    { 
      id: 'chatgpt', 
      name: 'ChatGPT', 
      icon: Bot, 
      color: 'bg-green-500',
      description: 'OpenAI GPT-4'
    },
    { 
      id: 'claude', 
      name: 'Claude', 
      icon: Brain, 
      color: 'bg-orange-500',
      description: 'Anthropic Claude'
    },
    { 
      id: 'gemini', 
      name: 'Gemini', 
      icon: Sparkles, 
      color: 'bg-blue-500',
      description: 'Google Gemini'
    }
  ];

  const handleGenerate = async (providerId: string) => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt necessário",
        description: "Digite uma instrução para gerar a resposta",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    setActiveProvider(providerId);

    try {
      // Simular geração de resposta
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const provider = providers.find(p => p.id === providerId);
      const signature = attendantName && department ? 
        `${attendantName} - ${department}` : 
        (attendantName || department || 'Atendimento');

      const generatedMessage = `Olá! Baseado em sua solicitação "${prompt}", aqui está uma resposta personalizada:

Esta é uma resposta gerada pelo ${provider?.name} para ajudar no atendimento ao cliente. A mensagem foi criada considerando o contexto e pode ser editada antes do envio.

Atenciosamente,
${signature}`;

      onMessageGenerated(generatedMessage);
      setPrompt('');
      
      toast({
        title: "Resposta gerada",
        description: `${provider?.name} gerou uma resposta para você!`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar a resposta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
      setActiveProvider(null);
    }
  };

  return (
    <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium">Assistentes IA</span>
        {(attendantName || department) && (
          <Badge variant="outline" className="text-xs">
            {attendantName || department}
          </Badge>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Digite uma instrução para a IA (ex: responder dúvida sobre produto)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 text-sm"
          disabled={generating}
        />
      </div>

      <div className="flex gap-2">
        {providers.map((provider) => {
          const Icon = provider.icon;
          const isActive = activeProvider === provider.id;
          
          return (
            <Button
              key={provider.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => handleGenerate(provider.id)}
              disabled={generating}
              className="flex-1 text-xs"
            >
              <Icon className="h-3 w-3 mr-1" />
              {isActive && generating ? 'Gerando...' : provider.name}
            </Button>
          );
        })}
      </div>

      {generating && (
        <div className="text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>Gerando resposta com {providers.find(p => p.id === activeProvider)?.name}...</span>
          </div>
        </div>
      )}
    </div>
  );
};