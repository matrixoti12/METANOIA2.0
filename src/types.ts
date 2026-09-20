export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'adoracion' | 'mensaje' | 'dinamica' | 'comunidad' | 'ministracion';
  icon: string;
  accentColor: 'cyan' | 'magenta' | 'yellow' | 'purple';
  tags: string[];
  keyHighlight?: string;
}

export interface Pillar {
  id: string;
  title: string;
  concept: string;
  description: string;
  scripture: string;
  iconName: string;
  accent: 'cyan' | 'magenta' | 'yellow';
}

export interface Squad {
  id: string;
  name: string;
  motto: string;
  color: string;
  bgGradient: string;
  borderGlow: string;
  badge: string;
}

export interface SeparatorConnection {
  code: string;
  squadId: string;
  participantName: string;
  connectedAt?: string;
  status: 'disconnected' | 'connecting' | 'connected';
}
