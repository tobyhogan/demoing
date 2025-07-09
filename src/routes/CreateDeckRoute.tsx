import { useNavigate } from 'react-router-dom';
import { CreateDeckPage } from '../components/CreateDeckPage';

interface CreateDeckRouteProps {
  onCreateDeck: (name: string, description: string, color: string) => Promise<void>;
}

export function CreateDeckRoute({ onCreateDeck }: CreateDeckRouteProps) {
  const navigate = useNavigate();

  const handleCreateDeck = async (name: string, description: string, color: string) => {
    try {
      await onCreateDeck(name, description, color);
      navigate('/');
    } catch (error) {
      console.error('Failed to create deck:', error);
      // You could add error handling here (toast notification, etc.)
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <CreateDeckPage
      onCreateDeck={handleCreateDeck}
      onCancel={handleCancel}
    />
  );
}
