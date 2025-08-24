import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle, Users, Bot, BarChart3, Phone, Mail, Shield, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CRMDashboard } from '@/components/crm/crm-dashboard';

const Index = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleLogin = () => {
    if (loginData.email && loginData.password) {
      // Mock authentication
      const mockUser = {
        id: '1',
        email: loginData.email,
        name: loginData.email.split('@')[0]
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      setShowLogin(false);
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao RDA WHATSAPP WEB"
      });
    } else {
      toast({
        title: "Erro",
        description: "Preencha email e senha",
        variant: "destructive"
      });
    }
  };

  const handleQRCodeLogin = () => {
    // Mock QR Code login
    const mockUser = {
      id: '1',
      email: 'whatsapp@user.com',
      name: 'WhatsApp User'
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    setShowLogin(false);
    toast({
      title: "QR Code escaneado!",
      description: "Conectado via WhatsApp Web"
    });
  };

  if (isAuthenticated) {
    return <CRMDashboard user={user} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">RDA WHATSAPP WEB</h1>
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setShowLogin(true)}
                className="hidden sm:flex"
              >
                Fazer Login
              </Button>
              <Button 
                onClick={() => setShowLogin(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Acessar CRM
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            CRM Completo para
            <span className="text-green-600 block">WhatsApp Business</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistema completo de CRM, automação de mensagens, chatbots com IA e gestão de atendimento 
            para WhatsApp Web. Aumente suas vendas com inteligência artificial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setShowLogin(true)}
              className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Começar Agora
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setShowLogin(true)}
              className="text-lg px-8 py-4"
            >
              <Phone className="mr-2 h-5 w-5" />
              Conectar WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Recursos Principais
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>CRM Kanban</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Gerencie leads e clientes com sistema visual drag-and-drop. 
                  Organize seu funil de vendas de forma intuitiva.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle>Automação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Envio automatizado de mensagens em massa com agendamento 
                  preciso e segmentação avançada.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Bot className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Chatbots IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Atendimento 24/7 com IA avançada. ChatGPT, Claude e Gemini 
                  integrados para respostas inteligentes.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Relatórios completos de performance, conversões e 
                  métricas de atendimento em tempo real.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Por que escolher o RDA WhatsApp Web?
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Shield className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">100% Seguro</h4>
                    <p className="text-gray-600">Conexão segura com WhatsApp Web oficial</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MessageCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Interface Integrada</h4>
                    <p className="text-gray-600">Painel lateral no WhatsApp com todas as funcionalidades</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Bot className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">IA Avançada</h4>
                    <p className="text-gray-600">Chatbots inteligentes com processamento de linguagem natural</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Comece Gratuitamente
              </h4>
              <Button 
                size="lg" 
                onClick={() => setShowLogin(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-4"
              >
                Acessar Sistema Completo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Login Dialog */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-green-600" />
              Acessar RDA WhatsApp Web
            </DialogTitle>
            <DialogDescription>
              Faça login para acessar o sistema completo de CRM e automação
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* QR Code Login */}
            <Button 
              onClick={handleQRCodeLogin}
              className="w-full bg-green-600 hover:bg-green-700 py-6"
              size="lg"
            >
              <Phone className="mr-2 h-5 w-5" />
              Conectar via QR Code WhatsApp
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Ou</span>
              </div>
            </div>

            {/* Email Login */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                />
              </div>
              <Button 
                onClick={handleLogin}
                className="w-full"
                variant="outline"
              >
                <Mail className="mr-2 h-4 w-4" />
                Entrar com Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;