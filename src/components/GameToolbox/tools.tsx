import React from 'react';
import { 
  Dice1, 
  Plus, 
  Shield,
  Heart,
  Eye,
  RotateCcw,
  Search,
  Trash2
} from 'lucide-react';

export const tools = [
  { 
    id: 'dice', 
    icon: <Dice1 size={20} />, 
    label: 'Roll Dice'
  },
  { 
    id: 'token', 
    icon: <Plus size={20} />, 
    label: 'Create Token'
  },
  { 
    id: 'counter', 
    icon: <Shield size={20} />, 
    label: 'Add Counter'
  },
  { 
    id: 'life', 
    icon: <Heart size={20} />, 
    label: 'Life Total'
  },
  { 
    id: 'view', 
    icon: <Eye size={20} />, 
    label: 'View Library'
  },
  { 
    id: 'untap', 
    icon: <RotateCcw size={20} />, 
    label: 'Untap All'
  },
  { 
    id: 'search', 
    icon: <Search size={20} />, 
    label: 'Search Library'
  },
  { 
    id: 'clear', 
    icon: <Trash2 size={20} />, 
    label: 'Clear Battlefield'
  }
];