import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, MessageCircle, TrendingUp, Calendar } from 'lucide-react';

export const AnalyticsDashboard = () => {
  const [analytics] = useState({
    totalContacts: 45,
    activeChats: 12,
    messagesThisWeek: 234,
    conversionRate: 23.5,
    topPerformers: [
      { name: 'Vendas Bot', messages: 89, conversions: 12 },
      { name: 'Suporte IA', messages: 67, conversions: 8 },
      { name: 'Marketing Bot', messages: 45, conversions: 5 }
    ],
    weeklyStats: [
      { day: 'Seg', messages: 32, contacts: 8 },
      { day: 'Ter', messages: 45, contacts: 12 },
      { day: 'Qua', messages: 38, contacts: 9 },
      { day: 'Qui', messages: 52, contacts: 15 },
      { day: 'Sex', messages: 41, contacts: 11 },
      { day: 'Sáb', messages: 18, contacts: 4 },
      { day: 'Dom', messages: 8, contacts: 2 }
    ]
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics & Relatórios
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Contatos</p>
                <p className="text-2xl font-bold">{analytics.totalContacts}</p>
              </div>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+12% esta semana</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chats Ativos</p>
                <p className="text-2xl font-bold">{analytics.activeChats}</p>
              </div>
              <MessageCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+5% hoje</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mensagens/Semana</p>
                <p className="text-2xl font-bold">{analytics.messagesThisWeek}</p>
              </div>
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+18% vs semana anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Conversão</p>
                <p className="text-2xl font-bold">{analytics.conversionRate}%</p>
              </div>
              <BarChart3 className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+3.2% este mês</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chatbots com Melhor Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{performer.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {performer.messages} mensagens enviadas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {performer.conversions} conversões
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((performer.conversions / performer.messages) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gráfico Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Atividade Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.weeklyStats.map((stat, index) => {
                const maxMessages = Math.max(...analytics.weeklyStats.map(s => s.messages));
                const messageWidth = (stat.messages / maxMessages) * 100;
                const maxContacts = Math.max(...analytics.weeklyStats.map(s => s.contacts));
                const contactWidth = (stat.contacts / maxContacts) * 100;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{stat.day}</span>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>{stat.messages} msgs</span>
                        <span>{stat.contacts} contatos</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${messageWidth}%` }}
                        />
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-300"
                          style={{ width: `${contactWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span>Mensagens</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Novos Contatos</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};