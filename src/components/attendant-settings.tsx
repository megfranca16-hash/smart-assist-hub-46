import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Phone, Building2, FileText } from 'lucide-react';

interface AttendantSettingsProps {
  user: any;
}

export const AttendantSettings = ({ user }: AttendantSettingsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    attendant_name: '',
    attendant_phone: '',
    department_name: '',
    department_phone: '',
    signature: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          attendant_name: data.attendant_name || '',
          attendant_phone: data.attendant_phone || '',
          department_name: data.department_name || '',
          department_phone: data.department_phone || '',
          signature: data.signature || ''
        });
      }
    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Primeiro, verificar se o perfil existe
      const { data: existingProfile } = await (supabase as any)
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        // Atualizar perfil existente
        const { error } = await (supabase as any)
          .from('profiles')
          .update(profile)
          .eq('id', user.id);

        if (error) throw error;
      } else {
        // Criar novo perfil
        const { error } = await (supabase as any)
          .from('profiles')
          .insert([{
            id: user.id,
            ...profile
          }]);

        if (error) throw error;
      }

      toast({
        title: "Perfil salvo",
        description: "Suas configurações foram atualizadas com sucesso!"
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Configurações do Atendente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="attendant_name">Nome do Atendente</Label>
            <Input
              id="attendant_name"
              placeholder="Seu nome completo"
              value={profile.attendant_name}
              onChange={(e) => setProfile({...profile, attendant_name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendant_phone">Telefone do Atendente</Label>
            <Input
              id="attendant_phone"
              placeholder="(11) 99999-9999"
              value={profile.attendant_phone}
              onChange={(e) => setProfile({...profile, attendant_phone: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department_name">Nome do Departamento</Label>
            <Input
              id="department_name"
              placeholder="Ex: Suporte, Vendas, Financeiro"
              value={profile.department_name}
              onChange={(e) => setProfile({...profile, department_name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department_phone">Telefone do Departamento</Label>
            <Input
              id="department_phone"
              placeholder="(11) 99999-9999"
              value={profile.department_phone}
              onChange={(e) => setProfile({...profile, department_phone: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signature">Assinatura Fixa</Label>
          <Textarea
            id="signature"
            placeholder="Ex: João Silva - Suporte Técnico"
            value={profile.signature}
            onChange={(e) => setProfile({...profile, signature: e.target.value})}
            className="h-20"
          />
          <p className="text-xs text-muted-foreground">
            Esta assinatura será adicionada automaticamente às suas mensagens
          </p>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Preview da Assinatura
          </h4>
          <p className="text-sm text-muted-foreground">
            {profile.signature || 
             (profile.attendant_name && profile.department_name ? 
              `${profile.attendant_name} - ${profile.department_name}` : 
              'Configure os campos acima para ver o preview')}
          </p>
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </CardContent>
    </Card>
  );
};